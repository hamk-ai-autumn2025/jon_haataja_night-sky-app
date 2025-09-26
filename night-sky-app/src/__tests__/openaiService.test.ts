import { describe, it, expect, vi } from "vitest";
import getAstronomyEvents from "../services/openaiService";

vi.mock("openai", () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: vi.fn().mockResolvedValue({
            choices: [
              {
                message: {
                  content: JSON.stringify([
                    {
                      date: "2025-09-23",
                      title: "Saturn at Opposition",
                      description:
                        "Saturn is opposite the Sun and fully illuminated.",
                      visibility: "telescope",
                    },
                  ]),
                },
              },
            ],
          }),
        },
      },
    })),
  };
});

describe("getAstronomyEvents", () => {
  it("returns parsed astronomy events from OpenAI response", async () => {
    const events = await getAstronomyEvents("Finland", "September", "2025");
    expect(Array.isArray(events)).toBe(true);
    expect(events[0]).toMatchObject({
      date: "2025-09-23",
      title: "Saturn at Opposition",
      description: expect.any(String),
      visibility: "telescope",
    });
  });
});
