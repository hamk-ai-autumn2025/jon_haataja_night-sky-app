import OpenAI from "openai";
const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-4.1-mini";

const client = new OpenAI({
  baseURL: endpoint,
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // ⚠️ only for dev; ideally use a backend proxy (cannot add it yet because don't have enough repo rights & therefore can't deploy to vercel yet)
});

async function getAstronomyEvents(
  country: string,
  month: string,
  year: string,
) {
  const response = await client.chat.completions.create({
    model: model,
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
  console.log("Raw response:", raw);
  return JSON.parse(raw);
}

export default getAstronomyEvents;
