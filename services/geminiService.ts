import { GoogleGenAI, Type, Schema, GenerateContentResponse } from "@google/genai";
import { ScanResult, Severity, ScanConfig } from "../types";

// Schema definitions for structured JSON output
const vulnerabilitySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING },
    title: { type: Type.STRING },
    severity: { type: Type.STRING, enum: ["Critical", "High", "Medium", "Low", "Info"] },
    description: { type: Type.STRING },
    affectedUrl: { type: Type.STRING },
    impact: { type: Type.STRING },
    fixCode: { type: Type.STRING },
    fixExplanation: { type: Type.STRING },
    proofOfConcept: { type: Type.STRING },
    cvssScore: { type: Type.NUMBER }
  },
  required: ["id", "title", "severity", "description", "affectedUrl", "impact", "fixCode", "fixExplanation", "proofOfConcept", "cvssScore"]
};

const metricsSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    authScore: { type: Type.NUMBER },
    dbScore: { type: Type.NUMBER },
    networkScore: { type: Type.NUMBER },
    clientScore: { type: Type.NUMBER },
    complianceScore: { type: Type.NUMBER }
  },
  required: ["authScore", "dbScore", "networkScore", "clientScore", "complianceScore"]
};

const scanResultSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    target: { type: Type.STRING },
    scanType: { type: Type.STRING, enum: ["url", "code"] },
    siteDescription: { type: Type.STRING },
    summary: { type: Type.STRING },
    riskScore: { type: Type.NUMBER },
    maturityLevel: { type: Type.STRING, enum: ["Hardened", "Enterprise", "Standard", "Vulnerable"] },
    securityMetrics: metricsSchema,
    vulnerabilities: { type: Type.ARRAY, items: vulnerabilitySchema },
    executiveSummary: { type: Type.STRING },
    techStack: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, category: { type: Type.STRING } } } },
    headers: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, value: { type: Type.STRING }, status: { type: Type.STRING } } } },
    ports: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { port: { type: Type.NUMBER }, protocol: { type: Type.STRING }, service: { type: Type.STRING }, state: { type: Type.STRING }, risk: { type: Type.STRING } } } },
    sitemap: { type: Type.ARRAY, items: { type: Type.STRING } },
    apiEndpoints: { type: Type.ARRAY, items: { type: Type.STRING } },
    probableVulnerabilities: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { category: { type: Type.STRING }, title: { type: Type.STRING }, likelihood: { type: Type.STRING }, location: { type: Type.STRING }, reasoning: { type: Type.STRING }, verificationSteps: { type: Type.STRING } } } }
  },
  required: ["target", "scanType", "siteDescription", "summary", "riskScore", "maturityLevel", "securityMetrics", "vulnerabilities", "executiveSummary", "techStack", "headers", "ports", "sitemap", "apiEndpoints", "probableVulnerabilities"]
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const runScan = async (
  target: string, 
  type: 'url' | 'code', 
  activeModules: string[] = [],
  config: ScanConfig = { aggressiveness: 'deep', sensitivity: 'all-findings', model: 'pro' }
): Promise<ScanResult> => {
  
  // Re-initialize for every call to ensure latest API key is used
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const modelName = config.model === 'pro' ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';
  
  const systemInstruction = `You are WebSec-AI, a Senior Penetration Testing Intelligence Engine. 
  Your goal is to provide a HIGH-FIDELITY security audit report.
  
  DIAGNOSTIC PROTOCOL:
  1. For URLs: Perform a virtual DAST (Dynamic Analysis). Map the attack surface based on common architectural patterns of similar sites. Identify misconfigured headers, exposed ports, and likely injection points.
  2. For CODE: Perform a rigorous SAST (Static Analysis). Trace data flow from sources to sinks. Identify insecure library usage, hardcoded secrets, and logical flaws (BOLA/IDOR).
  3. EVALUATION: Calculate CVSS v3.1 scores accurately. Provide technically valid Proof of Concept (PoC) payloads.
  4. VERDICT: Return only valid JSON matching the provided schema. Do not hallucinate vulnerabilities on hardened targets unless evidence is statistically significant.`;

  const userPrompt = `AUDIT TARGET: ${target}
  TYPE: ${type === 'url' ? 'Live Web Application' : 'Source Code Snippet'}
  INTENSITY: ${config.aggressiveness}
  ACTIVE MODULES: ${activeModules.join(', ')}
  
  Return a complete JSON security report.`;

  let lastError;
  const maxRetries = 3;

  for (let i = 0; i < maxRetries; i++) {
    try {
      if (i > 0) await delay(2000 * i); // Exponential-ish backoff
      
      const response = await ai.models.generateContent({
        model: modelName,
        contents: userPrompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: scanResultSchema,
          thinkingConfig: { thinkingBudget: 4000 } // Reserve tokens for deep security reasoning
        }
      });

      const text = response.text;
      if (!text) throw new Error("Empty response from AI engine.");
      
      const result: ScanResult = JSON.parse(text);
      
      // Post-processing to ensure UI compatibility
      result.modelUsed = modelName;
      result.target = target;
      result.scanType = type;
      result.timestamp = new Date().toISOString();
      
      return result;
    } catch (e: any) {
      console.error(`Scan Attempt ${i+1} failed:`, e);
      lastError = e;
      
      // Handle key issues specifically
      if (e.message?.includes('404') || e.message?.toLowerCase().includes('not found')) {
        throw new Error("API configuration mismatch. Please re-select your Secure Key in Settings.");
      }
      
      // Retry for transient errors
      if (e.status === 429 || e.status === 503) continue;
      
      throw e;
    }
  }
  throw lastError;
};

export const queryAgent = async (history: {role: string, content: string}[], message: string): Promise<string> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Conversation History:\n${history.map(m => `${m.role}: ${m.content}`).join('\n')}\nUser Query: ${message}`,
            config: { 
                systemInstruction: "You are Sentinel, a senior web security expert. Provide professional, concise, and technically accurate advice. Avoid fluff.",
                thinkingConfig: { thinkingBudget: 1000 }
            }
        });
        return response.text || "Uplink busy. Please try again.";
    } catch (e) {
        return "Intelligence uplink offline. Check API configuration.";
    }
}
