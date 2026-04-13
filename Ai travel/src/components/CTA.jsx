import React from "react";
import "./cta.css";

const CTA = () => {
  return (
    <section className="cta-section">
      <div className="section-label">Get Started Today</div>
      <h2 className="section-title">
        Ready to Plan Your<br />
        Next Adventure?
      </h2>
      <p className="section-sub">
        Join thousands of travelers creating amazing journeys with AI. It's free to start.
      </p>
      <div className="cta-buttons">
        <a href="#" className="btn-primary">Start Planning Free ♥</a>
        <a href="#" className="btn-secondary">See How It Works</a>
      </div>
    </section>
  );
};

export default CTA;