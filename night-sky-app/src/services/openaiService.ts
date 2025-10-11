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
          "You are an astronomy assistant. Generate a comprehensive list of astronomy events in structured JSON. Each event must include date, title, a detailed description, visibility ('naked_eye' or 'telescope') and tips for best viewing. Include ALL significant astronomical events for the requested period, including but not limited to: meteor showers, full moons, new moons, planetary conjunctions, planetary visibility peaks, eclipses, equinoxes/solstices, and other notable celestial phenomena. Aim to provide at least 10-15 events when available for the given month.",
      },
      {
        role: "user",
        content: `Generate a comprehensive list of all astronomy events for ${country} in ${month} ${year}. Include all types of events: meteor showers, moon phases, comets, planetary events, conjunctions, eclipses, and any other celestial phenomena visible from this location during this time period.`,
      },
    ],
    response_format: { type: "json_object" },
  });

  const raw = response.choices[0].message.content ?? "[]";
  console.log("Raw response:", raw);
  return JSON.parse(raw);
}

export default getAstronomyEvents;
