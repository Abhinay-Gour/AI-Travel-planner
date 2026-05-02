import React from 'react';
import { Link } from 'react-router-dom';
import './footer.css';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer-main">
      <div className="footer-grid">

        {/* Brand */}
        <div className="footer-brand">
          <Link to="/" className="logo">
            <span className="logo-icon">✈</span>
            AI Travel Planner
          </Link>
          <p className="footer-tagline">
            Plan smarter. Travel better.<br />Powered by Google Gemini AI.
          </p>
          <div className="footer-contact">
            <a href="mailto:abhinaygour59@gmail.com" className="footer-contact-link">
              📧 abhinaygour59@gmail.com
            </a>
            <a href="https://wa.me/916265718110" target="_blank" rel="noopener noreferrer" className="footer-contact-link">
              💬 WhatsApp Support
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <h4>Pages</h4>
          <Link to="/">Home</Link>
          <Link to="/destinations">Explore Destinations</Link>
          <Link to="/transport">Transport</Link>
          <Link to="/hotels">Hotels</Link>
          <Link to="/wishlist">Wishlist</Link>
          <Link to="/packing">Packing List</Link>
          <Link to="/mood-quiz">Mood Quiz</Link>
        </div>

        {/* Tools */}
        <div className="footer-col">
          <h4>Tools</h4>
          <a href="/#currency">Currency Converter</a>
          <a href="/#visa">Visa Info</a>
          <a href="/#visa-tracker">Visa Tracker</a>
          <a href="/#checklist">Travel Checklist</a>
          <a href="/#festivals">Festival Calendar</a>
          <a href="/#calculator">Cost Calculator</a>
          <a href="/#insurance">Travel Insurance</a>
        </div>

        {/* Support */}
        <div className="footer-col">
          <h4>Support</h4>
          <a href="/#faq">FAQ</a>
          <a href="/#pricing">Pricing</a>
          <a href="mailto:abhinaygour59@gmail.com">Contact Us</a>
          <a href="https://wa.me/916265718110" target="_blank" rel="noopener noreferrer">WhatsApp</a>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-copy">
          © {year} AI Travel Planner · Made with ❤️ in India · Powered by Gemini AI
        </div>
        <div className="footer-badges">
          <span>🔒 Secure</span>
          <span>🤖 AI Powered</span>
          <span>🇮🇳 Made in India</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
