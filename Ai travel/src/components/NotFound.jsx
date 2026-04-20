import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', textAlign: 'center' }}>
    <div style={{ fontSize: '5rem', marginBottom: 16 }}>✈️</div>
    <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(3rem,8vw,6rem)', fontWeight: 900, color: 'var(--rose)', margin: '0 0 8px' }}>404</h1>
    <h2 style={{ color: 'var(--white)', fontSize: '1.4rem', fontWeight: 700, marginBottom: 12 }}>Page Not Found</h2>
    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem', marginBottom: 32, maxWidth: 400 }}>
      Looks like this page took a wrong flight! Let's get you back on track.
    </p>
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
      <Link to="/" style={{ padding: '12px 28px', background: 'linear-gradient(135deg,#f43f5e,#9f1239)', color: 'white', textDecoration: 'none', borderRadius: 25, fontWeight: 700, fontSize: '0.95rem' }}>
        🏠 Go Home
      </Link>
      <Link to="/destinations" style={{ padding: '12px 28px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(225,29,72,0.3)', color: 'rgba(255,255,255,0.8)', textDecoration: 'none', borderRadius: 25, fontWeight: 600, fontSize: '0.95rem' }}>
        🌍 Explore Destinations
      </Link>
    </div>
  </div>
);

export default NotFound;
