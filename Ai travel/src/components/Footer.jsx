import React from "react";
import "./footer.css";

const Footer = () => {
  return (
    <footer>
      <a href="#" className="logo">
        <span className="logo-icon">✈</span>
        AI Travel Planner
      </a>
      <div className="footer-links">
        <a href="#">Home</a>
        <a href="#features">Features</a>
        <a href="#faq">FAQ</a>
        <a href="#">Privacy Policy</a>
        <a href="#">Contact Us</a>
        <a href="#">Feedback</a>
      </div>
      <div className="footer-copy">
        © 2026 AI Travel Planner. All rights reserved. Made with ♥ for wanderers.
      </div>
    </footer>
  );
};

export default Footer;