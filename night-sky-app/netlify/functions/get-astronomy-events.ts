import type { Handler, HandlerEvent } from "@netlify/functions";
import OpenAI from "openai";

const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-4.1-mini";

// In-memory cache for serverless function
const cache = new Map<
  string,
  {
    data: unknown;
    timestamp: number;
  }
>();

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

function getCacheKey(country: string, month: string, year: string): string {
  return `${country}_${month}_${year}`.toLowerCase();
}

const handler: Handler = async (event: HandlerEvent) => {
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
    const body = event.body;

    // Validate request body exists
    if (!body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Request body is required" }),
      };
    }

    let parsedBody;
    try {
      parsedBody = JSON.parse(body);
    } catch {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Invalid JSON in request body" }),
      };
    }

    const { country, month, year } = parsedBody;

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

    // Sanitize and validate inputs to prevent injection
    const sanitizedCountry = String(country).trim().substring(0, 100);
    const sanitizedMonth = String(month).trim().substring(0, 20);
    const sanitizedYear = String(year).trim().substring(0, 4);

    // Validate year format
    if (!/^\d{4}$/.test(sanitizedYear)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: "Year must be a 4-digit number",
        }),
      };
    }

    // Check in-memory cache
    const cacheKey = getCacheKey(
      sanitizedCountry,
      sanitizedMonth,
      sanitizedYear,
    );
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
            "Generate astronomy events as JSON. Each event: date, title, description, visibility ('naked_eye' or 'telescope'), tips. Include major events: meteor showers, moon phases, planets, conjunctions, comets, eclipses, solstices/equinoxes.",
        },
        {
          role: "user",
          content: `List 8-12 notable astronomy events for ${sanitizedCountry} in ${sanitizedMonth} ${sanitizedYear}. Include: meteor showers, key moon phases, comets, planetary visibility, conjunctions, eclipses, seasonal events.`,
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
      const sortedEntries = entries.sort(
        (a, b) => a[1].timestamp - b[1].timestamp,
      );
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
