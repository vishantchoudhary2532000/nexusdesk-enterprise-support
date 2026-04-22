import { GoogleGenAI } from "@google/genai";

const getGeminiClient = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
};

export async function generateGeminiSummary(
  messages: string[],
  orgInstructions?: string
): Promise<string> {
  const ai = getGeminiClient();
  const prompt = `[DNASign: ${orgInstructions || 'Standard Support Persona'}]
  Summarize the following support conversation in 2-3 lines. Focus on issue and latest update.\n\n` +
    messages.map((m, i) => `Message ${i + 1}:\n${m}`).join("\n\n");

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  if (!response.text) throw new Error("Empty response from Gemini");
  return response.text.trim();
}

export async function generateGeminiReply(messages: string[], orgInstructions?: string): Promise<string> {
  const ai = getGeminiClient();
  const prompt = `[DNASign: ${orgInstructions || 'Standard Support Persona'}]
  You are a professional support agent. Generate a clear and helpful reply according to your personality instructions based on the following conversation:\n\n` +
    messages.map((m, i) => `Message ${i + 1}:\n${m}`).join("\n\n");

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  if (!response.text) throw new Error("Empty response from Gemini");
  return response.text.trim();
}

export async function generateGeminiInsights(messages: string[], orgInstructions?: string): Promise<any> {
    const ai = getGeminiClient();
    const prompt = `[DNASign: ${orgInstructions || 'Standard Support Persona'}]
    Analyze the support conversation and return ONLY a JSON object with this schema:
    {
      "sentiment": "positive" | "negative" | "neutral" | "frustrated",
      "category": "technical" | "billing" | "account" | "general",
      "priority_suggestion": "low" | "medium" | "high" | "urgent",
      "confidence": number (0-100),
      "tags": string[]
    }
    
    Conversation:\n` + messages.map((m, i) => `Message ${i + 1}:\n${m}`).join("\n\n");
  
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
  
    if (!response.text) throw new Error("Empty insights from Gemini");
    const text = response.text.trim();
    // Gemini often wraps JSON in code blocks, need to clean it
    const jsonStr = text.startsWith('```json') ? text.replace(/```json\n?|\n?```/g, '') : text;
    return JSON.parse(jsonStr);
}
