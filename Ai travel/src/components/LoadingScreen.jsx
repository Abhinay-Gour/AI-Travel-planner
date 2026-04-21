import React, { useState, useEffect } from 'react';

const LoadingScreen = ({ onDone }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const steps = [20, 45, 70, 90, 100];
    let i = 0;
    const interval = setInterval(() => {
      if (i < steps.length) {
        setProgress(steps[i]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(onDone, 300);
      }
    }, 250);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'var(--night)', zIndex: 99999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
      <div style={{ fontSize: '3.5rem', animation: 'spin 2s linear infinite' }}>✈️</div>
      <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.4rem,4vw,2rem)', fontWeight: 800, color: 'var(--white)' }}>
        AI Travel Planner
      </div>
      <div style={{ width: 200, background: 'rgba(255,255,255,0.08)', borderRadius: 10, height: 6, overflow: 'hidden' }}>
        <div style={{ height: '100%', background: 'linear-gradient(90deg,#f43f5e,#9f1239)', borderRadius: 10, width: `${progress}%`, transition: 'width 0.3s ease' }} />
      </div>
      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem' }}>Loading your travel experience...</div>
      <style>{`@keyframes spin { from { transform: rotate(0deg) translateX(20px) rotate(0deg); } to { transform: rotate(360deg) translateX(20px) rotate(-360deg); } }`}</style>
    </div>
  );
};

export default LoadingScreen;
