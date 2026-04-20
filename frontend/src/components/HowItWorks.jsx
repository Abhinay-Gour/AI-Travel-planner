import React from "react";
import "./howItWorks.css";

const HowItWorks = () => {
  return (
    <section className="steps-section" id="how">
      <div className="center">
        <div className="section-label">How It Works</div>
        <h2 className="section-title">
          From Idea to Itinerary<br />
          in 4 Simple Steps
        </h2>
        <p className="section-sub">
          Destination to detailed trip plan — done in minutes, not days.
        </p>
      </div>
      <div className="steps-grid">
        <div className="step">
          <div className="step-num">1</div>
          <h3>Enter Your Destination</h3>
          <p>
            Type where you want to go. Our smart search finds cities, regions, 
            and hidden gems worldwide. From popular tourist destinations to 
            off-the-beaten-path locations, we help you discover amazing places.
          </p>
        </div>
        <div className="step">
          <div className="step-num">2</div>
          <h3>Set Your Travel Dates</h3>
          <p>
            Pick your travel window and duration. Our AI optimizes your itinerary 
            based on trip length, local events, weather conditions, and seasonal 
            attractions to give you the best possible experience.
          </p>
        </div>
        <div className="step">
          <div className="step-num">3</div>
          <h3>Generate with AI</h3>
          <p>
            Hit generate and watch our advanced AI instantly create your 
            personalized day-by-day plan with top attractions, local restaurants, 
            activities, and hidden gems tailored to your preferences.
          </p>
        </div>
        <div className="step">
          <div className="step-num">4</div>
          <h3>Customize & Share</h3>
          <p>
            Edit activities, add travel companions, modify timings, and share 
            your complete itinerary via WhatsApp, email, or download. Your 
            perfect trip is ready to go!
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;