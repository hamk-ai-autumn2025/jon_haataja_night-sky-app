import OpenAI from "openai";

// Determine if we should use the serverless function or direct API
const USE_SERVERLESS = import.meta.env.PROD || import.meta.env.VITE_USE_SERVERLESS === "true";

const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-4.1-mini";

const client = new OpenAI({
  baseURL: endpoint,
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

// Cache configuration
const CACHE_PREFIX = "astronomy_events_";
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

interface CachedData {
  data: unknown;
  timestamp: number;
}

function getCacheKey(country: string, month: string, year: string): string {
  return `${CACHE_PREFIX}${country}_${month}_${year}`.toLowerCase();
}

function getFromCache(
  country: string,
  month: string,
  year: string,
): unknown | null {
  try {
    const cacheKey = getCacheKey(country, month, year);
    const cached = localStorage.getItem(cacheKey);

    if (!cached) {
      return null;
    }

    const cachedData: CachedData = JSON.parse(cached);
    const now = Date.now();

    // Check if cache is still valid
    if (now - cachedData.timestamp < CACHE_DURATION) {
      return cachedData.data;
    } else {
      // Cache expired, remove it
      localStorage.removeItem(cacheKey);
      return null;
    }
  } catch (error) {
    console.error("Error reading from cache:", error);
    return null;
  }
}

function saveToCache(country: string, month: string, year: string, data: unknown) {
  try {
    const cacheKey = getCacheKey(country, month, year);
    const cachedData: CachedData = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(cacheKey, JSON.stringify(cachedData));
  } catch (error) {
    console.error("Error saving to cache:", error);
  }
}

async function fetchFromServerless(
  country: string,
  month: string,
  year: string,
) {
  const response = await fetch("/.netlify/functions/get-astronomy-events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ country, month, year }),
  });

  if (!response.ok) {
    throw new Error(`Serverless function error: ${response.status}`);
  }

  return await response.json();
}

async function fetchFromDirectAPI(
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
          "You are an astronomy assistant. Generate a comprehensive list of astronomy events in structured JSON. Each event must include date, title, a detailed description, visibility ('naked_eye' or 'telescope') and tips for best viewing. Include ALL significant astronomical events for the requested period, including but not limited to: meteor showers, full moons, new moons, comets, planetary conjunctions, planetary visibility peaks, eclipses, equinoxes/solstices, and other notable celestial phenomena. Aim to provide at least 10-15 events when available for the given month.",
      },
      {
        role: "user",
        content: `Generate a comprehensive list of all astronomy events for ${country} in ${month} ${year}. Include all types of events: meteor showers, moon phases, comets, planetary events, conjunctions, eclipses, and any other celestial phenomena visible from this location during this time period.`,
      },
    ],
    response_format: { type: "json_object" },
  });

  const raw = response.choices[0].message.content ?? "[]";
  return JSON.parse(raw);
}

async function getAstronomyEvents(
  country: string,
  month: string,
  year: string,
) {
  // Check cache first
  const cachedResult = getFromCache(country, month, year);
  if (cachedResult) {
    return cachedResult;
  }

  let parsedData;

  // Use serverless function in production, direct API in development
  if (USE_SERVERLESS) {
    parsedData = await fetchFromServerless(country, month, year);
  } else {
    parsedData = await fetchFromDirectAPI(country, month, year);
  }

  // Save to cache
  saveToCache(country, month, year, parsedData);

  return parsedData;
}

export default getAstronomyEvents;
