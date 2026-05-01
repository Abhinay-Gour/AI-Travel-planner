import React, { useState, useEffect } from 'react';

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Scroll to top"
      style={{
        position: 'fixed', bottom: 96, left: 20, zIndex: 996,
        width: 40, height: 40, borderRadius: '10px',
        background: 'rgba(10,15,30,0.9)',
        border: '1px solid rgba(99,102,241,0.3)',
        color: '#a5b4fc', fontSize: '1rem',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
        animation: 'fadeInBtn 0.25s ease',
        transition: 'all 0.2s',
        fontFamily: 'Inter, sans-serif',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(99,102,241,0.15)';
        e.currentTarget.style.borderColor = 'rgba(99,102,241,0.6)';
        e.currentTarget.style.color = '#fff';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'rgba(10,15,30,0.9)';
        e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)';
        e.currentTarget.style.color = '#a5b4fc';
      }}
    >
      ↑
      <style>{`@keyframes fadeInBtn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </button>
  );
};

export default ScrollToTop;
