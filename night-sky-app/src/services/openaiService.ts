import OpenAI from "openai";

// Determine if we should use the serverless function or direct API
const USE_SERVERLESS =
  import.meta.env.PROD || import.meta.env.VITE_USE_SERVERLESS === "true";

const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-4.1-mini";

// Only initialize client for development (when not using serverless)
let client: OpenAI | null = null;
if (!USE_SERVERLESS) {
  client = new OpenAI({
    baseURL: endpoint,
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });
}

// Cache configuration
const CACHE_PREFIX = "astronomy_events_";
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

interface CachedData {
  data: unknown;
  timestamp: number;
}

export interface AstronomyEventsResponse {
  data: unknown;
  fromCache: boolean;
  cacheAge?: number;
  source?: "serverless" | "direct" | "localStorage";
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

function saveToCache(
  country: string,
  month: string,
  year: string,
  data: unknown,
) {
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
  signal?: AbortSignal,
): Promise<{ data: unknown; fromServerCache: boolean }> {
  const response = await fetch("/.netlify/functions/get-astronomy-events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ country, month, year }),
    signal, // Pass abort signal to fetch
  });

  if (!response.ok) {
    throw new Error(`Serverless function error: ${response.status}`);
  }

  const data = await response.json();
  const fromServerCache = response.headers.get("X-Cache") === "HIT";

  return { data, fromServerCache };
}

async function fetchFromDirectAPI(
  country: string,
  month: string,
  year: string,
  signal?: AbortSignal,
) {
  if (!client) {
    throw new Error(
      "OpenAI client not initialized. Use serverless function in production.",
    );
  }

  const response = await client.chat.completions.create(
    {
      model: model,
      messages: [
        {
          role: "system",
          content:
            "Generate astronomy events as JSON. Each event: date, title, description, visibility ('naked_eye' or 'telescope'), tips. Include major events: meteor showers, comets, moon phases, planets, conjunctions, eclipses, solstices/equinoxes.",
        },
        {
          role: "user",
          content: `List 8-12 notable astronomy events for ${country} in ${month} ${year}. Include: meteor showers, key moon phases, planetary visibility, conjunctions, eclipses, seasonal events.`,
        },
      ],
      response_format: { type: "json_object" },
    },
    {
      signal, // Pass abort signal to OpenAI client
    },
  );

  const raw = response.choices[0].message.content ?? "[]";
  return JSON.parse(raw);
}

async function getAstronomyEvents(
  country: string,
  month: string,
  year: string,
  signal?: AbortSignal,
): Promise<AstronomyEventsResponse> {
  // Check localStorage cache first
  const cachedResult = getFromCache(country, month, year);
  if (cachedResult) {
    const cacheKey = getCacheKey(country, month, year);
    const cached = localStorage.getItem(cacheKey);
    const cachedData: CachedData = cached ? JSON.parse(cached) : null;
    const cacheAge = cachedData ? Date.now() - cachedData.timestamp : 0;

    return {
      data: cachedResult,
      fromCache: true,
      cacheAge,
      source: "localStorage",
    };
  }

  let parsedData;
  let fromServerCache = false;

  // Use serverless function in production, direct API in development
  if (USE_SERVERLESS) {
    const result = await fetchFromServerless(country, month, year, signal);
    parsedData = result.data;
    fromServerCache = result.fromServerCache;
  } else {
    parsedData = await fetchFromDirectAPI(country, month, year, signal);
  }

  // Save to localStorage cache
  saveToCache(country, month, year, parsedData);

  return {
    data: parsedData,
    fromCache: fromServerCache,
    cacheAge: 0,
    source: USE_SERVERLESS ? "serverless" : "direct",
  };
}

export default getAstronomyEvents;
