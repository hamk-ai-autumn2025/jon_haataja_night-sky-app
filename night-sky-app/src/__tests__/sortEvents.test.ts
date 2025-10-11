import { describe, it, expect } from "vitest";
import { AstronomyEvent } from "../App";
import sortEvents from "../components/sortEvents";

const mockEvents: AstronomyEvent[] = [
  {
    date: "2025-10-05",
    title: "Zeta Meteor Shower",
    description: "Peak of the Zeta meteor shower.",
    visibility: "naked_eye",
    tips: "Best viewed after midnight.",
  },
  {
    date: "2025-04-12",
    title: "Aurora Display",
    description: "Strong auroras visible.",
    visibility: "naked_eye",
    tips: "Find a dark location away from city lights.",
  },
  {
    date: "2025-01-01",
    title: "Comet Observation",
    description: "Comet visible with telescope.",
    visibility: "telescope",
    tips: "Use a telescope with at least 50x magnification.",
  },
  {
    date: "2025-07-20",
    title: "Lunar Eclipse",
    description: "Partial lunar eclipse.",
    visibility: "naked_eye",
    tips: "Visible from most locations.",
  },
];

describe("sortEvents utility", () => {
  it("sorts by date ascending (newest → oldest)", () => {
    const sorted = sortEvents(mockEvents, "date_newest");
    const dates = sorted.map((e) => e.date);
    expect(dates).toEqual([
      "2025-01-01",
      "2025-04-12",
      "2025-07-20",
      "2025-10-05",
    ]);
  });

  it("sorts by title ascending", () => {
    const sorted = sortEvents(mockEvents, "title_asc");
    const titles = sorted.map((e) => e.title);
    expect(titles).toEqual([
      "Aurora Display",
      "Comet Observation",
      "Lunar Eclipse",
      "Zeta Meteor Shower",
    ]);
  });

  it("sorts by title descending", () => {
    const sorted = sortEvents(mockEvents, "title_desc");
    const titles = sorted.map((e) => e.title);
    expect(titles).toEqual([
      "Zeta Meteor Shower",
      "Lunar Eclipse",
      "Comet Observation",
      "Aurora Display",
    ]);
  });

  it("sorts by visibility naked eye first", () => {
    const sorted = sortEvents(mockEvents, "visibility_naked_eye_first");
    // First three should be naked eye
    expect(sorted.slice(0, 3).every((e) => e.visibility === "naked_eye")).toBe(
      true,
    );
    expect(sorted[3].visibility).toBe("telescope");
  });

  it("sorts by visibility telescope first", () => {
    const sorted = sortEvents(mockEvents, "visibility_telescope_first");
    expect(sorted[0].visibility).toBe("telescope");
  });
});
