import React from "react";
import saturn from "../assets/saturn.svg";

const Footer: React.FC = () => (
            <footer className="col-12 footer-content">
                <span>
                    Made With{" "}
                    <img
                        src={saturn}
                        alt="Saturn"
                        className="footer-saturn"
                    />{" "}
                    by <a href="https://www.jonhaataja.com">Jon Haataja</a>
                </span>
            </footer>
);

export default Footer;