import {
  generateGroqInsights,
  generateGroqReply,
  generateGroqSummary,
} from "./providers/groqProvider";
import {
  generateGeminiInsights,
  generateGeminiReply,
  generateGeminiSummary,
} from "./providers/geminiProvider";
import { getGroundedContext } from "../knowledgeService";

export async function generateSummary(messages: string[], orgInstructions?: string): Promise<string> {
  if (!messages || messages.length === 0) {
    return "No messages found to summarize.";
  }

  try {
    console.log(
      "[AI Client] Attempting summary generation with Groq (Primary)...",
    );
    return await generateGroqSummary(messages, orgInstructions);
  } catch (groqError: any) {
    console.error(
      "[AI Client] Groq failed, falling back to Gemini:",
      groqError.message,
    );

    try {
      console.log(
        "[AI Client] Attempting summary generation with Gemini (Fallback)...",
      );
      return await generateGeminiSummary(messages, orgInstructions);
    } catch (geminiError: any) {
      console.error("[AI Client] Gemini also failed:", geminiError.message);
      throw new Error(
        "Could not generate a summary at this time because AI services are unavailable. Please review the ticket messages directly.",
      );
    }
  }
}

export async function generateReply(messages: string[], organizationId?: string, orgInstructions?: string): Promise<string> {
  if (!messages || messages.length === 0) {
    return "How can I help you today?";
  }

  // Knowledge Base Grounding
  let groundedMessages = [...messages];
  if (organizationId) {
    const context = await getGroundedContext(organizationId, messages);
    if (context) {
        groundedMessages = [context, ...messages];
    }
  }

  try {
    console.log(
      "[AI Client] Attempting reply generation with Groq (Primary)...",
    );
    return await generateGroqReply(groundedMessages, orgInstructions);
  } catch (groqError: any) {
    console.error(
      "[AI Client] Groq failed, falling back to Gemini:",
      groqError.message,
    );

    try {
      console.log(
        "[AI Client] Attempting reply generation with Gemini (Fallback)...",
      );
      return await generateGeminiReply(groundedMessages, orgInstructions);
    } catch (geminiError: any) {
      console.error("[AI Client] Gemini also failed:", geminiError.message);
      throw new Error(
        "Apologies, our smart reply system is currently experiencing issues. Please type your response manually.",
      );
    }
  }
}

export async function generateInsights(messages: string[], organizationId?: string, orgInstructions?: string): Promise<any> {
    if (!messages || messages.length === 0) {
      return {
        sentiment: "neutral",
        category: "general",
        priority_suggestion: "medium",
        confidence: 0,
        tags: []
      };
    }

    // Knowledge Base Grounding for categorization/tagging
    let groundedMessages = [...messages];
    if (organizationId) {
      const context = await getGroundedContext(organizationId, messages);
      if (context) {
          groundedMessages = [context, ...messages];
      }
    }
  
    try {
      console.log("[AI Client] Attempting insights generation with Groq (Primary)...");
      return await generateGroqInsights(groundedMessages, orgInstructions);
    } catch (groqError: any) {
      console.error("[AI Client] Groq insights failed, falling back to Gemini:", groqError.message);
  
      try {
        console.log("[AI Client] Attempting insights generation with Gemini (Fallback)...");
        return await generateGeminiInsights(groundedMessages, orgInstructions);
      } catch (geminiError: any) {
        console.error("[AI Client] Gemini insights also failed:", geminiError.message);
        return {
            sentiment: "neutral",
            category: "general",
            priority_suggestion: "medium",
            confidence: 0,
            tags: ["AI Error"]
        };
      }
    }
}
