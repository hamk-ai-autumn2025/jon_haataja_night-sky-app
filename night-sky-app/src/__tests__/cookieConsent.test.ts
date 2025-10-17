import { describe, it, expect, beforeEach } from "vitest";
import {
  getCookieConsent,
  saveCookieConsent,
  hasConsent,
  clearCookieConsent,
  hasUserMadeChoice,
  CookiePreferences,
} from "../utils/cookieConsent";

describe("Cookie Consent Utilities", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it("should return null when no consent has been saved", () => {
    expect(getCookieConsent()).toBeNull();
    expect(hasUserMadeChoice()).toBe(false);
  });

  it("should save and retrieve cookie consent preferences", () => {
    const preferences: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: false,
    };

    saveCookieConsent(preferences);

    const saved = getCookieConsent();
    expect(saved).not.toBeNull();
    expect(saved?.preferences).toEqual(preferences);
    expect(saved?.timestamp).toBeDefined();
  });

  it("should check if user has consent for specific categories", () => {
    const preferences: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: false,
    };

    saveCookieConsent(preferences);

    expect(hasConsent("necessary")).toBe(true);
    expect(hasConsent("analytics")).toBe(true);
    expect(hasConsent("marketing")).toBe(false);
  });

  it("should return false for consent checks when no choice has been made", () => {
    expect(hasConsent("necessary")).toBe(false);
    expect(hasConsent("analytics")).toBe(false);
    expect(hasConsent("marketing")).toBe(false);
  });

  it("should clear cookie consent", () => {
    const preferences: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
    };

    saveCookieConsent(preferences);
    expect(hasUserMadeChoice()).toBe(true);

    clearCookieConsent();
    expect(getCookieConsent()).toBeNull();
    expect(hasUserMadeChoice()).toBe(false);
  });

  it("should handle deny all correctly", () => {
    const preferences: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
    };

    saveCookieConsent(preferences);

    expect(hasConsent("necessary")).toBe(true);
    expect(hasConsent("analytics")).toBe(false);
    expect(hasConsent("marketing")).toBe(false);
  });

  it("should handle accept all correctly", () => {
    const preferences: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
    };

    saveCookieConsent(preferences);

    expect(hasConsent("necessary")).toBe(true);
    expect(hasConsent("analytics")).toBe(true);
    expect(hasConsent("marketing")).toBe(true);
  });
});
