import { GoogleGenAI } from "@google/genai";

const getGeminiClient = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
};

export async function generateGeminiSummary(
  messages: string[],
): Promise<string> {
  const ai = getGeminiClient();
  const prompt =
    "Summarize the following support conversation in 2-3 lines. Focus on issue and latest update.\n\n" +
    messages.map((m, i) => `Message ${i + 1}:\n${m}`).join("\n\n");

  // gemini-2.5-flash is extremely fast and effective for summaries
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  if (!response.text) throw new Error("Empty response from Gemini");
  return response.text.trim();
}

export async function generateGeminiReply(messages: string[]): Promise<string> {
  const ai = getGeminiClient();
  const prompt =
    "You are a professional support agent. Generate a clear and helpful reply based on the following conversation:\n\n" +
    messages.map((m, i) => `Message ${i + 1}:\n${m}`).join("\n\n");

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  if (!response.text) throw new Error("Empty response from Gemini");
  return response.text.trim();
}
