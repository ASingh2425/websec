import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      target,
      type,
      activeModules,
      config,
      systemInstruction,
      userPrompt,
      modelName,
      responseSchema
    } = req.body;

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY!, // ✅ SERVER ONLY
    });

    const response = await ai.models.generateContent({
      model: modelName,
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema,
        thinkingConfig: { thinkingBudget: 16000 }
      }
    });

    return res.status(200).json(JSON.parse(response.text));

  } catch (error: any) {
    console.error("Gemini backend error:", error);
    return res.status(500).json({
      error: "Intelligence node failure"
    });
  }
}
