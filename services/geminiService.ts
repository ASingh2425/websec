import { ScanResult, ScanConfig } from "../types";

export const runScan = async (
  target: string,
  type: "url" | "code",
  activeModules: string[] = [],
  config: ScanConfig
): Promise<ScanResult> => {

  const systemInstruction = `You are WebSec-AI, a Senior Offensive Security Auditor...`;

  const userPrompt = `
  INITIATE SECURITY AUDIT
  TARGET: ${target}
  TYPE: ${type}
  INTENSITY: ${config.aggressiveness.toUpperCase()}
  SCOPE: ${activeModules.join(", ") || "FULL"}
  `;

  const res = await fetch("/api/scan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      target,
      type,
      activeModules,
      config,
      systemInstruction,
      userPrompt,
      modelName:
        config.model === "pro"
          ? "gemini-3-pro-preview"
          : "gemini-3-flash-preview",
      responseSchema: "SERVER_HAS_SCHEMA"
    })
  });

  if (!res.ok) {
    throw new Error("Scan failed");
  }

  return await res.json();
};
