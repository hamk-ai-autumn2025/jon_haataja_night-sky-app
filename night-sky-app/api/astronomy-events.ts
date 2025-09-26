import { VercelRequest, VercelResponse } from "@vercel/node";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { country, month, year } = req.body;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        {
          role: "system",
          content:
            "You are an astronomy assistant. Generate a list of upcoming astronomy events in structured JSON. Each event must include date, title, description, and visibility ('naked_eye' or 'telescope').",
        },
        {
          role: "user",
          content: `Generate astronomy events for ${country} in ${month} ${year}.`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const raw = response.choices[0].message.content ?? "[]";
    res.status(200).json(JSON.parse(raw));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch astronomy events" });
  }
}
