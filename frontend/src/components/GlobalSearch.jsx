import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './GlobalSearch.css';

const SEARCH_DATA = [
  { label: 'Plan a Trip',          desc: 'AI-powered itinerary generator',  path: '/',             icon: '🤖' },
  { label: 'Explore Destinations', desc: 'Browse 18+ destinations',         path: '/destinations', icon: '🌍' },
  { label: 'My Wishlist',          desc: 'Saved dream destinations',        path: '/wishlist',     icon: '❤️' },
  { label: 'Packing List',         desc: 'Smart travel checklist',          path: '/packing',      icon: '🎒' },
  { label: 'Mood Quiz',            desc: 'Find your perfect destination',   path: '/mood-quiz',    icon: '🎯' },
  { label: 'Currency Converter',   desc: 'Live exchange rates 18+ currencies', path: '/#currency', icon: '💱' },
  { label: 'Visa Info',            desc: 'Visa requirements for Indians',   path: '/#visa',        icon: '🛂' },
  { label: 'Visa Document Tracker',desc: 'Checklist by country',            path: '/#visa-tracker',icon: '📋' },
  { label: 'Festival Calendar',    desc: 'Travel during Indian festivals',  path: '/#festivals',   icon: '🎉' },
  { label: 'Cost Calculator',      desc: 'Estimate trip budget in ₹',      path: '/#calculator',  icon: '💰' },
  { label: 'Travel Insurance',     desc: 'Compare insurance plans',         path: '/#insurance',   icon: '🛡️' },
  { label: 'Travel Checklist',     desc: 'Pre-departure checklist',         path: '/#checklist',   icon: '✅' },
  { label: 'Pricing',              desc: 'Plans & subscription',            path: '/#pricing',     icon: '💎' },
  { label: 'FAQ',                  desc: 'Frequently asked questions',      path: '/#faq',         icon: '❓' },
  { label: 'Goa',    dest: 'Goa, India',        desc: 'Beaches & nightlife',    path: '/', icon: '🏖️' },
  { label: 'Manali', dest: 'Manali, India',     desc: 'Snow peaks & adventure', path: '/', icon: '🏔️' },
  { label: 'Jaipur', dest: 'Jaipur, India',     desc: 'History & culture',      path: '/', icon: '🏯' },
  { label: 'Kerala', dest: 'Kerala, India',     desc: 'Backwaters & nature',    path: '/', icon: '🌴' },
  { label: 'Paris',  dest: 'Paris, France',     desc: 'City of love & lights',  path: '/', icon: '🗼' },
  { label: 'Bali',   dest: 'Bali, Indonesia',   desc: 'Temples & beaches',      path: '/', icon: '🌺' },
  { label: 'Tokyo',  dest: 'Tokyo, Japan',      desc: 'Culture & street food',  path: '/', icon: '🗻' },
  { label: 'Dubai',  dest: 'Dubai, UAE',        desc: 'Luxury & desert',        path: '/', icon: '🏙️' },
];

const GlobalSearch = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const filtered = query.trim()
    ? SEARCH_DATA.filter(item =>
        item.label.toLowerCase().includes(query.toLowerCase()) ||
        item.desc.toLowerCase().includes(query.toLowerCase())
      )
    : SEARCH_DATA.slice(0, 8);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 80);
  }, [open]);

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); setOpen(true); }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleSelect = (item) => {
    setOpen(false);
    setQuery('');
    if (item.dest) {
      window.dispatchEvent(new CustomEvent('selectDestination', { detail: item.dest }));
      navigate('/');
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
    } else if (item.path.includes('#')) {
      const [path, hash] = item.path.split('#');
      navigate(path || '/');
      setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' }), 300);
    } else {
      navigate(item.path);
    }
  };

  return (
    <>
      <button className="search-trigger" onClick={() => setOpen(true)} title="Search (Ctrl+K)">
        <span className="search-trigger-icon">🔍</span>
        <span className="search-trigger-text">Search...</span>
        <span className="search-kbd">⌘K</span>
      </button>

      {open && (
        <div className="search-overlay" onClick={() => setOpen(false)}>
          <div className="search-modal" onClick={e => e.stopPropagation()}>
            <div className="search-input-wrap">
              <span className="search-icon">🔍</span>
              <input
                ref={inputRef}
                className="search-input"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search destinations, features, pages..."
              />
              {query && <button className="search-clear" onClick={() => setQuery('')}>✕</button>}
            </div>
            <div className="search-results">
              {filtered.length === 0 ? (
                <div className="search-empty">No results for "{query}"</div>
              ) : (
                filtered.map((item, i) => (
                  <button key={i} className="search-result-item" onClick={() => handleSelect(item)}>
                    <span className="search-result-icon">{item.icon}</span>
                    <div className="search-result-info">
                      <div className="search-result-label">{item.label}</div>
                      <div className="search-result-desc">{item.desc}</div>
                    </div>
                    <span className="search-result-arrow">→</span>
                  </button>
                ))
              )}
            </div>
            <div className="search-footer">↑↓ navigate · Enter select · Esc close</div>
          </div>
        </div>
      )}
    </>
  );
};

export default GlobalSearch;
