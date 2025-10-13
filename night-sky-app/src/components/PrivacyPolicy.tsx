import React from "react";
import "../styles/PrivacyPolicy.css";

interface PrivacyPolicyProps {
  onClose: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onClose }) => {
  return (
    <div className="privacy-policy-overlay">
      <div className="privacy-policy-container glass-card">
        <button
          className="privacy-close-button"
          onClick={onClose}
          aria-label="Close"
          title="Close Privacy Policy"
        >
          ×
        </button>
        <div className="privacy-policy-content">
          <h1>Privacy Policy</h1>
          <p className="last-updated">
            <strong>Last Updated:</strong> October 14, 2025
          </p>

          <section className="privacy-section">
            <h2>1. Introduction</h2>
            <p>
              Welcome to Skai ("we," "our," or "us"). We are committed to
              protecting your privacy and ensuring transparency about how we
              collect, use, and protect your personal information. This Privacy
              Policy explains how we handle your data when you use our night sky
              astronomy event discovery service.
            </p>
          </section>

          <section className="privacy-section">
            <h2>2. Information We Collect</h2>

            <h3>2.1 Information You Provide</h3>
            <ul>
              <li>
                <strong>Search Queries:</strong> When you search for astronomy
                events, we collect your selected country, month, and year to
                provide relevant event information.
              </li>
              <li>
                <strong>Cookie Preferences:</strong> Your cookie consent choices
                (necessary, analytics, and marketing preferences) are stored
                locally in your browser.
              </li>
            </ul>

            <h3>2.2 Automatically Collected Information</h3>
            <ul>
              <li>
                <strong>Browser Storage:</strong> We use localStorage to cache
                your search results for 24 hours to improve performance and
                reduce unnecessary API calls.
              </li>
              <li>
                <strong>Usage Data:</strong> If you consent to analytics
                cookies, we may collect information about how you interact with
                our service, including pages visited, features used, and session
                duration.
              </li>
              <li>
                <strong>Device Information:</strong> Browser type, device type,
                screen resolution, and operating system (if analytics cookies
                are enabled).
              </li>
            </ul>

            <h3>2.3 Third-Party Services</h3>
            <ul>
              <li>
                <strong>OpenAI API:</strong> Your search queries are sent to
                OpenAI's API (via GitHub Models) to generate astronomy event
                information. We process this through secure serverless
                functions to protect API credentials.
              </li>
              <li>
                <strong>Calendar Integration:</strong> When you add events to
                your calendar, you may be redirected to third-party calendar
                services (Google Calendar, Outlook, Yahoo Calendar, or download
                an iCal file). These services have their own privacy policies.
              </li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>3. How We Use Your Information</h2>
            <p>We use the collected information for the following purposes:</p>
            <ul>
              <li>
                <strong>Service Delivery:</strong> To provide you with accurate
                astronomy event information for your selected location and time
                period.
              </li>
              <li>
                <strong>Performance Optimization:</strong> To cache search
                results and improve response times.
              </li>
              <li>
                <strong>Analytics:</strong> If you consent, to understand how
                users interact with our service and improve user experience.
              </li>
              <li>
                <strong>Marketing:</strong> If you consent, to display relevant
                advertisements and measure campaign effectiveness.
              </li>
              <li>
                <strong>Technical Improvements:</strong> To maintain, debug, and
                improve our service.
              </li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>4. Cookies and Tracking Technologies</h2>

            <h3>4.1 Types of Cookies We Use</h3>

            <h4>Necessary Cookies (Always Active)</h4>
            <p>
              These cookies are essential for the website to function and cannot
              be disabled:
            </p>
            <ul>
              <li>Cookie consent preferences storage</li>
              <li>Session state management</li>
              <li>Security and fraud prevention</li>
              <li>Load balancing and performance optimization</li>
            </ul>

            <h4>Analytics Cookies (Optional)</h4>
            <p>
              These cookies help us understand how visitors use our website:
            </p>
            <ul>
              <li>Page views and navigation patterns</li>
              <li>Device and browser information</li>
              <li>Geographic location (country/city level)</li>
              <li>Traffic sources and referral data</li>
            </ul>
            <p>
              <em>Note: All analytics data is anonymized and aggregated.</em>
            </p>

            <h4>Marketing Cookies (Optional)</h4>
            <p>These cookies are used for advertising purposes:</p>
            <ul>
              <li>Personalized advertisement display</li>
              <li>Retargeting campaigns</li>
              <li>Ad campaign effectiveness measurement</li>
              <li>Social media integration</li>
            </ul>
            <p>
              <em>
                Third-party providers may include: Google Ads, Facebook Pixel,
                LinkedIn Insight Tag.
              </em>
            </p>

            <h3>4.2 Managing Cookies</h3>
            <p>
              You can manage your cookie preferences at any time by clicking the
              cookie icon (🍪) at the bottom right of the page. You can also
              clear cookies through your browser settings, though this may
              affect website functionality.
            </p>
          </section>

          <section className="privacy-section">
            <h2>5. Data Storage and Caching</h2>
            <ul>
              <li>
                <strong>Client-Side Cache:</strong> Search results are stored in
                your browser's localStorage for 24 hours to improve performance.
                This data never leaves your device unless you make a new search.
              </li>
              <li>
                <strong>Server-Side Cache:</strong> Our serverless functions may
                cache search results in memory for up to 24 hours to reduce API
                calls and improve response times.
              </li>
              <li>
                <strong>Data Retention:</strong> Cached data automatically
                expires after 24 hours. You can manually clear browser cache at
                any time.
              </li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>6. Third-Party Services and Links</h2>
            <p>Our service integrates with or links to third-party services:</p>
            <ul>
              <li>
                <strong>OpenAI API:</strong> Processes search queries to
                generate astronomy event information. Subject to{" "}
                <a
                  href="https://openai.com/policies/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  OpenAI's Privacy Policy
                </a>
                .
              </li>
              <li>
                <strong>Calendar Services:</strong> Google Calendar, Microsoft
                Outlook, Yahoo Calendar have their own privacy policies.
              </li>
              <li>
                <strong>Netlify Hosting:</strong> Our website is hosted on
                Netlify. See{" "}
                <a
                  href="https://www.netlify.com/privacy/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Netlify's Privacy Policy
                </a>
                .
              </li>
            </ul>
            <p>
              We are not responsible for the privacy practices of these
              third-party services. We encourage you to review their privacy
              policies.
            </p>
          </section>

          <section className="privacy-section">
            <h2>7. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your
              information:
            </p>
            <ul>
              <li>API keys are stored securely as environment variables</li>
              <li>Serverless functions protect sensitive credentials</li>
              <li>HTTPS encryption for all data transmission</li>
              <li>Regular security updates and monitoring</li>
              <li>No sensitive personal data is stored on our servers</li>
            </ul>
            <p>
              However, no method of transmission over the Internet is 100%
              secure. While we strive to protect your information, we cannot
              guarantee absolute security.
            </p>
          </section>

          <section className="privacy-section">
            <h2>8. Your Rights and Choices</h2>
            <p>You have the following rights regarding your data:</p>
            <ul>
              <li>
                <strong>Access:</strong> Request information about what data we
                have collected about you.
              </li>
              <li>
                <strong>Correction:</strong> Request correction of inaccurate
                data.
              </li>
              <li>
                <strong>Deletion:</strong> Request deletion of your data by
                clearing your browser's localStorage and cookies.
              </li>
              <li>
                <strong>Opt-Out:</strong> Disable analytics and marketing
                cookies through the cookie consent banner.
              </li>
              <li>
                <strong>Data Portability:</strong> Since data is stored locally
                in your browser, you control your data directly.
              </li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>9. Children's Privacy</h2>
            <p>
              Our service is not directed to children under the age of 13. We do
              not knowingly collect personal information from children under 13.
              If you are a parent or guardian and believe your child has
              provided us with personal information, please contact us, and we
              will delete such information.
            </p>
          </section>

          <section className="privacy-section">
            <h2>10. International Data Transfers</h2>
            <p>
              Our service is hosted on Netlify and may process data in various
              locations. By using our service, you consent to the transfer of
              your information to countries outside your country of residence,
              which may have different data protection laws.
            </p>
          </section>

          <section className="privacy-section">
            <h2>11. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will
              notify you of any changes by updating the "Last Updated" date at
              the top of this policy. Continued use of our service after changes
              constitutes acceptance of the updated policy.
            </p>
          </section>

          <section className="privacy-section">
            <h2>12. AI-Generated Content Disclaimer</h2>
            <p>
              Our service uses AI (OpenAI's API) to generate astronomy event
              information. While we strive for accuracy, AI can make mistakes.
              We recommend verifying important astronomical information through
              official sources before making plans or decisions based on the
              information provided.
            </p>
          </section>

          <section className="privacy-section">
            <h2>13. Contact Us</h2>
            <p>
              If you have any questions, concerns, or requests regarding this
              Privacy Policy or our data practices, please contact us:
            </p>
            <ul>
              <li>
                <strong>Website:</strong>{" "}
                <a
                  href="https://www.jonhaataja.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  www.jonhaataja.com
                </a>
              </li>
              <li>
                <strong>Developer:</strong> Jon Haataja
              </li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>14. Legal Basis for Processing (GDPR)</h2>
            <p>
              For users in the European Economic Area (EEA), our legal bases for
              processing your personal data are:
            </p>
            <ul>
              <li>
                <strong>Consent:</strong> For analytics and marketing cookies
                (you can withdraw consent at any time)
              </li>
              <li>
                <strong>Legitimate Interest:</strong> For necessary cookies and
                service functionality
              </li>
              <li>
                <strong>Contract Performance:</strong> To provide the astronomy
                event search service you requested
              </li>
            </ul>
          </section>

          <div className="privacy-footer">
            <p>
              By using Skai, you acknowledge that you have read and understood
              this Privacy Policy and agree to its terms.
            </p>
            <button
              className="privacy-btn-close"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
