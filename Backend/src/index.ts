require("dotenv").config();
import OpenAI from "openai";
import { getSystemPrompt } from "./prompt";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function main() {
  const stream = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: getSystemPrompt() },
      { role: "user", content: "Write code for a TODO application" },
    ],
    stream: true,
    max_tokens: 1024,
  });
  for await (const chunk of stream) {
    console.log(chunk.choices[0]?.delta?.content || "");
  }
}

main();
