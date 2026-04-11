import {
  generateGroqReply,
  generateGroqSummary,
} from "./providers/groqProvider";
import {
  generateGeminiReply,
  generateGeminiSummary,
} from "./providers/geminiProvider";

export async function generateSummary(messages: string[]): Promise<string> {
  if (!messages || messages.length === 0) {
    return "No messages found to summarize.";
  }

  try {
    console.log(
      "[AI Client] Attempting summary generation with Groq (Primary)...",
    );
    return await generateGroqSummary(messages);
  } catch (groqError: any) {
    console.error(
      "[AI Client] Groq failed, falling back to Gemini:",
      groqError.message,
    );

    try {
      console.log(
        "[AI Client] Attempting summary generation with Gemini (Fallback)...",
      );
      return await generateGeminiSummary(messages);
    } catch (geminiError: any) {
      console.error("[AI Client] Gemini also failed:", geminiError.message);
      throw new Error(
        "Could not generate a summary at this time because AI services are unavailable. Please review the ticket messages directly.",
      );
    }
  }
}

export async function generateReply(messages: string[]): Promise<string> {
  if (!messages || messages.length === 0) {
    return "How can I help you today?";
  }

  try {
    console.log(
      "[AI Client] Attempting reply generation with Groq (Primary)...",
    );
    return await generateGroqReply(messages);
  } catch (groqError: any) {
    console.error(
      "[AI Client] Groq failed, falling back to Gemini:",
      groqError.message,
    );

    try {
      console.log(
        "[AI Client] Attempting reply generation with Gemini (Fallback)...",
      );
      return await generateGeminiReply(messages);
    } catch (geminiError: any) {
      console.error("[AI Client] Gemini also failed:", geminiError.message);
      throw new Error(
        "Apologies, our smart reply system is currently experiencing issues. Please type your response manually.",
      );
    }
  }
}
