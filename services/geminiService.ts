
import { GoogleGenAI, Type } from "@google/genai";
import { ScanResult, Severity, ScanConfig } from "../types";

const vulnerabilitySchema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING, description: "Internal finding ID (e.g., VULN-001)" },
    title: { type: Type.STRING, description: "Concise name of the vulnerability." },
    severity: { type: Type.STRING, enum: [Severity.CRITICAL, Severity.HIGH, Severity.MEDIUM, Severity.LOW, Severity.INFO] },
    description: { type: Type.STRING, description: "Deep technical explanation of the flaw." },
    affectedUrl: { type: Type.STRING, description: "Endpoint, parameter, or line of code affected." },
    impact: { type: Type.STRING, description: "Potential consequences for the organization." },
    fixCode: { type: Type.STRING, description: "Remediation code snippet or config change." },
    fixExplanation: { type: Type.STRING, description: "Step-by-step fix instructions." },
    proofOfConcept: { type: Type.STRING, description: "MANDATORY: Actual payload (e.g. ' OR 1=1 --) or HTTP request evidence." },
    cwe: { type: Type.STRING, description: "CWE-ID (e.g., CWE-79)" },
    capec: { type: Type.STRING, description: "CAPEC-ID (e.g., CAPEC-63)" },
    cvssScore: { type: Type.NUMBER, description: "CVSS v3.1 Base Score (0.0-10.0)" },
    cvssVector: { type: Type.STRING, description: "CVSS v3.1 Vector String" }
  },
  required: ["id", "title", "severity", "description", "affectedUrl", "impact", "fixCode", "fixExplanation", "proofOfConcept", "cvssScore"]
};

const probableVulnerabilitySchema = {
  type: Type.OBJECT,
  properties: {
    category: { type: Type.STRING, description: "e.g., Business Logic, Access Control" },
    title: { type: Type.STRING, description: "Suspected vulnerability name." },
    likelihood: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
    location: { type: Type.STRING, description: "Suspected endpoint or parameter." },
    reasoning: { type: Type.STRING, description: "Why is this suspected based on patterns?" },
    verificationSteps: { type: Type.STRING, description: "How a human auditor can confirm this flaw." }
  },
  required: ["category", "title", "likelihood", "location", "reasoning", "verificationSteps"]
};

const scanResultSchema = {
  type: Type.OBJECT,
  properties: {
    target: { type: Type.STRING },
    scanType: { type: Type.STRING, enum: ["url", "code"] },
    siteDescription: { type: Type.STRING, description: "Analysis of the target's tech stack and purpose." },
    summary: { type: Type.STRING, description: "Brief overview of security posture." },
    riskScore: { type: Type.NUMBER, description: "0 (Critical) to 100 (Secure) health score." },
    maturityLevel: { type: Type.STRING, enum: ["Hardened", "Enterprise", "Standard", "Vulnerable"] },
    securityMetrics: {
      type: Type.OBJECT,
      properties: {
        authScore: { type: Type.NUMBER },
        dbScore: { type: Type.NUMBER },
        networkScore: { type: Type.NUMBER },
        clientScore: { type: Type.NUMBER },
        complianceScore: { type: Type.NUMBER }
      },
      required: ["authScore", "dbScore", "networkScore", "clientScore", "complianceScore"]
    },
    owaspDistribution: { 
      type: Type.ARRAY, 
      items: { 
        type: Type.OBJECT, 
        properties: { 
          category: { type: Type.STRING }, 
          count: { type: Type.NUMBER } 
        },
        required: ["category", "count"]
      } 
    },
    techStack: { 
      type: Type.ARRAY, 
      items: { 
        type: Type.OBJECT, 
        properties: { 
          name: { type: Type.STRING }, 
          category: { type: Type.STRING, enum: ["Frontend", "Backend", "Database", "Server", "Other"] },
          version: { type: Type.STRING }
        },
        required: ["name", "category"]
      } 
    },
    vulnerabilities: { type: Type.ARRAY, items: vulnerabilitySchema },
    probableVulnerabilities: { type: Type.ARRAY, items: probableVulnerabilitySchema },
    headers: { 
      type: Type.ARRAY, 
      items: { 
        type: Type.OBJECT, 
        properties: { 
          name: { type: Type.STRING }, 
          value: { type: Type.STRING }, 
          status: { type: Type.STRING, enum: ["secure", "warning", "missing"] } 
        },
        required: ["name", "value", "status"]
      } 
    },
    ports: { 
      type: Type.ARRAY, 
      items: { 
        type: Type.OBJECT, 
        properties: { 
          port: { type: Type.NUMBER }, 
          protocol: { type: Type.STRING }, 
          service: { type: Type.STRING }, 
          state: { type: Type.STRING, enum: ["open", "closed", "filtered"] }, 
          risk: { type: Type.STRING, enum: ["Safe", "Low", "Medium", "High", "Critical"] } 
        },
        required: ["port", "protocol", "service", "state", "risk"]
      } 
    },
    sitemap: { type: Type.ARRAY, items: { type: Type.STRING } },
    apiEndpoints: { type: Type.ARRAY, items: { type: Type.STRING } },
    executiveSummary: { type: Type.STRING, description: "Formal report summary for stakeholders." }
  },
  required: [
    "target", "scanType", "siteDescription", "summary", "riskScore", "maturityLevel", 
    "securityMetrics", "owaspDistribution", "techStack", "vulnerabilities", 
    "probableVulnerabilities", "headers", "ports", "sitemap", "apiEndpoints", "executiveSummary"
  ]
};

