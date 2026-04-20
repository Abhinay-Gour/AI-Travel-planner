import React from "react";
import "./features.css";

const Features = () => {
  return (
    <section className="features-section" id="features">
      <div className="center">
        <div className="section-label">Why Choose Us</div>
        <h2 className="section-title">
          Everything You Need to Plan<br />
          Unforgettable Trips
        </h2>
        <p className="section-sub">
          Powerful features designed to make travel planning effortless and enjoyable.
        </p>
      </div>
      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">🤖</div>
          <h3>AI-Powered Itinerary Generation</h3>
          <p>
            Enter your destination and dates — our AI crafts a complete day-by-day plan 
            with activities, restaurants, and stays tailored to your vibe.
          </p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📅</div>
          <h3>Day-by-Day Organization</h3>
          <p>
            Visualize your entire journey with detailed daily schedules. Add activities, 
            set timings, and keep notes all in one place.
          </p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">👥</div>
          <h3>Travel Companion Collaboration</h3>
          <p>
            Invite friends and family to view and plan together. Everyone stays on the 
            same page with shared real-time access.
          </p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🔍</div>
          <h3>Smart Location Search</h3>
          <p>
            Find any destination instantly with intelligent autocomplete. Get accurate 
            details, addresses, and place info powered by top mapping APIs.
          </p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📱</div>
          <h3>Access Anywhere, Anytime</h3>
          <p>
            Your itineraries sync across all devices. Plan at home on desktop, reference 
            on mobile while exploring. No app download needed.
          </p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📤</div>
          <h3>Easy Sharing & Export</h3>
          <p>
            Share via link, export to PDF, or invite companions by email. Your travel 
            plans are always just a tap away.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Features;