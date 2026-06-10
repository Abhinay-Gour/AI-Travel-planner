import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { useAuthModal } from "../context/AuthModalContext";
import { useToast } from "../context/ToastContext";
import TripPlannerForm from "./TripPlannerForm";
import TripResult from "./TripResult";
import MoodQuiz from "./MoodQuiz";
import "./hero.css";

const Hero = () => {
  const { isAuthenticated, user } = useUser();
  const { openAuth } = useAuthModal();
  const toast = useToast();
  const [showForm, setShowForm] = useState(false);
  const [tripData, setTripData] = useState(null);
  const [destination, setDestination] = useState('');
  const [pendingPlanTrip, setPendingPlanTrip] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      setDestination(e.detail);
      if (isAuthenticated) setShowForm(true);
      else { setPendingPlanTrip(true); openAuth('login'); }
    };
    window.addEventListener('selectDestination', handler);
    return () => window.removeEventListener('selectDestination', handler);
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && pendingPlanTrip && destination.trim()) {
      setShowForm(true);
      setPendingPlanTrip(false);
    }
  }, [isAuthenticated, pendingPlanTrip, destination]);

  const handlePlanTrip = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      if (destination.trim()) { setPendingPlanTrip(true); openAuth('login'); }
      else toast('Please enter a destination first', 'warning');
      return;
    }
    if (destination.trim()) setShowForm(true);
    else toast('Please enter a destination', 'warning');
  };

  const handleQuickDestination = (dest) => {
    if (!isAuthenticated) { setDestination(dest); setPendingPlanTrip(true); openAuth('login'); return; }
    setDestination(dest);
    setShowForm(true);
  };

  return (
    <>
      <section className="hero">
        <div className="hero-bg" aria-hidden="true"></div>
        <div className="hero-wrapper">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="dot" aria-hidden="true"></span>
              AI-Powered Travel Planning
            </div>
            <h1>
              Plan Your <em>Perfect</em> Trip with <span className="highlight">AI Magic</span>
            </h1>
            <p className="hero-sub">
              AI Travel Planner creates personalized day-by-day itineraries in seconds.
              Enter your destination, set your dates, and let AI build your dream journey.
            </p>

            <form className="hero-form" onSubmit={handlePlanTrip} role="search">
              <input
                type="text"
                placeholder="Where do you want to go? e.g. Paris, Bali, Tokyo..."
                value={destination}
                onChange={(e) => setDestination(e.target.value.slice(0, 100))}
                aria-label="Enter destination"
                autoComplete="off"
              />
              <button type="submit" aria-label={isAuthenticated ? 'Plan my trip' : 'Login to plan trip'}>
                {isAuthenticated ? 'Plan My Trip ♥' : 'Login to Plan ♥'}
              </button>
            </form>

            <div className="hero-stats" aria-label="Platform statistics">
              <span>No credit card required</span>
              <span>50,000+ trips planned</span>
              <span>4.8/5 user rating</span>
            </div>

            <MoodQuiz onSelectDestination={(dest) => {
              setDestination(dest);
              if (isAuthenticated) setShowForm(true);
              else { setPendingPlanTrip(true); openAuth('login'); }
            }} />

            {isAuthenticated && (
              <div className="user-welcome">
                <p>Welcome back, {user?.name}! Ready to plan your next adventure? ✈️</p>
              </div>
            )}
          </div>

          <div className="floating-cards" role="list" aria-label="Popular destinations">
            {[
              { dest: 'Paris, France', flag: '🗼', desc: 'Art, romance & cuisine', days: '7 Day Plan Ready' },
              { dest: 'Bali, Indonesia', flag: '🌺', desc: 'Temples & beaches', days: '5 Day Plan Ready' },
              { dest: 'Tokyo, Japan', flag: '🗻', desc: 'Culture & street food', days: '10 Day Plan Ready' },
              { dest: 'Rome, Italy', flag: '🏛️', desc: 'History & pasta', days: '6 Day Plan Ready' },
            ].map(({ dest, flag, desc, days }) => (
              <div
                key={dest}
                className="trip-card"
                role="listitem"
                onClick={() => handleQuickDestination(dest)}
                onKeyDown={e => e.key === 'Enter' && handleQuickDestination(dest)}
                tabIndex={0}
                aria-label={`Plan trip to ${dest}`}
              >
                <div className="flag" aria-hidden="true">{flag}</div>
                <h4>{dest}</h4>
                <p>{desc}</p>
                <div className="days">{days}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {showForm && isAuthenticated && (
        <TripPlannerForm
          initialDestination={destination}
          onTripGenerated={(data) => { setTripData(data); setShowForm(false); }}
          onClose={() => setShowForm(false)}
          user={user}
        />
      )}

      {tripData && (
        <TripResult
          tripData={tripData}
          onClose={() => { setTripData(null); setDestination(''); }}
        />
      )}
    </>
  );
};

export default Hero;
