
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ScanResult, Severity, ScanConfig } from "../types";

const vulnerabilitySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING },
    title: { type: Type.STRING },
    severity: { type: Type.STRING, enum: [Severity.CRITICAL, Severity.HIGH, Severity.MEDIUM, Severity.LOW, Severity.INFO] },
    description: { type: Type.STRING, description: "Deep technical analysis of the vulnerability." },
    affectedUrl: { type: Type.STRING, description: "Specific endpoint, parameter, or code line affected." },
    impact: { type: Type.STRING, description: "Potential business and technical consequences." },
    fixCode: { type: Type.STRING, description: "Secure code snippet or configuration change to fix the flaw." },
    fixExplanation: { type: Type.STRING, description: "Step-by-step remediation instructions." },
    proofOfConcept: { type: Type.STRING, description: "MANDATORY: The exact payload, curl command, or HTTP request/response evidence." },
    cwe: { type: Type.STRING, description: "CWE-ID (e.g., CWE-89)" },
    capec: { type: Type.STRING, description: "CAPEC-ID (e.g., CAPEC-66)" },
    cvssScore: { type: Type.NUMBER, description: "CVSS v3.1 Score (0.0-10.0)" },
    cvssVector: { type: Type.STRING, description: "CVSS v3.1 Vector string." }
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
    riskScore: { type: Type.NUMBER, description: "Overall security health score from 0 (Critical) to 100 (Secure)." },
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
    ports: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { port: { type: Type.NUMBER }, protocol: { type: Type.STRING }, service: { type: Type.STRING }, state: { type: Type.STRING }, risk: { type: Type.STRING } }, required: ["port", "protocol", "service", "state", "risk"] } },
    sitemap: { type: Type.ARRAY, items: { type: Type.STRING } },
    apiEndpoints: { type: Type.ARRAY, items: { type: Type.STRING } },
    executiveSummary: { type: Type.STRING, description: "High-level summary for stakeholders." }
  },
  required: ["target", "scanType", "siteDescription", "summary", "riskScore", "maturityLevel", "securityMetrics", "owaspDistribution", "techStack", "vulnerabilities", "probableVulnerabilities", "headers", "ports", "sitemap", "apiEndpoints", "executiveSummary"]
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const runScan = async (
  target: string, 
  type: 'url' | 'code', 
  activeModules: string[] = [],
  config: ScanConfig = { aggressiveness: 'deep', sensitivity: 'all-findings', model: 'pro' }
): Promise<ScanResult> => {
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  let modelName = config.model === 'pro' ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';
  
  const systemInstruction = `You are WebSec-AI, a Senior Offensive Security Auditor.
  CORE PROTOCOL:
  1. VIRTUAL PENETRATION TEST: Simulate an actual attack on the target: "${target}".
  2. DEEP REASONING: Analyze common frameworks associated with the tech stack.
  3. EVIDENCE: Every vulnerability MUST have a technical Proof of Concept (payload or curl).
  4. ACCURACY: Use real CVE/CWE/CAPEC mappings. 
  5. FORMAT: Return ONLY the JSON object conforming to the schema. No conversational text.`;

  const userPrompt = `AUDIT TARGET: ${target}
  TYPE: ${type === 'url' ? 'Live Web Application' : 'Source Code Snippet'}
  INTENSITY: ${config.aggressiveness.toUpperCase()}
  ENABLED MODULES: ${activeModules.join(', ') || 'ALL'}`;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      if (attempt > 0) await delay(3000 * attempt);
      
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

      const text = response.text;
      if (!text) throw new Error("Intelligence node returned null state.");
      
      const result: ScanResult = JSON.parse(text);
      result.scanType = type;
      result.target = target;
      result.modelUsed = modelName;
      result.timestamp = new Date().toISOString();
      
      return result;
    } catch (error: any) {
        console.error(`Audit Attempt ${attempt + 1} Failed:`, error);
        if (error.status === 429 || error.status === 503 || error.message?.includes('overloaded')) {
            if (modelName === 'gemini-3-pro-preview') {
                modelName = 'gemini-3-flash-preview'; // Fallback to faster model on load
            }
            continue;
        }
        throw error;
    }
  }
  throw new Error("Critical failure in Audit Intelligence uplink.");
};

export const queryAgent = async (history: {role: string, content: string}[], message: string): Promise<string> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Context:\n${history.map(m => `${m.role}: ${m.content}`).join('\n')}\nInput: ${message}`,
            config: { 
                systemInstruction: "You are Sentinel, a brief and technical security assistant. Explain flaws and suggest fixes.",
                thinkingConfig: { thinkingBudget: 1000 }
            }
        });
        return response.text || "Connection weak. Signal lost.";
    } catch (e) {
        return "Intelligence link saturated. System cooling down.";
    }
};
