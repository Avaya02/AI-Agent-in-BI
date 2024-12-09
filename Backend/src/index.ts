import express, { Express } from "express";
import { Request, Response } from "express";
import OpenAI from "openai";
import { BASE_PROMPT, getSystemPrompt } from "./prompt";
import { basePrompt as nodeBasePrompt } from "./defaults/node";
import { basePrompt as reactBasePrompt } from "./defaults/react";
import dotenv from "dotenv";
import cors from "cors"

dotenv.config();

const app: Express = express(); // had to explicitly define this app type
app.use(express.json());
app.use(cors())
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/template", async (req: Request, res: Response): Promise<void> => {
  const prompt = req.body.prompt;
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Return either node or react based on what do you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 10,
    });
    const result = response.choices[0].message.content;

    if (result === "react") {
      res.json({
        projectType: result,
        prompts: [
          BASE_PROMPT,
          `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
        ],
        uiprompts: [reactBasePrompt],
      });
      return;
    }

    if (result === "node") {
      res.json({
        projectType: result,
        prompts: [
          `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${nodeBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
          ,
        ],
        uiprompts: [nodeBasePrompt], // this has to be parsed by the UI that is why this is here warna we don't need any UI related stuff to get a node project
      });
      return;
    }

    // Handle unexpected result
    res.status(400).json({ error: "Unexpected project type" });
  } catch (error: any) {
    console.error("Error with OpenAI API:", error.message);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request." });
  }
});

app.post("/chat", async (req: Request, res: Response): Promise<any> => {
  const messages = req.body.messages;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
      max_tokens: 1000,
    });
    const result = response.choices[0].message.content;

    return res.json({result});
  } catch (error) {
    console.error("not working", error);
    return res.json({});
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

app.listen(3000, () => console.log("Listening on PORT 3000"));
