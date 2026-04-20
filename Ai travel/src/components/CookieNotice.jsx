import React, { useState } from 'react';

const CookieNotice = () => {
  const [visible, setVisible] = useState(() => !localStorage.getItem('cookie_accepted'));

  const accept = () => { localStorage.setItem('cookie_accepted', '1'); setVisible(false); };
  const decline = () => { setVisible(false); };

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9997,
      background: 'rgba(15,10,11,0.97)', backdropFilter: 'blur(12px)',
      borderTop: '1px solid rgba(225,29,72,0.2)',
      padding: '16px 6vw', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', gap: 16, flexWrap: 'wrap',
      animation: 'slideUp 0.4s ease',
    }}>
      <div style={{ flex: 1, minWidth: 260 }}>
        <div style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem', marginBottom: 4 }}>🍪 We use cookies</div>
        <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.8rem' }}>
          We use cookies to enhance your experience, analyze traffic, and personalize content.
          By continuing, you agree to our{' '}
          <a href="#" style={{ color: '#f43f5e', textDecoration: 'none' }}>Privacy Policy</a>.
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
        <button onClick={decline} style={{ padding: '8px 18px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 20, color: 'rgba(255,255,255,0.6)', fontFamily: 'DM Sans', fontSize: '0.82rem', cursor: 'pointer' }}>
          Decline
        </button>
        <button onClick={accept} style={{ padding: '8px 20px', background: 'linear-gradient(135deg,#f43f5e,#9f1239)', border: 'none', borderRadius: 20, color: 'white', fontFamily: 'DM Sans', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>
          Accept All
        </button>
      </div>
      <style>{`@keyframes slideUp { from { transform:translateY(100%); } to { transform:translateY(0); } }`}</style>
    </div>
  );
};

export default CookieNotice;