export const runScan = async (
  target: string, 
  type: 'url' | 'code', 
  activeModules: string[] = [],
  config: ScanConfig = { aggressiveness: 'deep', sensitivity: 'all-findings', model: 'pro' }
): Promise<ScanResult> => {
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const modelName = config.model === 'pro' ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';

  const systemInstruction = `You are WebSec Ultra, an Elite Senior Offensive Security Auditor.
  AUDIT PROTOCOL:
  1. RECONNAISSANCE: Fingerprint the target: "${target}". Identify probable OS, server, and framework.
  2. VULNERABILITY MAPPING: Cross-reference findings with the OWASP Top 10 (2021).
  3. EVIDENCE GENERATION: For every vulnerability, provide a functional Proof-of-Concept (PoC).
  4. HEURISTIC ANALYSIS: Identify 'Probable' flaws like IDOR or Logic flaws that automated tools miss.
  5. OUTPUT: Return strictly valid JSON following the provided schema.`;

  const userPrompt = `INITIATE SECURITY AUDIT
  TARGET: ${target}
  TYPE: ${type === 'url' ? 'Live Web Application' : 'Static Source Code Analysis'}
  INTENSITY: ${config.aggressiveness.toUpperCase()}
  ENABLED MODULES: ${activeModules.join(', ') || 'FULL SUITE'}`;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: scanResultSchema,
        thinkingConfig: { thinkingBudget: 16000 },
        temperature: 0.2
      }
    });

    if (!response.text) throw new Error("Intelligence node returned empty signal.");
    
    const result: ScanResult = JSON.parse(response.text);
    result.target = target;
    result.timestamp = new Date().toISOString();
    result.modelUsed = modelName;
    return result;

  } catch (error: any) {
    console.error("Critical System Failure in Intelligence Node:", error);
    throw new Error(error.message || "Uplink to intelligence node failed. Target may be hardened or link saturated.");
  }
};

export const queryAgent = async (history: {role: string, content: string}[], message: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `History:\n${history.map(m => `${m.role}: ${m.content}`).join('\n')}\nUser: ${message}`,
      config: { 
        systemInstruction: "You are Sentinel, the AI technical lead for WebSec Ultra. Provide concise, expert-level security advice. Focus on remediation and exploit mechanics.",
        thinkingConfig: { thinkingBudget: 1000 }
      }
    });
    return response.text || "Signal interrupted.";
  } catch (e) {
    return "Intelligence link saturated. System is under heavy load.";
  }
};
