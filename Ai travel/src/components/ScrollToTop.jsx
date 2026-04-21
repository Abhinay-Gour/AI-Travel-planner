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
        position: 'fixed', bottom: 100, left: 20, zIndex: 996,
        width: 44, height: 44, borderRadius: '50%',
        background: 'linear-gradient(135deg,#f43f5e,#9f1239)',
        border: 'none', color: 'white', fontSize: '1.1rem',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 16px rgba(244,63,94,0.4)',
        animation: 'fadeIn 0.3s ease',
        transition: 'transform 0.2s',
      }}
      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      ↑
      <style>{`@keyframes fadeIn { from { opacity:0; transform:scale(0.5); } to { opacity:1; transform:scale(1); } }`}</style>
    </button>
  );
};

export default ScrollToTop;
