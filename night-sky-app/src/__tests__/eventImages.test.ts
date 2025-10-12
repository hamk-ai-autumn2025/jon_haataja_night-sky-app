import { describe, it, expect } from "vitest";
import { getEventImage, getEventImageTall } from "../components/eventImages";

describe("eventImages utility functions", () => {
  describe("getEventImage", () => {
    it("returns blood moon image for blood moon events", () => {
      const image = getEventImage("Total Lunar Eclipse - Blood Moon");
      expect(image).toContain("skai-blood-moon.webp");
    });

    it("returns blood moon image case-insensitively", () => {
      const image = getEventImage("BLOOD MOON Tonight");
      expect(image).toContain("skai-blood-moon.webp");
    });

    it("returns full moon image for full moon events", () => {
      const image = getEventImage("Full Moon in Pisces");
      expect(image).toContain("skai-full-moon.webp");
    });

    it("returns meteor shower image for meteor events", () => {
      const meteorImage1 = getEventImage("Perseid Meteor Shower Peak");
      const meteorImage2 = getEventImage("Leonid Meteors Visible");

      expect(meteorImage1).toContain("skai-meteor-shower.webp");
      expect(meteorImage2).toContain("skai-meteor-shower.webp");
    });

    it("returns meteor shower image for meteor shower keyword", () => {
      const image = getEventImage("Geminid Meteor Shower");
      expect(image).toContain("skai-meteor-shower.webp");
    });

    it("returns winter solstice image for winter solstice events", () => {
      const image = getEventImage("Winter Solstice - Longest Night");
      expect(image).toContain("skai-winter.webp");
    });

    it("returns summer solstice image for summer solstice events", () => {
      const image = getEventImage("Summer Solstice - Longest Day");
      expect(image).toContain("skai-summer.webp");
    });

    it("returns solar eclipse image for solar eclipse events", () => {
      const image = getEventImage("Partial Solar Eclipse Visible");
      expect(image).toContain("skai-solar-eclipse.webp");
    });

    it("returns comet image for comet events", () => {
      const image = getEventImage("Comet NEOWISE Visible");
      expect(image).toContain("skai-comet.webp");
    });

    it("returns solar system image as default fallback", () => {
      const image = getEventImage("Venus at Greatest Elongation");
      expect(image).toContain("skai-solar-system.webp");
    });

    it("handles empty string with default image", () => {
      const image = getEventImage("");
      expect(image).toContain("skai-solar-system.webp");
    });

    it("is case-insensitive for all keywords", () => {
      const images = [
        getEventImage("COMET approaching"),
        getEventImage("Full MOON tonight"),
        getEventImage("METEOR shower peak"),
        getEventImage("SOLAR ECLIPSE visible"),
      ];

      expect(images[0]).toContain("skai-comet.webp");
      expect(images[1]).toContain("skai-full-moon.webp");
      expect(images[2]).toContain("skai-meteor-shower.webp");
      expect(images[3]).toContain("skai-solar-eclipse.webp");
    });

    it("prioritizes blood moon over full moon when both keywords present", () => {
      const image = getEventImage("Full Blood Moon Eclipse");
      // Should match blood moon first as it appears first in the if-else chain
      expect(image).toContain("skai-blood-moon.webp");
    });

    it("prioritizes meteor shower over meteor", () => {
      const image = getEventImage("Quadrantid Meteor Shower Peak");
      expect(image).toContain("skai-meteor-shower.webp");
    });
  });

  describe("getEventImageTall", () => {
    it("returns tall blood moon image for blood moon events", () => {
      const image = getEventImageTall("Blood Moon Eclipse");
      expect(image).toContain("skai-blood-moon-tall.webp");
    });

    it("returns tall full moon image for full moon events", () => {
      const image = getEventImageTall("Full Moon Rising");
      expect(image).toContain("skai-full-moon-tall.webp");
    });

    it("returns tall meteor shower image for meteor events", () => {
      const meteorImage1 = getEventImageTall("Perseid Meteor Shower");
      const meteorImage2 = getEventImageTall("Meteor Shower Peak");

      expect(meteorImage1).toContain("skai-meteor-shower-tall.webp");
      expect(meteorImage2).toContain("skai-meteor-shower-tall.webp");
    });

    it("returns tall winter solstice image for winter events", () => {
      const image = getEventImageTall("Winter Solstice");
      expect(image).toContain("skai-winter-tall.webp");
    });

    it("returns tall summer solstice image for summer events", () => {
      const image = getEventImageTall("Summer Solstice");
      expect(image).toContain("skai-summer-tall.webp");
    });

    it("returns tall solar eclipse image for solar eclipse events", () => {
      const image = getEventImageTall("Solar Eclipse Path");
      expect(image).toContain("skai-solar-eclipse-tall.webp");
    });

    it("returns tall comet image for comet events", () => {
      const image = getEventImageTall("Comet Visible Tonight");
      expect(image).toContain("skai-comet-tall.webp");
    });

    it("returns tall solar system image as default fallback", () => {
      const image = getEventImageTall("Mars Opposition");
      expect(image).toContain("skai-solar-system-tall.webp");
    });

    it("handles empty string with default tall image", () => {
      const image = getEventImageTall("");
      expect(image).toContain("skai-solar-system-tall.webp");
    });

    it("maintains same logic as regular getEventImage", () => {
      const testCases = [
        "Blood Moon",
        "Full Moon",
        "Meteor Shower",
        "Winter Solstice",
        "Summer Solstice",
        "Solar Eclipse",
        "Comet",
        "Jupiter Conjunction",
      ];

      testCases.forEach((title) => {
        const regularImage = getEventImage(title);
        const tallImage = getEventImageTall(title);

        // Extract base names without -tall suffix
        const regularBase = regularImage.replace(".webp", "");
        const tallBase = tallImage.replace("-tall.webp", "");

        expect(regularBase).toBe(tallBase);
      });
    });

    it("is case-insensitive", () => {
      const lowerCase = getEventImageTall("blood moon eclipse");
      const upperCase = getEventImageTall("BLOOD MOON ECLIPSE");
      const mixedCase = getEventImageTall("BlOoD mOoN EcLiPsE");

      expect(lowerCase).toBe(upperCase);
      expect(upperCase).toBe(mixedCase);
      expect(lowerCase).toContain("skai-blood-moon-tall.webp");
    });
  });

  describe("Image selection consistency", () => {
    it("returns consistent results for same input", () => {
      const title = "Perseid Meteor Shower Peak";

      const result1 = getEventImage(title);
      const result2 = getEventImage(title);
      const result3 = getEventImage(title);

      expect(result1).toBe(result2);
      expect(result2).toBe(result3);
    });

    it("tall and regular versions match the same event type", () => {
      const titles = [
        "Blood Moon",
        "Full Moon",
        "Meteor Shower",
        "Comet",
        "Solar Eclipse",
        "Winter Solstice",
        "Summer Solstice",
      ];

      titles.forEach((title) => {
        const regular = getEventImage(title);
        const tall = getEventImageTall(title);

        // Regular should not contain -tall
        expect(regular).not.toContain("-tall");
        // Tall should contain -tall
        expect(tall).toContain("-tall");

        // Both should reference the same base event type
        const regularType = regular.replace("skai-", "").replace(".webp", "");
        const tallType = tall
          .replace("skai-", "")
          .replace("-tall.webp", "")
          .replace(".webp", "");

        expect(regularType).toBe(tallType);
      });
    });
  });

  describe("Real-world event titles", () => {
    it("handles typical astronomy event titles", () => {
      const testCases = [
        { title: "Leonid Meteor Shower Peak", expected: "meteor-shower" },
        {
          title: "Jupiter and Saturn Conjunction",
          expected: "solar-system",
        },
        { title: "Full Moon Rising", expected: "full-moon" },
        { title: "Lunar Eclipse - Blood Moon", expected: "blood-moon" },
        { title: "Halley's Comet Visible", expected: "comet" },
        { title: "Annular Solar Eclipse", expected: "solar-eclipse" },
        { title: "Winter Solstice - Longest Night", expected: "winter" },
        { title: "Summer Solstice - Longest Day", expected: "summer" },
      ];

      testCases.forEach(({ title, expected }) => {
        const image = getEventImage(title);
        expect(image).toContain(expected);
      });
    });

    it("handles complex event descriptions", () => {
      const title =
        "Peak of the Perseid Meteor Shower - Best Viewing After Midnight";
      const image = getEventImage(title);

      expect(image).toContain("meteor-shower");
    });

    it("handles events with multiple astronomical terms", () => {
      // The actual implementation checks conditions in order
      // "Meteor Shower During Full Moon" - checks blood moon first, then full moon (matches), then meteor
      const image = getEventImage("Meteor Shower During Full Moon");
      // This will match "full moon" before checking for "meteor"
      expect(image).toContain("moon"); // Will match either full or blood moon
    });
  });

  describe("Edge cases", () => {
    it("handles special characters in title", () => {
      const image = getEventImage("Comet C/2023 A1 (NEOWISE) Visible");
      expect(image).toContain("comet");
    });

    it("handles titles with numbers", () => {
      const image = getEventImage("2025 Geminid Meteor Shower");
      expect(image).toContain("meteor-shower");
    });

    it("handles titles with Unicode characters", () => {
      const image = getEventImage("Tähtien tähti - Full Moon 🌕");
      expect(image).toContain("full-moon");
    });

    it("handles very long titles", () => {
      const longTitle =
        "The Annual Perseid Meteor Shower Reaches Its Peak With Up To 100 Meteors Per Hour Visible Under Dark Skies";
      const image = getEventImage(longTitle);

      expect(image).toContain("meteor-shower");
    });

    it("handles titles with only spaces", () => {
      const image = getEventImage("   ");
      expect(image).toContain("solar-system"); // Default
    });
  });
});
