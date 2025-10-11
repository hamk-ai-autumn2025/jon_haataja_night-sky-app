import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import OpenAI from "openai";

const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-4.1-mini";

// In-memory cache for serverless function
const cache = new Map<
  string,
  {
    data: any;
    timestamp: number;
  }
>();

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

function getCacheKey(country: string, month: string, year: string): string {
  return `${country}_${month}_${year}`.toLowerCase();
}

const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext,
) => {
  // Enable CORS
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  };

  // Handle OPTIONS request for CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    // Parse request body
    const { country, month, year } = JSON.parse(event.body || "{}");

    // Validate required parameters
    if (!country || !month || !year) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: "Missing required parameters: country, month, year",
        }),
      };
    }

    // Check in-memory cache
    const cacheKey = getCacheKey(country, month, year);
    const cached = cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return {
        statusCode: 200,
        headers: {
          ...headers,
          "Content-Type": "application/json",
          "X-Cache": "HIT",
        },
        body: JSON.stringify(cached.data),
      };
    }

    // Initialize OpenAI client
    const client = new OpenAI({
      baseURL: endpoint,
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Call OpenAI API
    const response = await client.chat.completions.create({
      model: model,
      messages: [
        {
          role: "system",
          content:
            "You are an astronomy assistant. Generate a comprehensive list of astronomy events in structured JSON. Each event must include date, title, a detailed description, visibility ('naked_eye' or 'telescope') and tips for best viewing. Include ALL significant astronomical events for the requested period, including but not limited to: meteor showers, full moons, new moons, planetary conjunctions, comets, planetary visibility peaks, eclipses, equinoxes/solstices, and other notable celestial phenomena. Aim to provide at least 10-15 events when available for the given month.",
        },
        {
          role: "user",
          content: `Generate a comprehensive list of all astronomy events for ${country} in ${month} ${year}. Include all types of events: meteor showers, moon phases, comets, planetary events, conjunctions, eclipses, and any other celestial phenomena visible from this location during this time period.`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const raw = response.choices[0].message.content ?? "{}";
    const parsedData = JSON.parse(raw);

    // Store in cache
    cache.set(cacheKey, {
      data: parsedData,
      timestamp: Date.now(),
    });

    // Clean up old cache entries (keep only last 100)
    if (cache.size > 100) {
      const entries = Array.from(cache.entries());
      const sortedEntries = entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      const toDelete = sortedEntries.slice(0, cache.size - 100);
      toDelete.forEach(([key]) => cache.delete(key));
    }

    return {
      statusCode: 200,
      headers: {
        ...headers,
        "Content-Type": "application/json",
        "X-Cache": "MISS",
      },
      body: JSON.stringify(parsedData),
    };
  } catch (error) {
    console.error("Error in serverless function:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Failed to fetch astronomy events",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};

export { handler };
