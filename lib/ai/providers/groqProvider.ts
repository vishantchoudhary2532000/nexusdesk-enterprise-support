import Groq from "groq-sdk";

const getGroqClient = () => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not configured");
  }
  return new Groq({ apiKey: process.env.GROQ_API_KEY });
};

export async function generateGroqSummary(messages: string[]): Promise<string> {
  const client = getGroqClient();
  const systemPrompt =
    "Summarize the following support conversation in 2-3 lines. Focus on issue and latest update.";
  const userPrompt = messages
    .map((m, i) => `Message ${i + 1}:\n${m}`)
    .join("\n\n");

  const chatCompletion = await client.chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    model: "mixtral-8x7b-32768", // Fast model that fits requirements perfectly
    temperature: 0.5,
    max_tokens: 300,
  });

  const response = chatCompletion.choices[0]?.message?.content;
  if (!response) throw new Error("Empty response from Groq");
  return response.trim();
}

export async function generateGroqReply(messages: string[]): Promise<string> {
  const client = getGroqClient();
  const systemPrompt =
    "You are a professional support agent. Generate a clear and helpful reply.";
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
  if (!response) throw new Error("Empty response from Groq");
  return response.trim();
}
