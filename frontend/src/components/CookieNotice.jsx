import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const CookieNotice = () => {
  const [visible, setVisible] = useState(() => !localStorage.getItem('cookie_accepted'));

  const accept = () => { localStorage.setItem('cookie_accepted', '1'); setVisible(false); };
  const decline = () => setVisible(false);

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9997,
      background: 'rgba(8,12,24,0.97)',
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      padding: '14px 6vw',
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', gap: 16, flexWrap: 'wrap',
      animation: 'cookieSlideUp 0.3s ease',
    }}>
      <div style={{ flex: 1, minWidth: 260 }}>
        <div style={{ color: 'var(--white)', fontWeight: 700, fontSize: '0.85rem', marginBottom: 3, fontFamily: 'Inter, sans-serif' }}>
          🍪 We use cookies
        </div>
        <div style={{ color: 'var(--gray)', fontSize: '0.78rem', fontFamily: 'Inter, sans-serif', lineHeight: 1.5 }}>
          We use cookies to enhance your experience and analyze traffic.{' '}
          <Link to="/privacy" style={{ color: '#818cf8', textDecoration: 'none' }}>Privacy Policy</Link>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        <button onClick={decline} style={{
          padding: '7px 16px',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '9px', color: 'var(--muted)',
          fontFamily: 'Inter, sans-serif', fontSize: '0.78rem',
          fontWeight: 600, cursor: 'pointer',
          transition: 'all 0.15s',
        }}>
          Decline
        </button>
        <button onClick={accept} style={{
          padding: '7px 18px',
          background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
          border: 'none', borderRadius: '9px', color: 'white',
          fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.78rem',
          cursor: 'pointer', boxShadow: '0 3px 10px rgba(99,102,241,0.3)',
          transition: 'all 0.15s',
        }}>
          Accept All
        </button>
      </div>
      <style>{`@keyframes cookieSlideUp { from { transform:translateY(100%); opacity:0; } to { transform:translateY(0); opacity:1; } }`}</style>
    </div>
  );
};

export default CookieNotice;
