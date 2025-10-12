import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import getAstronomyEvents from "../services/openaiService";

// Mock OpenAI with a function that returns the mock
const mockCreate = vi.fn();

vi.mock("openai", () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: (...args: unknown[]) => mockCreate(...args),
        },
      },
    })),
  };
});

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
  writable: true,
});

describe("getAstronomyEvents", () => {
  const mockEventsResponse = {
    events: [
      {
        date: "2025-09-23",
        title: "Saturn at Opposition",
        description: "Saturn is opposite the Sun and fully illuminated.",
        visibility: "telescope",
        tips: "Best viewed with a telescope.",
      },
      {
        date: "2025-09-07",
        title: "Perseid Meteor Shower",
        description: "Peak of the Perseid meteor shower.",
        visibility: "naked_eye",
        tips: "Best viewed after midnight in dark skies.",
      },
    ],
  };

  beforeEach(() => {
    // Clear localStorage before each test
    localStorageMock.clear();
    // Reset mock
    mockCreate.mockReset();
    mockCreate.mockResolvedValue({
      choices: [
        {
          message: {
            content: JSON.stringify(mockEventsResponse),
          },
        },
      ],
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Basic functionality", () => {
    it("returns parsed astronomy events from OpenAI response", async () => {
      const response = await getAstronomyEvents("Finland", "September", "2025");

      expect(response.data).toBeDefined();
      expect(response.fromCache).toBe(false);
      expect(response.source).toBeDefined();
    });

    it("includes required response metadata", async () => {
      const response = await getAstronomyEvents("Finland", "September", "2025");

      expect(response).toHaveProperty("data");
      expect(response).toHaveProperty("fromCache");
      expect(response).toHaveProperty("cacheAge");
      expect(response).toHaveProperty("source");
    });

    it("returns correct data structure", async () => {
      const response = await getAstronomyEvents("Finland", "September", "2025");

      expect(response.data).toEqual(mockEventsResponse);
    });
  });

  describe("Caching functionality", () => {
    it("saves results to localStorage cache", async () => {
      await getAstronomyEvents("Finland", "September", "2025");

      const cacheKey = "astronomy_events_finland_september_2025";
      const cached = localStorageMock.getItem(cacheKey);

      expect(cached).not.toBeNull();
    });

    it("returns cached results on subsequent calls", async () => {
      // First call - should call API
      const response1 = await getAstronomyEvents(
        "Finland",
        "September",
        "2025",
      );
      expect(response1.fromCache).toBe(false);
      expect(mockCreate).toHaveBeenCalledTimes(1);

      // Second call - should use cache
      const response2 = await getAstronomyEvents(
        "Finland",
        "September",
        "2025",
      );
      expect(response2.fromCache).toBe(true);
      expect(response2.source).toBe("localStorage");
      expect(mockCreate).toHaveBeenCalledTimes(1); // Still only called once
    });

    it("includes cache age in response", async () => {
      // First call to populate cache
      await getAstronomyEvents("Finland", "September", "2025");

      // Wait a bit
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Second call from cache
      const response = await getAstronomyEvents("Finland", "September", "2025");

      expect(response.fromCache).toBe(true);
      expect(response.cacheAge).toBeGreaterThan(0);
    });

    it("uses case-insensitive cache keys", async () => {
      await getAstronomyEvents("Finland", "September", "2025");

      const response = await getAstronomyEvents("FINLAND", "SEPTEMBER", "2025");

      expect(response.fromCache).toBe(true);
      expect(mockCreate).toHaveBeenCalledTimes(1);
    });

    it("creates separate cache entries for different searches", async () => {
      await getAstronomyEvents("Finland", "September", "2025");
      await getAstronomyEvents("Sweden", "September", "2025");
      await getAstronomyEvents("Finland", "October", "2025");

      expect(mockCreate).toHaveBeenCalledTimes(3);
    });

    it("expires cache after 24 hours", async () => {
      // Manually set expired cache
      const cacheKey = "astronomy_events_finland_september_2025";
      const expiredData = {
        data: mockEventsResponse,
        timestamp: Date.now() - 25 * 60 * 60 * 1000, // 25 hours ago
      };
      localStorageMock.setItem(cacheKey, JSON.stringify(expiredData));

      // Should not use expired cache
      const response = await getAstronomyEvents("Finland", "September", "2025");

      expect(response.fromCache).toBe(false);
      expect(mockCreate).toHaveBeenCalledTimes(1);
    });

    it("handles corrupted cache data gracefully", async () => {
      const cacheKey = "astronomy_events_finland_september_2025";
      localStorageMock.setItem(cacheKey, "invalid JSON");

      // Should fall back to API call
      const response = await getAstronomyEvents("Finland", "September", "2025");

      expect(response.fromCache).toBe(false);
      expect(mockCreate).toHaveBeenCalledTimes(1);
    });
  });

  describe("Error handling", () => {
    it("throws error when API call fails", async () => {
      mockCreate.mockRejectedValueOnce(new Error("API Error"));

      await expect(
        getAstronomyEvents("Finland", "September", "2025"),
      ).rejects.toThrow("API Error");
    });

    it("throws error when response is invalid JSON", async () => {
      mockCreate.mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: "invalid json",
            },
          },
        ],
      });

      await expect(
        getAstronomyEvents("Finland", "September", "2025"),
      ).rejects.toThrow();
    });

    it("handles missing response content with default empty array", async () => {
      mockCreate.mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: null,
            },
          },
        ],
      });

      const response = await getAstronomyEvents("Finland", "September", "2025");

      // The service returns [] when content is null
      expect(response.data).toEqual([]);
    });
  });

  describe("AbortSignal handling", () => {
    it("accepts and passes abort signal to API call", async () => {
      const controller = new AbortController();

      await getAstronomyEvents(
        "Finland",
        "September",
        "2025",
        controller.signal,
      );

      expect(mockCreate).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          signal: controller.signal,
        }),
      );
    });

    it("throws AbortError when signal is aborted", async () => {
      const controller = new AbortController();

      mockCreate.mockImplementationOnce(() => {
        return Promise.reject(new DOMException("Aborted", "AbortError"));
      });

      controller.abort();

      await expect(
        getAstronomyEvents("Finland", "September", "2025", controller.signal),
      ).rejects.toThrow();
    });

    it("can be called without abort signal", async () => {
      // Should work fine without signal
      const response = await getAstronomyEvents("Finland", "September", "2025");

      expect(response).toBeDefined();
    });
  });

  describe("Data formatting", () => {
    it("handles array response format", async () => {
      const arrayResponse = [
        {
          date: "2025-09-23",
          title: "Test Event",
          description: "Test",
          visibility: "naked_eye",
          tips: "Test tips",
        },
      ];

      mockCreate.mockResolvedValueOnce({
        choices: [
          {
            message: {
              content: JSON.stringify(arrayResponse),
            },
          },
        ],
      });

      const response = await getAstronomyEvents("Finland", "September", "2025");

      expect(Array.isArray(response.data)).toBe(true);
    });

    it("handles object with events array format", async () => {
      const response = await getAstronomyEvents("Finland", "September", "2025");

      expect(response.data).toHaveProperty("events");
      const data = response.data as { events: unknown[] };
      expect(Array.isArray(data.events)).toBe(true);
    });
  });

  describe("Input validation", () => {
    it("accepts valid country names", async () => {
      const countries = ["Finland", "Sweden", "United States", "UK"];

      for (const country of countries) {
        const response = await getAstronomyEvents(country, "September", "2025");
        expect(response).toBeDefined();
      }
    });

    it("accepts valid month names", async () => {
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      for (const month of months) {
        mockCreate.mockClear();
        localStorageMock.clear();
        const response = await getAstronomyEvents("Finland", month, "2025");
        expect(response).toBeDefined();
      }
    });

    it("accepts valid year formats", async () => {
      const years = ["2024", "2025", "2026", "2030"];

      for (const year of years) {
        mockCreate.mockClear();
        localStorageMock.clear();
        const response = await getAstronomyEvents("Finland", "September", year);
        expect(response).toBeDefined();
      }
    });
  });
});
