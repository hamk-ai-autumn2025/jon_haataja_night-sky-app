import { useState, useEffect } from "react";
import "../styles/CookieConsent.css";

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

interface CookieConsentProps {
  onAccept?: (preferences: CookiePreferences) => void;
}

const CookieConsent: React.FC<CookieConsentProps> = ({ onAccept }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [hasConsent, setHasConsent] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always true, can't be disabled
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consentData = localStorage.getItem("cookieConsent");
    if (!consentData) {
      // Show banner after a short delay for better UX
      setTimeout(() => setIsExpanded(true), 500);
    } else {
      // User has made a choice, load their preferences
      setHasConsent(true);
      try {
        const parsed = JSON.parse(consentData);
        if (parsed.preferences) {
          setPreferences(parsed.preferences);
        }
      } catch (error) {
        console.error("Error parsing cookie consent:", error);
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    saveConsent(allAccepted);
  };

  const handleDeny = () => {
    const onlyNecessary: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    saveConsent(onlyNecessary);
  };

  const handleSaveSelection = () => {
    saveConsent(preferences);
  };

  const saveConsent = (prefs: CookiePreferences) => {
    const consentData = {
      preferences: prefs,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("cookieConsent", JSON.stringify(consentData));
    setHasConsent(true);
    setPreferences(prefs);
    setIsExpanded(false);
    setShowDetails(false);
    if (onAccept) {
      onAccept(prefs);
    }
  };

  const handlePreferenceChange = (
    category: keyof CookiePreferences,
    value: boolean,
  ) => {
    if (category === "necessary") return; // Can't change necessary cookies
    setPreferences((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  const toggleBanner = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setShowDetails(false);
    }
  };

  return (
    <>
      {/* Floating Cookie Settings Button */}
      {hasConsent && !isExpanded && (
        <button
          className="cookie-settings-button"
          onClick={toggleBanner}
          aria-label="Cookie Settings"
          title="Cookie Settings"
        >
          🍪
        </button>
      )}

      {/* Cookie Consent Banner */}
      {isExpanded && (
        <div className="cookie-consent-overlay">
          <div className="cookie-consent-banner glass-card">
            <button
              className="cookie-close-button"
              onClick={toggleBanner}
              aria-label="Close"
              title="Close"
            >
              ×
            </button>
            <div className="cookie-consent-content">
              <h2>🍪 We Value Your Privacy</h2>
              <p className="cookie-intro">
                We use cookies to enhance your experience, analyze site traffic,
                and personalize content. You can customize your preferences
                below.
              </p>

              {!showDetails ? (
                <div className="cookie-buttons">
                  <button
                    className="cookie-btn cookie-btn-deny"
                    onClick={handleDeny}
                  >
                    Deny
                  </button>
                  <button
                    className="cookie-btn cookie-btn-selection"
                    onClick={() => setShowDetails(true)}
                  >
                    Allow Selection
                  </button>
                  <button
                    className="cookie-btn btn-primary"
                    onClick={handleAcceptAll}
                  >
                    Allow All
                  </button>
                </div>
              ) : (
                <div className="cookie-details">
                  {/* Necessary Cookies */}
                  <div className="cookie-category">
                    <div className="cookie-category-header">
                      <label className="cookie-checkbox-label">
                        <input
                          type="checkbox"
                          checked={preferences.necessary}
                          disabled
                          className="cookie-checkbox"
                        />
                        <span className="cookie-category-title">
                          Necessary Cookies (Required)
                        </span>
                      </label>
                    </div>
                    <div className="cookie-category-description-wrapper">
                      <p className="cookie-category-description">
                        These cookies are essential for the website to function
                        properly. They enable basic features like page
                        navigation and access to secure areas. The website
                        cannot function properly without these cookies.
                      </p>
                      <p className="cookie-category-description">
                        <strong>Examples include:</strong>
                      </p>
                      <ul className="cookie-examples-list">
                        <li>
                          Session cookies for maintaining your logged-in state
                        </li>
                        <li>
                          Security cookies for protecting against fraudulent
                          activity
                        </li>
                        <li>Load balancing cookies for distributing traffic</li>
                        <li>Cookie consent preferences storage</li>
                      </ul>
                    </div>
                  </div>

                  {/* Analytics Cookies */}
                  <div className="cookie-category">
                    <div className="cookie-category-header">
                      <label className="cookie-checkbox-label">
                        <input
                          type="checkbox"
                          checked={preferences.analytics}
                          onChange={(e) => {
                            handlePreferenceChange(
                              "analytics",
                              e.target.checked,
                            );
                          }}
                          className="cookie-checkbox"
                        />
                        <span className="cookie-category-title">
                          Analytics Cookies
                        </span>
                      </label>
                    </div>
                    <div className="cookie-category-description-wrapper">
                      <p className="cookie-category-description">
                        These cookies help us understand how visitors interact
                        with our website by collecting and reporting information
                        anonymously. This helps us improve the website's
                        performance and user experience.
                      </p>
                      <p className="cookie-category-description">
                        <strong>What we track:</strong>
                      </p>
                      <ul className="cookie-examples-list">
                        <li>Pages visited and time spent on each page</li>
                        <li>User journey through the website</li>
                        <li>Device type, browser, and screen resolution</li>
                        <li>Geographic location (country/city level)</li>
                        <li>Traffic sources and referral information</li>
                      </ul>
                      <p className="cookie-category-description">
                        <em>
                          Note: All analytics data is anonymized and aggregated.
                        </em>
                      </p>
                    </div>
                  </div>

                  {/* Marketing Cookies */}
                  <div className="cookie-category">
                    <div className="cookie-category-header">
                      <label className="cookie-checkbox-label">
                        <input
                          type="checkbox"
                          checked={preferences.marketing}
                          onChange={(e) => {
                            handlePreferenceChange(
                              "marketing",
                              e.target.checked,
                            );
                          }}
                          className="cookie-checkbox"
                        />
                        <span className="cookie-category-title">
                          Marketing Cookies
                        </span>
                      </label>
                    </div>
                    <div className="cookie-category-description-wrapper">
                      <p className="cookie-category-description">
                        These cookies are used to track visitors across
                        websites. The intention is to display ads that are
                        relevant and engaging for individual users, thereby
                        making them more valuable for publishers and third-party
                        advertisers.
                      </p>
                      <p className="cookie-category-description">
                        <strong>Used for:</strong>
                      </p>
                      <ul className="cookie-examples-list">
                        <li>Displaying personalized advertisements</li>
                        <li>
                          Retargeting campaigns across different platforms
                        </li>
                        <li>Measuring ad campaign effectiveness</li>
                        <li>Social media integration and sharing features</li>
                        <li>A/B testing for marketing campaigns</li>
                      </ul>
                      <p className="cookie-category-description">
                        <em>
                          Third-party providers may include: Google Ads,
                          Facebook Pixel, LinkedIn Insight Tag.
                        </em>
                      </p>
                    </div>
                  </div>

                  <div className="cookie-buttons cookie-buttons-detail">
                    <button
                      className="cookie-btn cookie-btn-back"
                      onClick={() => setShowDetails(false)}
                    >
                      Back
                    </button>
                    <button
                      className="cookie-btn cookie-btn-deny"
                      onClick={handleDeny}
                    >
                      Deny All
                    </button>
                    <button
                      className="cookie-btn cookie-btn-save"
                      onClick={handleSaveSelection}
                    >
                      Save Selection
                    </button>
                    <button
                      className="cookie-btn cookie-btn-accept"
                      onClick={handleAcceptAll}
                    >
                      Allow All
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CookieConsent;
