import Groq from "groq-sdk";

const getGroqClient = () => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not configured");
  }
  return new Groq({ apiKey: process.env.GROQ_API_KEY });
};

export async function generateGroqSummary(messages: string[], orgInstructions?: string): Promise<string> {
  const client = getGroqClient();
  const systemPrompt = `[DNASign: ${orgInstructions || 'Standard Support Persona'}]
  Summarize the following support conversation in 2-3 lines. Focus on issue and latest update.`;
  const userPrompt = messages
    .map((m, i) => `Message ${i + 1}:\n${m}`)
    .join("\n\n");

  const chatCompletion = await client.chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    model: "mixtral-8x7b-32768",
    temperature: 0.5,
    max_tokens: 300,
  });

  const response = chatCompletion.choices[0]?.message?.content;
  if (!response) throw new Error("Empty response from Groq");
  return response.trim();
}

export async function generateGroqReply(messages: string[], orgInstructions?: string): Promise<string> {
  const client = getGroqClient();
  const systemPrompt = `[DNASign: ${orgInstructions || 'Standard Support Persona'}]
  You are a professional support agent. Generate a clear and helpful reply according to your personality instructions.`;
  const userPrompt =
    "Here is the conversation history:\n" +
    messages.map((m, i) => `Message ${i + 1}:\n${m}`).join("\n\n") +
    "\n\nWrite the next reply to the customer.";

  const chatCompletion = await client.chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    model: "mixtral-8x7b-32768",
    temperature: 0.7,
    max_tokens: 600,
  });

  const response = chatCompletion.choices[0]?.message?.content;
  if (!not_blank(response)) throw new Error("Empty response from Groq");
  return response!.trim();
}

export async function generateGroqInsights(messages: string[], orgInstructions?: string): Promise<any> {
    const client = getGroqClient();
    const systemPrompt = `[DNASign: ${orgInstructions || 'Standard Support Persona'}]
    Analyze the support conversation and return ONLY a JSON object with this schema:
    {
      "sentiment": "positive" | "negative" | "neutral" | "frustrated",
      "category": "technical" | "billing" | "account" | "general",
      "priority_suggestion": "low" | "medium" | "high" | "urgent",
      "confidence": number (0-100),
      "tags": string[]
    }`;
    
    const userPrompt = messages.map((m, i) => `Message ${i + 1}:\n${m}`).join("\n\n");
  
    const chatCompletion = await client.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      model: "mixtral-8x7b-32768",
      temperature: 0.2,
      response_format: { type: "json_object" },
    });
  
    const response = chatCompletion.choices[0]?.message?.content;
    if (!response) throw new Error("Empty insights from Groq");
    return JSON.parse(response);
}

function not_blank(str: string | null | undefined): boolean {
    return !!str && str.trim().length > 0;
}
