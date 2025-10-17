export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

export interface CookieConsentData {
  preferences: CookiePreferences;
  timestamp: string;
}

const CONSENT_KEY = "cookieConsent";

/**
 * Get the user's cookie consent preferences from localStorage
 */
export const getCookieConsent = (): CookieConsentData | null => {
  try {
    const data = localStorage.getItem(CONSENT_KEY);
    if (!data) return null;
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading cookie consent:", error);
    return null;
  }
};

/**
 * Save the user's cookie consent preferences to localStorage
 */
export const saveCookieConsent = (preferences: CookiePreferences): void => {
  try {
    const consentData: CookieConsentData = {
      preferences,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consentData));
  } catch (error) {
    console.error("Error saving cookie consent:", error);
  }
};

/**
 * Check if the user has given consent for a specific cookie category
 */
export const hasConsent = (category: keyof CookiePreferences): boolean => {
  const consent = getCookieConsent();
  if (!consent) return false;
  return consent.preferences[category] === true;
};

/**
 * Clear all cookie consent preferences
 */
export const clearCookieConsent = (): void => {
  try {
    localStorage.removeItem(CONSENT_KEY);
  } catch (error) {
    console.error("Error clearing cookie consent:", error);
  }
};

/**
 * Check if user has made a cookie consent choice
 */
export const hasUserMadeChoice = (): boolean => {
  return getCookieConsent() !== null;
};
