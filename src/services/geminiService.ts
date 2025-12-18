
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ScanResult, Severity, ScanConfig } from "../types";

const vulnerabilitySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING },
    title: { type: Type.STRING },
    severity: { type: Type.STRING, enum: [Severity.CRITICAL, Severity.HIGH, Severity.MEDIUM, Severity.LOW, Severity.INFO] },
    description: { type: Type.STRING, description: "Professional technical description. detailed and precise." },
    affectedUrl: { type: Type.STRING, description: "Exact location: URL + Parameter + HTTP Method" },
    impact: { type: Type.STRING, description: "Business and Technical Impact Analysis." },
    fixCode: { type: Type.STRING },
    fixExplanation: { type: Type.STRING, description: "Technical remediation steps." },
    proofOfConcept: { type: Type.STRING, description: "MANDATORY: Actual payload used (e.g., ' OR 1=1 --), curl command, or HTTP response snippet proving the flaw." },
    cwe: { type: Type.STRING, description: "CWE ID (e.g., CWE-89)" },
    capec: { type: Type.STRING, description: "CAPEC ID (e.g., CAPEC-66)" },
    cvssScore: { type: Type.NUMBER, description: "CVSS v3.1 Base Score (0.0 - 10.0)" },
    cvssVector: { type: Type.STRING, description: "CVSS Vector String" }
  },
  required: ["id", "title", "severity", "description", "affectedUrl", "impact", "fixCode", "fixExplanation", "proofOfConcept", "cvssScore"]
};

const probableVulnerabilitySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    category: { type: Type.STRING, description: "e.g. Injection, Access Control, Business Logic" },
    title: { type: Type.STRING, description: "Specific flaw name e.g. Blind SQL Injection" },
    likelihood: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
    location: { type: Type.STRING, description: "Suspected endpoint or parameter" },
    reasoning: { type: Type.STRING, description: "Heuristic analysis: Why is this suspected? e.g. 'Numeric ID in URL suggests IDOR'" },
    verificationSteps: { type: Type.STRING, description: "Specific manual or tool-based steps to confirm existence." }
  },
  required: ["category", "title", "likelihood", "location", "reasoning", "verificationSteps"]
};

const techStackSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    category: { type: Type.STRING, enum: ["Frontend", "Backend", "Database", "Server", "Other"] },
    version: { type: Type.STRING }
  },
  required: ["name", "category"]
};

const headerSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    value: { type: Type.STRING },
    status: { type: Type.STRING, enum: ["secure", "warning", "missing"] }
  },
  required: ["name", "value", "status"]
};

const portSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    port: { type: Type.NUMBER },
    protocol: { type: Type.STRING },
    service: { type: Type.STRING },
    state: { type: Type.STRING, enum: ["open", "closed", "filtered"] },
    version: { type: Type.STRING },
    risk: { type: Type.STRING, enum: ["Safe", "Low", "Medium", "High", "Critical"] },
    reason: { type: Type.STRING }
  },
  required: ["port", "protocol", "service", "state", "risk"]
};

const metricsSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    authScore: { type: Type.NUMBER, description: "0-100 Score" },
    dbScore: { type: Type.NUMBER, description: "0-100 Score" },
    networkScore: { type: Type.NUMBER, description: "0-100 Score" },
    clientScore: { type: Type.NUMBER, description: "0-100 Score" },
    complianceScore: { type: Type.NUMBER, description: "0-100 Score" }
  },
  required: ["authScore", "dbScore", "networkScore", "clientScore", "complianceScore"]
};

const owaspSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    category: { type: Type.STRING },
    count: { type: Type.NUMBER }
  },
  required: ["category", "count"]
};

const scanResultSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    target: { type: Type.STRING },
    scanType: { type: Type.STRING, enum: ["url", "code"] },
    siteDescription: { type: Type.STRING },
    summary: { type: Type.STRING },
    riskScore: { type: Type.NUMBER, description: "Overall Security Score (0-100). 100 is Safe. 0 is Critical Risk." },
    maturityLevel: { type: Type.STRING, enum: ["Hardened", "Enterprise", "Standard", "Vulnerable"], description: "The calibrated security maturity of the target." },
    securityMetrics: metricsSchema,
    owaspDistribution: { type: Type.ARRAY, items: owaspSchema },
    techStack: { type: Type.ARRAY, items: techStackSchema },
    vulnerabilities: { type: Type.ARRAY, items: vulnerabilitySchema },
    probableVulnerabilities: { type: Type.ARRAY, items: probableVulnerabilitySchema },
    headers: { type: Type.ARRAY, items: headerSchema },
    ports: { type: Type.ARRAY, items: portSchema },
    sitemap: { type: Type.ARRAY, items: { type: Type.STRING } },
    apiEndpoints: { type: Type.ARRAY, items: { type: Type.STRING } },
    executiveSummary: { type: Type.STRING, description: "Enterprise-grade executive summary of the risk profile." }
  },
  required: ["target", "scanType", "siteDescription", "summary", "riskScore", "maturityLevel", "securityMetrics", "owaspDistribution", "techStack", "vulnerabilities", "probableVulnerabilities", "headers", "ports", "sitemap", "apiEndpoints", "executiveSummary"]
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const runScan = async (
  target: string, 
  type: 'url' | 'code', 
  activeModules: string[] = [],
  config: ScanConfig = { aggressiveness: 'deep', sensitivity: 'all-findings', model: 'flash' }
): Promise<ScanResult> => {
  
  // Directly initialize using process.env.API_KEY as per guidelines.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const isCode = type === 'code';
  const systemInstruction = `
    You are WebSec-AI, an Elite Enterprise-Grade Web Penetration Testing Engine.
    *** PHASE 1: TARGET MATURITY & LAB DETECTION ***
    Analyze target. If hardened platform (google.com), use strict rules. If labs (vulnweb.com), active simulation.
    *** PHASE 2: FINDING GENERATION ***
    Report confirmed flaws: SQLi, XSS, IDOR, RCE. Return JSON matching schema.
  `;

  const userPrompt = `
    MODE: ${config.aggressiveness.toUpperCase()}
    TARGET: "${target}" (${isCode ? "Source Code" : "Live URL"})
    ACTIVE MODULES: ${activeModules.join(', ') || 'ALL'}
  `;

  // Updated models to comply with guidelines: gemini-3-pro-preview and gemini-3-flash-preview.
  let activeModel = config.model === 'pro' ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';
  let lastError;
  const maxRetries = 6;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      if (attempt > 0) {
          const jitter = Math.random() * 1500;
          const backoff = (3000 * Math.pow(1.5, attempt - 1)) + jitter;
          await delay(backoff);
      }

      const response = await ai.models.generateContent({
        model: activeModel,
        contents: userPrompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: scanResultSchema,
          temperature: 0.1, 
          seed: 42,
        }
      });

      const text = response.text;
      if (!text) throw new Error("AI Engine connection timed out.");
      
      let result: ScanResult = JSON.parse(text);
      result.scanType = type;
      result.target = target;
      result.modelUsed = activeModel;
      
      return result;

    } catch (error: any) {
      lastError = error;
      const isOverloaded = error.status === 503 || (error.message && error.message.toLowerCase().includes('overloaded'));
      const isQuota = error.status === 429 || (error.message && error.message.includes('429'));

      // If pro model fails, immediately drop to high-speed flash model.
      if (activeModel === 'gemini-3-pro-preview' && (isOverloaded || isQuota)) {
           activeModel = 'gemini-3-flash-preview';
           continue; 
      }
      
      // If flash model is also busy, drop to lite.
      if (activeModel === 'gemini-3-flash-preview' && (isOverloaded || isQuota) && attempt > 2) {
          activeModel = 'gemini-flash-lite-latest';
          continue;
      }
      
      if (isOverloaded || isQuota) continue;
      break; 
    }
  }
  
  throw lastError;
};

export const queryAgent = async (history: {role: string, content: string}[], message: string): Promise<string> => {
    try {
        // Use process.env.API_KEY directly.
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `History:\n${history.map(m => `${m.role}: ${m.content}`).join('\n')}\nUser: ${message}`,
            config: { systemInstruction: "You are Sentinel, a security expert." }
        });
        return response.text || "Connection unclear. Please repeat.";
    } catch (e) {
        return "Intelligence uplink busy. Please try again in a moment.";
    }
}
