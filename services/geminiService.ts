
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ScanResult, Severity, ScanConfig } from "../types";

// Professional security-focused schema
const vulnerabilitySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING },
    title: { type: Type.STRING },
    severity: { type: Type.STRING, enum: [Severity.CRITICAL, Severity.HIGH, Severity.MEDIUM, Severity.LOW, Severity.INFO] },
    description: { type: Type.STRING, description: "Detailed technical explanation of the flaw." },
    affectedUrl: { type: Type.STRING, description: "URL, Parameter, and HTTP Method (e.g., POST /api/v1/user [id])" },
    impact: { type: Type.STRING, description: "Detailed impact on Confidentiality, Integrity, and Availability." },
    fixCode: { type: Type.STRING, description: "Production-ready secure code or configuration snippet." },
    fixExplanation: { type: Type.STRING, description: "Detailed steps for developers to remediate the flaw." },
    proofOfConcept: { type: Type.STRING, description: "MANDATORY: Exact payload, curl command, or HTTP request proving the vulnerability." },
    cwe: { type: Type.STRING, description: "CWE Identifier (e.g., CWE-89)" },
    capec: { type: Type.STRING, description: "CAPEC Identifier (e.g., CAPEC-66)" },
    cvssScore: { type: Type.NUMBER, description: "CVSS v3.1 Base Score" },
    cvssVector: { type: Type.STRING, description: "CVSS v3.1 Vector String" }
  },
  required: ["id", "title", "severity", "description", "affectedUrl", "impact", "fixCode", "fixExplanation", "proofOfConcept", "cvssScore"]
};

const scanResultSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    target: { type: Type.STRING },
    scanType: { type: Type.STRING, enum: ["url", "code"] },
    siteDescription: { type: Type.STRING },
    summary: { type: Type.STRING },
    riskScore: { type: Type.NUMBER, description: "Overall health score 0-100." },
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
    owaspDistribution: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { category: { type: Type.STRING }, count: { type: Type.NUMBER } }, required: ["category", "count"] } },
    techStack: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, category: { type: Type.STRING }, version: { type: Type.STRING } }, required: ["name", "category"] } },
    vulnerabilities: { type: Type.ARRAY, items: vulnerabilitySchema },
    probableVulnerabilities: { 
      type: Type.ARRAY, 
      items: { 
        type: Type.OBJECT, 
        properties: { 
          category: { type: Type.STRING }, 
          title: { type: Type.STRING }, 
          likelihood: { type: Type.STRING, enum: ["High", "Medium", "Low"] }, 
          location: { type: Type.STRING }, 
          reasoning: { type: Type.STRING }, 
          verificationSteps: { type: Type.STRING } 
        }, 
        required: ["category", "title", "likelihood", "location", "reasoning", "verificationSteps"] 
      } 
    },
    headers: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, value: { type: Type.STRING }, status: { type: Type.STRING, enum: ["secure", "warning", "missing"] } }, required: ["name", "value", "status"] } },
    ports: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { port: { type: Type.NUMBER }, protocol: { type: Type.STRING }, service: { type: Type.STRING }, state: { type: Type.STRING, enum: ["open", "closed", "filtered"] }, risk: { type: Type.STRING, enum: ["Safe", "Low", "Medium", "High", "Critical"] } }, required: ["port", "protocol", "service", "state", "risk"] } },
    sitemap: { type: Type.ARRAY, items: { type: Type.STRING } },
    apiEndpoints: { type: Type.ARRAY, items: { type: Type.STRING } },
    executiveSummary: { type: Type.STRING, description: "Strategic summary for stakeholders." }
  },
  required: ["target", "scanType", "siteDescription", "summary", "riskScore", "maturityLevel", "securityMetrics", "owaspDistribution", "techStack", "vulnerabilities", "probableVulnerabilities", "headers", "ports", "sitemap", "apiEndpoints", "executiveSummary"]
};

export const runScan = async (
  target: string, 
  type: 'url' | 'code', 
  activeModules: string[] = [],
  config: ScanConfig = { aggressiveness: 'deep', sensitivity: 'all-findings', model: 'pro' }
): Promise<ScanResult> => {
  
  // Initialize inside the function to ensure process.env.API_KEY is available
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const modelName = config.model === 'pro' ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';

  const systemInstruction = `You are WebSec-AI, a Senior Offensive Security Engineer and Penetration Tester.
  AUDIT PROTOCOL:
  1. ANALYZE TARGET: Determine the most likely tech stack for "${target}".
  2. SIMULATE ATTACK: Reason through common vulnerabilities (SQLi, XSS, SSRF, IDOR, Logic Flaws).
  3. VALIDATE: For every finding, generate a technical Proof of Concept (PoC).
  4. REPORT: Return only a JSON object matching the provided schema.
  5. RIGOR: Ensure CVSS scores and CWE mappings are technically accurate.`;

  const userPrompt = `INITIATE SECURITY AUDIT
  TARGET: ${target}
  ENVIRONMENT: ${type === 'url' ? 'Live Web Application' : 'Source Code Snippet'}
  INTENSITY: ${config.aggressiveness.toUpperCase()}
  SCOPE: ${activeModules.join(', ') || 'FULL SYSTEM'}`;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: scanResultSchema,
        thinkingConfig: { thinkingBudget: 16000 }
      }
    });

    const result: ScanResult = JSON.parse(response.text);
    result.target = target;
    result.scanType = type;
    result.timestamp = new Date().toISOString();
    result.modelUsed = modelName;
    return result;
  } catch (error: any) {
    console.error("Scan Engine Error:", error);
    throw new Error(error.message || "Uplink to intelligence node failed.");
  }
};

export const queryAgent = async (history: {role: string, content: string}[], message: string): Promise<string> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Context:\n${history.map(m => `${m.role}: ${m.content}`).join('\n')}\nRequest: ${message}`,
            config: { 
                systemInstruction: "You are Sentinel, a technical security assistant. Provide concise, expert remediation advice.",
                thinkingConfig: { thinkingBudget: 1000 }
            }
        });
        return response.text || "No response from signal node.";
    } catch (e) {
        return "Intelligence link saturated. System cooling down.";
    }
};

