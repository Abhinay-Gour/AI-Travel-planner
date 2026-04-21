import React from "react";
import "./destinations.css";

const Destinations = () => {
  return (
    <section className="destinations-section">
      <div className="center">
        <div className="section-label">Popular Destinations</div>
        <h2 className="section-title">
          Dream Destinations,<br />
          AI-Planned Journeys
        </h2>
        <p className="section-sub">
          Explore trending destinations with instant AI-generated itineraries.
        </p>
      </div>
      <div className="dest-grid">
        <div className="dest-card">
          <div className="dest-bg">🗼</div>
          <div className="dest-info">
            <h4>Paris, France</h4>
            <p>The City of Love awaits</p>
            <span className="dest-tag">7 Days</span>
          </div>
        </div>
        <div className="dest-card">
          <div className="dest-bg">🗻</div>
          <div className="dest-info">
            <h4>Tokyo, Japan</h4>
            <p>Neon lights & ramen</p>
            <span className="dest-tag">10 Days</span>
          </div>
        </div>
        <div className="dest-card">
          <div className="dest-bg">🌺</div>
          <div className="dest-info">
            <h4>Bali, Indonesia</h4>
            <p>Serenity & sunsets</p>
            <span className="dest-tag">5 Days</span>
          </div>
        </div>
        <div className="dest-card">
          <div className="dest-bg">🗽</div>
          <div className="dest-info">
            <h4>New York, USA</h4>
            <p>The city that never sleeps</p>
            <span className="dest-tag">6 Days</span>
          </div>
        </div>
        <div className="dest-card">
          <div className="dest-bg">🏛️</div>
          <div className="dest-info">
            <h4>Rome, Italy</h4>
            <p>Eternal city, eternal magic</p>
            <span className="dest-tag">5 Days</span>
          </div>
        </div>
        <div className="dest-card">
          <div className="dest-bg">🏔️</div>
          <div className="dest-info">
            <h4>Himachal, India</h4>
            <p>Mountains & monasteries</p>
            <span className="dest-tag">8 Days</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Destinations;