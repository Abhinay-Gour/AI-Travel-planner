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
  const [showAuthWarning, setShowAuthWarning] = useState(false);
  const [pendingPlanTrip, setPendingPlanTrip] = useState(false);

  // Listen for destination selection from GlobeDashboard
  useEffect(() => {
    const handler = (e) => {
      setDestination(e.detail);
      if (isAuthenticated) setShowForm(true);
      else { setPendingPlanTrip(true); openAuth('login'); }
    };
    window.addEventListener('selectDestination', handler);
    return () => window.removeEventListener('selectDestination', handler);
  }, [isAuthenticated]);

  // Auto-show form after login if user clicked "Login to Plan"
  useEffect(() => {
    if (isAuthenticated && pendingPlanTrip && destination.trim()) {
      setShowForm(true);
      setPendingPlanTrip(false);
    }
  }, [isAuthenticated, pendingPlanTrip, destination]);

  const handlePlanTrip = (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      if (destination.trim()) {
        setPendingPlanTrip(true);
        openAuth('login');
      } else {
        toast('Please enter a destination first', 'warning');
      }
      return;
    }
    if (destination.trim()) {
      setShowForm(true);
    } else {
      toast('Please enter a destination', 'warning');
    }
  };

  const handleTripGenerated = (data) => {
    setTripData(data);
    setShowForm(false);
  };

  const handleCloseResult = () => {
    setTripData(null);
    setDestination('');
  };

  const handleQuickDestination = (dest) => {
    if (!isAuthenticated) {
      setDestination(dest);
      setPendingPlanTrip(true);
      openAuth('login'); // Open login modal
      return;
    }
    
    setDestination(dest);
    setShowForm(true);
  };

  return (
    <>
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="hero-wrapper">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="dot"></span>
              AI-Powered Travel Planning
            </div>
            <h1>
              Plan Your <em>Perfect</em> Trip with <span className="highlight">AI Magic</span>
            </h1>
            <p className="hero-sub">
              AI Travel Planner creates personalized day-by-day itineraries in seconds. 
              Enter your destination, set your dates, and let AI build your dream journey.
            </p>
            
            {/* Auth Warning */}
            {showAuthWarning && (
              <div className="auth-warning">
                <p>⚠️ Please login or signup first to plan your trip!</p>
              </div>
            )}
            
            <form className="hero-form" onSubmit={handlePlanTrip}>
              <input
                type="text"
                placeholder="Where do you want to go? e.g. Paris, Bali, Tokyo..."
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
              <button type="submit">
                {isAuthenticated ? 'Plan My Trip ♥' : 'Login to Plan ♥'}
              </button>
            </form>
            
            {/* Quick destination cards */}
            <div className="hero-stats">
              <span>No credit card required</span>
              <span>50,000+ trips planned</span>
              <span>4.8/5 user rating</span>
            </div>
            <MoodQuiz onSelectDestination={(dest) => { setDestination(dest); if (isAuthenticated) setShowForm(true); else { setPendingPlanTrip(true); openAuth('login'); } }} />
            
            {isAuthenticated && (
              <div className="user-welcome">
                <p>Welcome back, {user?.name}! Ready to plan your next adventure? ✈️</p>
              </div>
            )}
          </div>
          
          <div className="floating-cards">
            <div className="trip-card" onClick={() => handleQuickDestination('Paris, France')}>
              <div className="flag">🗼</div>
              <h4>Paris, France</h4>
              <p>Art, romance & cuisine</p>
              <div className="days">7 Day Plan Ready</div>
            </div>
            <div className="trip-card" onClick={() => handleQuickDestination('Bali, Indonesia')}>
              <div className="flag">🌺</div>
              <h4>Bali, Indonesia</h4>
              <p>Temples & beaches</p>
              <div className="days">5 Day Plan Ready</div>
            </div>
            <div className="trip-card" onClick={() => handleQuickDestination('Tokyo, Japan')}>
              <div className="flag">🗻</div>
              <h4>Tokyo, Japan</h4>
              <p>Culture & street food</p>
              <div className="days">10 Day Plan Ready</div>
            </div>
            <div className="trip-card" onClick={() => handleQuickDestination('Rome, Italy')}>
              <div className="flag">🏛️</div>
              <h4>Rome, Italy</h4>
              <p>History & pasta</p>
              <div className="days">6 Day Plan Ready</div>
            </div>
          </div>
        </div>
      </section>

      {showForm && isAuthenticated && (
        <TripPlannerForm 
          initialDestination={destination}
          onTripGenerated={handleTripGenerated}
          onClose={() => setShowForm(false)}
          user={user}
        />
      )}

      {tripData && (
        <TripResult 
          tripData={tripData}
          onClose={handleCloseResult}
        />
      )}
    </>
  );
};

export default Hero;
