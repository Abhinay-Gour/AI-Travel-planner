import React, { useEffect, useRef, useState } from 'react';
import './StatsCounter.css';

const stats = [
  { value: 52000, suffix: '+', label: 'Trips Planned', emoji: '✈️' },
  { value: 180,   suffix: '+', label: 'Countries Covered', emoji: '🌍' },
  { value: 4.9,   suffix: '/5', label: 'User Rating', emoji: '⭐', decimal: true },
  { value: 30,    suffix: 'sec', label: 'Avg Generation Time', emoji: '⚡' }
];

const useCountUp = (target, duration = 2000, decimal = false, start = false) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(decimal ? parseFloat((eased * target).toFixed(1)) : Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, decimal, start]);

  return count;
};

const StatItem = ({ stat, animate }) => {
  const count = useCountUp(stat.value, 2000, stat.decimal, animate);
  return (
    <div className="stat-item">
      <div className="stat-emoji">{stat.emoji}</div>
      <div className="stat-number">
        {count}{stat.suffix}
      </div>
      <div className="stat-label">{stat.label}</div>
    </div>
  );
};

const StatsCounter = () => {
  const [animate, setAnimate] = useState(false);
  const ref = useRef(null);

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
