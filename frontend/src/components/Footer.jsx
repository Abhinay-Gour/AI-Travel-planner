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
          <p className="footer-tagline">Plan smarter. Travel better. Powered by AI.</p>
          <div className="footer-social">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">📸</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">🐦</a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">▶️</a>
            <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">💬</a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <h4>Quick Links</h4>
          <Link to="/">🏠 Home</Link>
          <Link to="/destinations">🌍 Explore Destinations</Link>
          <Link to="/transport">✈️ Transport</Link>
          <Link to="/hotels">🏨 Hotels</Link>
          <Link to="/wishlist">❤️ Wishlist</Link>
          <Link to="/packing">🎒 Packing List</Link>
        </div>

        {/* Features */}
        <div className="footer-col">
          <h4>Features</h4>
          <a href="/#budget-optimizer">💡 Budget Optimizer</a>
          <a href="/#multi-city">🗺️ Multi-City Planner</a>
          <a href="/#currency">💱 Currency Converter</a>
          <a href="/#visa-tracker">🛂 Visa Tracker</a>
          <a href="/#stories">✍️ Travel Stories</a>
          <a href="/#calculator">💰 Cost Calculator</a>
        </div>

        {/* Support */}
        <div className="footer-col">
          <h4>Support</h4>
          <a href="/#faq">❓ FAQ</a>
          <a href="mailto:abhinaygour59@gmail.com">📧 Contact Us</a>
          <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">💬 WhatsApp Support</a>
          <Link to="/privacy">🔒 Privacy Policy</Link>
          <Link to="/terms">📄 Terms of Service</Link>
          <a href="/#feedback">⭐ Give Feedback</a>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-copy">
          © {year} AI Travel Planner. All rights reserved. Made with ❤️ for wanderers.
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
