import React, { useEffect, useState } from 'react';

const LoadingScreen = ({ onDone }) => {
  const [progress, setProgress] = useState(0);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    // Fast steps: 0→100 in ~900ms
    const steps = [30, 60, 85, 100];
    let i = 0;
    const interval = setInterval(() => {
      if (i < steps.length) {
        setProgress(steps[i++]);
      } else {
        clearInterval(interval);
        setFade(true);
        setTimeout(onDone, 250);
      }
    }, 180);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'var(--night)',
      zIndex: 99999,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 20,
      opacity: fade ? 0 : 1,
      transition: 'opacity 0.25s ease',
    }}>
      <div style={{ fontSize: '3rem', animation: 'planeFly 1s ease infinite alternate' }}>✈️</div>
      <div style={{
        fontFamily: 'Playfair Display, serif',
        fontSize: 'clamp(1.3rem,4vw,1.8rem)',
        fontWeight: 800, color: 'var(--white)',
        letterSpacing: '-0.02em',
      }}>
        AI Travel Planner
      </div>
      <div style={{ width: 180, background: 'rgba(255,255,255,0.08)', borderRadius: 10, height: 4, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          background: 'linear-gradient(90deg,#f43f5e,#9f1239)',
          borderRadius: 10,
          width: `${progress}%`,
          transition: 'width 0.2s ease',
        }} />
      </div>
      <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', letterSpacing: '0.05em' }}>
        {progress < 60 ? 'Initializing AI...' : progress < 100 ? 'Almost ready...' : 'Let\'s go! ✨'}
      </div>
      <style>{`
        @keyframes planeFly {
          from { transform: translateX(-8px) rotate(-5deg); }
          to   { transform: translateX(8px) rotate(5deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
