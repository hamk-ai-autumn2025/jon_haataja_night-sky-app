import React from "react";
import saturn from "../assets/saturn.svg";

interface FooterProps {
  onPrivacyPolicyClick?: () => void;
}

const Footer: React.FC<FooterProps> = ({ onPrivacyPolicyClick }) => (
  <footer className="col-12 footer-content">
    <span>
      Made With <img src={saturn} alt="Saturn" className="footer-saturn" /> by{" "}
      <a href="https://www.jonhaataja.com">Jon Haataja</a>
    </span>

    <div className="footer-links">
      {onPrivacyPolicyClick && (
        <button
          className="footer-link-button"
          onClick={onPrivacyPolicyClick}
          aria-label="Privacy Policy"
        >
          Privacy Policy
        </button>
      )}
    </div>
  </footer>
);

export default Footer;
