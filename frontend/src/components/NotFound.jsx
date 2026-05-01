import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div style={{
    minHeight: '100vh', display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    padding: '20px', textAlign: 'center',
    background: 'var(--night)',
  }}>
    <div style={{ fontSize: '4rem', marginBottom: 16 }}>✈️</div>
    <h1 style={{
      fontFamily: 'Playfair Display, serif',
      fontSize: 'clamp(4rem,10vw,7rem)',
      fontWeight: 900, margin: '0 0 8px',
      background: 'linear-gradient(135deg, #a5b4fc, #6366f1)',
      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    }}>404</h1>
    <h2 style={{ color: 'var(--white)', fontSize: '1.3rem', fontWeight: 700, marginBottom: 10, letterSpacing: '-0.02em' }}>
      Page Not Found
    </h2>
    <p style={{ color: 'var(--muted)', fontSize: '0.95rem', marginBottom: 32, maxWidth: 380, lineHeight: 1.6 }}>
      Looks like this page took a wrong flight! Let's get you back on track.
    </p>
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
      <Link to="/" style={{
        padding: '12px 28px',
        background: 'linear-gradient(135deg, var(--rose), var(--deep))',
        color: 'white', textDecoration: 'none',
        borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem',
        boxShadow: '0 4px 16px rgba(244,63,94,0.3)',
        fontFamily: 'Inter, sans-serif',
      }}>
        🏠 Go Home
      </Link>
      <Link to="/destinations" style={{
        padding: '12px 28px',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid var(--border)',
        color: 'var(--muted)', textDecoration: 'none',
        borderRadius: '12px', fontWeight: 600, fontSize: '0.9rem',
        fontFamily: 'Inter, sans-serif',
        transition: 'all 0.2s',
      }}>
        🌍 Explore Destinations
      </Link>
    </div>
  </div>
);

export default NotFound;
