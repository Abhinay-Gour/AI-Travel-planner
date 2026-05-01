import React from "react";
import "./features.css";

const FEATURES = [
  {
    icon: "🤖",
    title: "AI Trip Planner",
    desc: "Enter destination + dates — get a complete day-by-day itinerary with activities, timings, and local tips in under 30 seconds."
  },
  {
    icon: "📧",
    title: "Auto Email & WhatsApp",
    desc: "Your trip plan is automatically sent to your email and WhatsApp the moment it's generated. No manual sharing needed."
  },
  {
    icon: "💱",
    title: "Live Currency Converter",
    desc: "Real-time exchange rates for 18+ currencies. Plan your travel budget accurately with live INR conversions."
  },
  {
    icon: "🛂",
    title: "Visa Document Tracker",
    desc: "Country-wise visa requirements for Indians. Interactive checklist so you never miss a document before your trip."
  },
  {
    icon: "🎒",
    title: "Smart Packing List",
    desc: "Destination-aware packing checklist. Add custom items, track what's packed, and never forget essentials again."
  },
  {
    icon: "🎯",
    title: "Mood-Based Discovery",
    desc: "Answer 4 quick questions about your travel style and get AI-matched destination recommendations instantly."
  },
];

const Features = () => (
  <section className="features-section" id="features">
    <div className="center">
      <div className="section-label">What We Offer</div>
      <h2 className="section-title">
        Real Features That<br />Actually Work
      </h2>
      <p className="section-sub">
        No fluff — every feature is live, tested, and built for Indian travelers.
      </p>
    </div>
    <div className="features-grid">
      {FEATURES.map((f, i) => (
        <div className="feature-card" key={i}>
          <div className="feature-icon">{f.icon}</div>
          <h3>{f.title}</h3>
          <p>{f.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

export default Features;
