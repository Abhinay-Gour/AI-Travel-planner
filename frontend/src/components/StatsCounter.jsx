import React, { useEffect, useRef, useState } from 'react';
import './StatsCounter.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const FALLBACK = [
  { value: 0,   suffix: '+', label: 'Trips Planned',        emoji: '✈️' },
  { value: 180, suffix: '+', label: 'Countries Covered',    emoji: '🌍' },
  { value: 4.9, suffix: '/5', label: 'User Rating',         emoji: '⭐', decimal: true },
  { value: 30,  suffix: 's',  label: 'Avg Generation Time', emoji: '⚡' },
];

const useCountUp = (target, duration = 1800, decimal = false, start = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start || target === 0) return;
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(decimal ? parseFloat((eased * target).toFixed(1)) : Math.floor(eased * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, decimal, start]);
  return count;
};

const StatItem = ({ stat, animate }) => {
  const count = useCountUp(stat.value, 1800, stat.decimal, animate);
  return (
    <div className="stat-item">
      <div className="stat-emoji">{stat.emoji}</div>
      <div className="stat-number">{count}{stat.suffix}</div>
      <div className="stat-label">{stat.label}</div>
    </div>
  );
};

const StatsCounter = () => {
  const [stats, setStats] = useState(FALLBACK);
  const [animate, setAnimate] = useState(false);
  const ref = useRef(null);

  // Fetch real stats from backend
  useEffect(() => {
    fetch(`${API_URL}/users/stats/public`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setStats([
            { value: data.data.totalTrips || 0,   suffix: '+',  label: 'Trips Planned',        emoji: '✈️' },
            { value: data.data.totalUsers || 0,   suffix: '+',  label: 'Happy Travelers',      emoji: '👥' },
            { value: 4.9,                          suffix: '/5', label: 'User Rating',          emoji: '⭐', decimal: true },
            { value: 30,                           suffix: 's',  label: 'Avg Generation Time', emoji: '⚡' },
          ]);
        }
      })
      .catch(() => {}); // silently fallback
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimate(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="stats-section" ref={ref}>
      <div className="stats-grid">
        {stats.map((stat, i) => (
          <StatItem key={i} stat={stat} animate={animate} />
        ))}
      </div>
    </section>
  );
};

export default StatsCounter;
