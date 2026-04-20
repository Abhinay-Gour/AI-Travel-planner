import React from 'react';
import { useAuthModal } from '../context/AuthModalContext';
import { useUser } from '../context/UserContext';
import './cta.css';

const CTA = () => {
  const { openAuth } = useAuthModal();
  const { isAuthenticated } = useUser();

  const handleStart = () => {
    if (isAuthenticated) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      openAuth('signup');
    }
  };

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
        <button onClick={handleStart} className="btn-primary">
          {isAuthenticated ? '✈️ Plan a Trip Now' : '🚀 Start Planning Free'}
        </button>
        <a href="#features" className="btn-secondary">See How It Works</a>
      </div>
      <div className="cta-trust">
        <span>✅ No credit card required</span>
        <span>✅ Free forever plan</span>
        <span>✅ 50,000+ trips planned</span>
      </div>
    </section>
  );
};

export default CTA;
