import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { getMyTrips } from '../services/authService';

const TripCountdown = () => {
  const { isAuthenticated } = useUser();
  const [nextTrip, setNextTrip] = useState(null);
  const [days, setDays] = useState(null);
  const [dismissed, setDismissed] = useState(() => !!sessionStorage.getItem('countdown_dismissed'));

  useEffect(() => {
    if (!isAuthenticated || dismissed) return;

    const fetchNext = async () => {
      try {
        const data = await getMyTrips(1, 20);
        const trips = data.trips || [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcoming = trips
          .filter(t => t.startDate && new Date(t.startDate) >= today && t.status !== 'cancelled')
          .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

        if (upcoming.length > 0) {
          const trip = upcoming[0];
          const diff = Math.ceil((new Date(trip.startDate) - today) / 86400000);
          setNextTrip(trip);
          setDays(diff);
        }
      } catch {}
    };

    fetchNext();
  }, [isAuthenticated, dismissed]);

  const dismiss = () => {
    sessionStorage.setItem('countdown_dismissed', '1');
    setDismissed(true);
  };

  if (!isAuthenticated || !nextTrip || dismissed) return null;

  const getEmoji = () => {
    if (days === 0) return '🎉';
    if (days === 1) return '🚀';
    if (days <= 7) return '⏰';
    return '✈️';
  };

  const getMessage = () => {
    if (days === 0) return `Your trip to ${nextTrip.destination} is TODAY!`;
    if (days === 1) return `Your trip to ${nextTrip.destination} is TOMORROW!`;
    return `Your trip to ${nextTrip.destination} is in ${days} days`;
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(79,70,229,0.06))',
      border: '1px solid rgba(99,102,241,0.25)',
      borderRadius: 14,
      padding: '14px 20px',
      margin: '0 6vw 0',
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      animation: 'fadeUp 0.4s ease',
      position: 'relative',
    }}>
      {/* Countdown circle */}
      <div style={{
        width: 52, height: 52, borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--indigo), var(--indigo2))',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, boxShadow: '0 4px 14px var(--glow-indigo)',
      }}>
        <div style={{ color: '#fff', fontWeight: 900, fontSize: days > 99 ? '0.75rem' : '1.1rem', lineHeight: 1, fontFamily: 'Inter, sans-serif' }}>
          {days === 0 ? '🎉' : days}
        </div>
        {days > 0 && <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.55rem', fontWeight: 600, letterSpacing: '0.04em' }}>DAYS</div>}
      </div>

      {/* Text */}
      <div style={{ flex: 1 }}>
        <div style={{ color: 'var(--white)', fontWeight: 700, fontSize: '0.9rem', fontFamily: 'Inter, sans-serif', letterSpacing: '-0.01em' }}>
          {getEmoji()} {getMessage()}
        </div>
        <div style={{ color: 'var(--muted)', fontSize: '0.75rem', fontFamily: 'Inter, sans-serif', marginTop: 2 }}>
          {nextTrip.duration} · {new Date(nextTrip.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </div>
      </div>

      {/* View trips button */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
        <div style={{
          background: 'var(--indigo3)', border: '1px solid var(--border2)',
          borderRadius: 8, padding: '5px 12px',
          color: '#a5b4fc', fontSize: '0.75rem', fontWeight: 600,
          fontFamily: 'Inter, sans-serif',
        }}>
          🗺️ {nextTrip.destination}
        </div>
        <button onClick={dismiss} style={{
          background: 'none', border: 'none', color: 'var(--gray)',
          cursor: 'pointer', fontSize: '0.9rem', padding: '2px 4px',
          borderRadius: 6, transition: 'color 0.15s',
        }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--white)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--gray)'}>
          ✕
        </button>
      </div>
    </div>
  );
};

export default TripCountdown;
