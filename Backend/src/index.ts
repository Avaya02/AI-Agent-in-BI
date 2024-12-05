require("dotenv").config();
import OpenAI from "openai";
import { getSystemPrompt } from "./prompt";
import express, { Request, Response } from "express";

const app = express();
app.use(express.json())

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/template", async (req : express.Request, res : express.Response) => {
  const prompt = req.body.prompt;
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Return either node or react based on what do you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra" },
        { role: "user", content: prompt }
      ],
      max_tokens: 10,
    });
    const result = response.choices[0].message.content;
    return res.json({ result });
  } catch (error: any) {
    console.error("Error with OpenAI API:", error.message);
    return res.status(500).json({ error: "An error occurred while processing your request." });
  }
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


app.listen(3000,() => console.log("Listening on PORT 3000"))