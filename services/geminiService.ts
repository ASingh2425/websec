import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ScanResult, Severity, ScanConfig } from "../types";

const scanResultSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    target: { type: Type.STRING },
    scanType: { type: Type.STRING },
    summary: { type: Type.STRING },
    riskScore: { type: Type.NUMBER },
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
    vulnerabilities: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          severity: { type: Type.STRING },
          description: { type: Type.STRING },
          affectedUrl: { type: Type.STRING },
          impact: { type: Type.STRING },
          fixCode: { type: Type.STRING },
          fixExplanation: { type: Type.STRING },
          proofOfConcept: { type: Type.STRING },
          cvssScore: { type: Type.NUMBER }
        },
        required: ["id", "title", "severity", "description", "affectedUrl", "impact", "fixCode", "fixExplanation", "proofOfConcept", "cvssScore"]
      }
    },
    techStack: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, category: { type: Type.STRING } } } },
    headers: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, value: { type: Type.STRING }, status: { type: Type.STRING } } } },
    executiveSummary: { type: Type.STRING }
  },
  required: ["target", "scanType", "summary", "riskScore", "maturityLevel", "securityMetrics", "vulnerabilities", "executiveSummary"]
};

export const runScan = async (
  target: string, 
  type: 'url' | 'code', 
  activeModules: string[] = [],
  config: ScanConfig = { aggressiveness: 'deep', sensitivity: 'all-findings', model: 'flash' }
): Promise<ScanResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const modelName = config.model === 'pro' ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';

  let lastError;
  for (let i = 0; i < 3; i++) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: `Auditing ${type}: ${target}. Intensity: ${config.aggressiveness}.`,
        config: {
          systemInstruction: "You are a specialized Web Security Engine. Return a structured JSON audit report following the provided schema.",
          responseMimeType: "application/json",
          responseSchema: scanResultSchema
        }
      });
      const result = JSON.parse(response.text || '{}');
      result.modelUsed = modelName;
      return result;
    } catch (e: any) {
      lastError = e;
      if (e.message?.includes('429') || e.message?.includes('overloaded')) {
        await new Promise(r => setTimeout(r, 2000 * (i + 1)));
        continue;
      }
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
      contents: `History: ${JSON.stringify(history)}\nUser: ${message}`,
      config: { systemInstruction: "You are Sentinel, a security expert. Be concise and professional." }
    });
    return response.text || "Uplink busy.";
  } catch { return "System offline."; }
};