import { describe, it, expect } from "vitest";
import {
  generateGoogleCalendarLink,
  generateOutlookCalendarLink,
  generateYahooCalendarLink,
  generateICalendarFile,
  parseEventDate,
  createCalendarEventFromAstronomy,
  CalendarEvent,
} from "../utils/calendarLinks";

describe("calendarLinks utility functions", () => {
  const mockCalendarEvent: CalendarEvent = {
    title: "Perseid Meteor Shower",
    description: "Peak of the annual Perseid meteor shower",
    location: "Finland",
    startDate: new Date("2025-08-12T20:00:00"),
    endDate: new Date("2025-08-12T23:00:00"),
  };

  describe("generateGoogleCalendarLink", () => {
    it("generates valid Google Calendar URL with all parameters", () => {
      const link = generateGoogleCalendarLink(mockCalendarEvent);

      expect(link).toContain("https://calendar.google.com/calendar/render?");
      expect(link).toContain("action=TEMPLATE");
      expect(link).toContain(
        encodeURIComponent("Perseid Meteor Shower").replace(/%20/g, "+"),
      );
      expect(link).toContain("location=Finland");
      expect(link).toContain("dates=");
    });

    it("properly formats dates in YYYYMMDDTHHMMSSZ format", () => {
      const link = generateGoogleCalendarLink(mockCalendarEvent);

      // Check date format in URL
      expect(link).toMatch(/dates=\d{8}T\d{6}Z%2F\d{8}T\d{6}Z/);
    });

    it("sanitizes title to prevent XSS attacks", () => {
      const maliciousEvent: CalendarEvent = {
        ...mockCalendarEvent,
        title: "<script>alert('XSS')</script>Test Event",
      };

      const link = generateGoogleCalendarLink(maliciousEvent);

      expect(link).not.toContain("<script>");
      expect(link).not.toContain("</script>");
      expect(link).toContain("Test+Event");
    });

    it("sanitizes description to remove dangerous content", () => {
      const maliciousEvent: CalendarEvent = {
        ...mockCalendarEvent,
        description: "Event javascript:alert('hack') description",
      };

      const link = generateGoogleCalendarLink(maliciousEvent);

      expect(link).not.toContain("javascript:");
    });

    it("removes event handlers from text", () => {
      const maliciousEvent: CalendarEvent = {
        ...mockCalendarEvent,
        title: 'Event onclick=alert("xss") title',
      };

      const link = generateGoogleCalendarLink(maliciousEvent);

      expect(link).not.toMatch(/onclick=/i);
    });
  });

  describe("generateOutlookCalendarLink", () => {
    it("generates valid Outlook Calendar URL", () => {
      const link = generateOutlookCalendarLink(mockCalendarEvent);

      expect(link).toContain("https://outlook.live.com/calendar/0/deeplink");
      expect(link).toContain("path=%2Fcalendar%2Faction%2Fcompose");
      expect(link).toContain("rru=addevent");
      expect(link).toContain("subject=Perseid+Meteor+Shower");
      expect(link).toContain("location=Finland");
    });

    it("uses ISO date format for Outlook", () => {
      const link = generateOutlookCalendarLink(mockCalendarEvent);

      expect(link).toContain("startdt=2025-08-12");
      expect(link).toContain("enddt=2025-08-12");
    });

    it("sanitizes all text fields", () => {
      const maliciousEvent: CalendarEvent = {
        ...mockCalendarEvent,
        title: "<b>Bold Title</b>",
        location: "Location<script>",
      };

      const link = generateOutlookCalendarLink(maliciousEvent);

      expect(link).not.toContain("<b>");
      expect(link).not.toContain("<script>");
    });
  });

  describe("generateYahooCalendarLink", () => {
    it("generates valid Yahoo Calendar URL", () => {
      const link = generateYahooCalendarLink(mockCalendarEvent);

      expect(link).toContain("https://calendar.yahoo.com/?");
      expect(link).toContain("v=60");
      expect(link).toContain("title=Perseid+Meteor+Shower");
      expect(link).toContain("in_loc=Finland");
    });

    it("properly formats dates for Yahoo", () => {
      const link = generateYahooCalendarLink(mockCalendarEvent);

      expect(link).toMatch(/st=\d{8}T\d{6}Z/);
      expect(link).toMatch(/et=\d{8}T\d{6}Z/);
    });

    it("handles special characters in location", () => {
      const eventWithSpecialChars: CalendarEvent = {
        ...mockCalendarEvent,
        location: "Helsinki, Finland & Surroundings",
      };

      const link = generateYahooCalendarLink(eventWithSpecialChars);

      expect(link).toContain("in_loc=");
      expect(link).not.toContain("&Surroundings"); // & should be encoded
    });
  });

  describe("generateICalendarFile", () => {
    it("generates valid ICS file content", () => {
      const icsUrl = generateICalendarFile(mockCalendarEvent);

      expect(icsUrl).toContain("data:text/calendar;charset=utf-8,");

      // Decode the content
      const content = decodeURIComponent(icsUrl.split(",")[1]);

      expect(content).toContain("BEGIN:VCALENDAR");
      expect(content).toContain("VERSION:2.0");
      expect(content).toContain("BEGIN:VEVENT");
      expect(content).toContain("END:VEVENT");
      expect(content).toContain("END:VCALENDAR");
    });

    it("includes all event details in ICS format", () => {
      const icsUrl = generateICalendarFile(mockCalendarEvent);
      const content = decodeURIComponent(icsUrl.split(",")[1]);

      expect(content).toContain("SUMMARY:Perseid Meteor Shower");
      expect(content).toContain(
        "DESCRIPTION:Peak of the annual Perseid meteor shower",
      );
      expect(content).toContain("LOCATION:Finland");
      expect(content).toContain("STATUS:CONFIRMED");
    });

    it("generates unique UID for each event", async () => {
      const icsUrl1 = generateICalendarFile(mockCalendarEvent);
      
      // Wait a bit to ensure different timestamp
      await new Promise((resolve) => setTimeout(resolve, 10));
      
      const icsUrl2 = generateICalendarFile(mockCalendarEvent);

      const content1 = decodeURIComponent(icsUrl1.split(",")[1]);
      const content2 = decodeURIComponent(icsUrl2.split(",")[1]);

      // Extract UIDs
      const uid1Match = content1.match(/UID:([^\r\n]+)/);
      const uid2Match = content2.match(/UID:([^\r\n]+)/);

      expect(uid1Match).toBeTruthy();
      expect(uid2Match).toBeTruthy();
      // UIDs should be different due to timestamp
      expect(uid1Match![1]).not.toBe(uid2Match![1]);
    });

    it("properly escapes newlines in description", () => {
      const eventWithNewlines: CalendarEvent = {
        ...mockCalendarEvent,
        description: "Line 1\nLine 2\nLine 3",
      };

      const icsUrl = generateICalendarFile(eventWithNewlines);
      const content = decodeURIComponent(icsUrl.split(",")[1]);

      expect(content).toContain("DESCRIPTION:Line 1\\nLine 2\\nLine 3");
      expect(content).not.toMatch(/DESCRIPTION:.*\n(?!LOCATION)/);
    });

    it("includes PRODID with app identifier", () => {
      const icsUrl = generateICalendarFile(mockCalendarEvent);
      const content = decodeURIComponent(icsUrl.split(",")[1]);

      expect(content).toContain("PRODID:-//Night Sky App//NONSGML v1.0//EN");
    });
  });

  describe("parseEventDate", () => {
    it("parses YYYY-MM-DD format correctly", () => {
      const date = parseEventDate("2025-08-12");

      expect(date.getFullYear()).toBe(2025);
      expect(date.getMonth()).toBe(7); // August is month 7 (0-indexed)
      expect(date.getDate()).toBe(12);
    });

    it("sets time to 8 PM (20:00) local time", () => {
      const date = parseEventDate("2025-08-12");

      expect(date.getHours()).toBe(20);
      expect(date.getMinutes()).toBe(0);
      expect(date.getSeconds()).toBe(0);
    });

    it("handles single-digit months and days", () => {
      const date = parseEventDate("2025-01-05");

      expect(date.getFullYear()).toBe(2025);
      expect(date.getMonth()).toBe(0); // January
      expect(date.getDate()).toBe(5);
    });

    it("handles December correctly", () => {
      const date = parseEventDate("2025-12-31");

      expect(date.getFullYear()).toBe(2025);
      expect(date.getMonth()).toBe(11); // December
      expect(date.getDate()).toBe(31);
    });
  });

  describe("createCalendarEventFromAstronomy", () => {
    const astronomyEvent = {
      title: "Leonid Meteor Shower",
      description: "Annual meteor shower from Leo constellation",
      tips: "Best viewed after midnight in dark locations",
      date: "2025-11-17",
    };

    it("creates CalendarEvent with correct structure", () => {
      const calendarEvent = createCalendarEventFromAstronomy(
        astronomyEvent,
        "Finland",
      );

      expect(calendarEvent).toHaveProperty("title");
      expect(calendarEvent).toHaveProperty("description");
      expect(calendarEvent).toHaveProperty("location");
      expect(calendarEvent).toHaveProperty("startDate");
      expect(calendarEvent).toHaveProperty("endDate");
    });

    it("sets correct title and location", () => {
      const calendarEvent = createCalendarEventFromAstronomy(
        astronomyEvent,
        "Finland",
      );

      expect(calendarEvent.title).toBe("Leonid Meteor Shower");
      expect(calendarEvent.location).toBe("Finland");
    });

    it("combines description and tips", () => {
      const calendarEvent = createCalendarEventFromAstronomy(
        astronomyEvent,
        "Finland",
      );

      expect(calendarEvent.description).toContain(
        "Annual meteor shower from Leo constellation",
      );
      expect(calendarEvent.description).toContain("Viewing Tips:");
      expect(calendarEvent.description).toContain(
        "Best viewed after midnight in dark locations",
      );
    });

    it("sets start date to 8 PM", () => {
      const calendarEvent = createCalendarEventFromAstronomy(
        astronomyEvent,
        "Finland",
      );

      expect(calendarEvent.startDate.getHours()).toBe(20);
      expect(calendarEvent.startDate.getMinutes()).toBe(0);
    });

    it("sets end date 3 hours after start (viewing window)", () => {
      const calendarEvent = createCalendarEventFromAstronomy(
        astronomyEvent,
        "Finland",
      );

      const timeDiff =
        calendarEvent.endDate.getTime() - calendarEvent.startDate.getTime();
      const hoursDiff = timeDiff / (1000 * 60 * 60);

      expect(hoursDiff).toBe(3);
      expect(calendarEvent.endDate.getHours()).toBe(23);
    });

    it("handles different date formats gracefully", () => {
      const event = {
        ...astronomyEvent,
        date: "2025-01-01",
      };

      const calendarEvent = createCalendarEventFromAstronomy(event, "Sweden");

      expect(calendarEvent.startDate.getFullYear()).toBe(2025);
      expect(calendarEvent.startDate.getMonth()).toBe(0);
      expect(calendarEvent.startDate.getDate()).toBe(1);
    });
  });

  describe("Edge cases and security", () => {
    it("handles empty strings gracefully", () => {
      const emptyEvent: CalendarEvent = {
        title: "",
        description: "",
        location: "",
        startDate: new Date("2025-01-01T20:00:00"),
        endDate: new Date("2025-01-01T23:00:00"),
      };

      const googleLink = generateGoogleCalendarLink(emptyEvent);
      const outlookLink = generateOutlookCalendarLink(emptyEvent);
      const yahooLink = generateYahooCalendarLink(emptyEvent);

      expect(googleLink).toBeTruthy();
      expect(outlookLink).toBeTruthy();
      expect(yahooLink).toBeTruthy();
    });

    it("handles very long text fields", () => {
      const longText = "A".repeat(1000);
      const longEvent: CalendarEvent = {
        title: longText,
        description: longText,
        location: longText,
        startDate: new Date("2025-01-01T20:00:00"),
        endDate: new Date("2025-01-01T23:00:00"),
      };

      const link = generateGoogleCalendarLink(longEvent);

      expect(link).toBeTruthy();
      expect(link.length).toBeGreaterThan(0);
    });

    it("handles special Unicode characters", () => {
      const unicodeEvent: CalendarEvent = {
        title: "Tähtien tuikinta ⭐ 🌟 ✨",
        description: "Météores et étoiles filantes 🌠",
        location: "Hämeen­linna, Suomi",
        startDate: new Date("2025-01-01T20:00:00"),
        endDate: new Date("2025-01-01T23:00:00"),
      };

      const googleLink = generateGoogleCalendarLink(unicodeEvent);
      const outlookLink = generateOutlookCalendarLink(unicodeEvent);
      const icsUrl = generateICalendarFile(unicodeEvent);

      expect(googleLink).toBeTruthy();
      expect(outlookLink).toBeTruthy();
      expect(icsUrl).toBeTruthy();
    });

    it("trims whitespace from text fields", () => {
      const whitespaceEvent: CalendarEvent = {
        title: "  Event Title  ",
        description: "  Description  ",
        location: "  Location  ",
        startDate: new Date("2025-01-01T20:00:00"),
        endDate: new Date("2025-01-01T23:00:00"),
      };

      const link = generateGoogleCalendarLink(whitespaceEvent);

      expect(link).toContain("text=Event+Title");
      expect(link).not.toContain("++Event");
    });
  });
});
