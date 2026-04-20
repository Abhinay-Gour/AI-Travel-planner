import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './GlobalSearch.css';

const SEARCH_DATA = [
  { label: 'Plan a Trip', desc: 'AI-powered itinerary generator', path: '/', action: 'scroll-hero', icon: '🤖' },
  { label: 'Search Flights', desc: 'Find flights between cities', path: '/transport', icon: '✈️' },
  { label: 'Book Hotels', desc: 'Search & compare hotels', path: '/hotels', icon: '🏨' },
  { label: 'My Wishlist', desc: 'Saved destinations', path: '/wishlist', icon: '❤️' },
  { label: 'Packing List', desc: 'Smart travel checklist', path: '/packing', icon: '🎒' },
  { label: 'Mood Quiz', desc: 'Find your perfect destination', path: '/mood-quiz', icon: '🎯' },
  { label: 'Currency Converter', desc: 'Live exchange rates', path: '/#currency', icon: '💱' },
  { label: 'Visa Info', desc: 'Visa requirements for Indians', path: '/#visa', icon: '🛂' },
  { label: 'Festival Calendar', desc: 'Travel during festivals', path: '/#festivals', icon: '🎉' },
  { label: 'Cost Calculator', desc: 'Estimate trip budget', path: '/#calculator', icon: '💰' },
  { label: 'PNR Status', desc: 'Check train booking status', path: '/#pnr', icon: '🚆' },
  { label: 'Group Planner', desc: 'Plan trips with friends', path: '/#group', icon: '👥' },
  { label: 'Budget Optimizer', desc: 'AI budget tips', path: '/#budget-optimizer', icon: '💡' },
  { label: 'Multi-City Planner', desc: 'Plan route across cities', path: '/#multi-city', icon: '🗺️' },
  { label: 'Travel Stories', desc: 'Community travel experiences', path: '/#stories', icon: '✍️' },
  { label: 'Leaderboard', desc: 'Top travelers & badges', path: '/#leaderboard', icon: '🏆' },
  { label: 'Travel Buddy', desc: 'Find travel companions', path: '/#travel-buddy', icon: '👥' },
  { label: 'Visa Tracker', desc: 'Document checklist by country', path: '/#visa-tracker', icon: '🛂' },
  { label: 'Travel Insurance', desc: 'Compare insurance plans', path: '/#insurance', icon: '🛡️' },
  { label: 'Destinations Explorer', desc: 'Browse all destinations', path: '/destinations', icon: '🌍' },
  { label: 'Travel Blog', desc: 'AI travel articles & guides', path: '/blog', icon: '✍️' },
  { label: 'Travel Videos', desc: 'Watch destination vlogs', path: '/videos', icon: '🎬' },
  { label: 'Emergency Contacts', desc: 'Helplines by country', path: '/#emergency', icon: '🆘' },
  { label: 'Travel Checklist', desc: 'Pre-departure checklist', path: '/#checklist', icon: '✅' },
  { label: 'Trip Dashboard', desc: 'Track your trips', path: '/#trip-dashboard', icon: '🗓️' },
  { label: 'Goa', desc: 'Beaches & nightlife', path: '/', dest: 'Goa, India', icon: '🏖️' },
  { label: 'Manali', desc: 'Snow peaks & adventure', path: '/', dest: 'Manali, India', icon: '🏔️' },
  { label: 'Paris', desc: 'City of love & lights', path: '/', dest: 'Paris, France', icon: '🗼' },
  { label: 'Bali', desc: 'Temples & beaches', path: '/', dest: 'Bali, Indonesia', icon: '🌺' },
  { label: 'Tokyo', desc: 'Culture & street food', path: '/', dest: 'Tokyo, Japan', icon: '🗻' },
  { label: 'Dubai', desc: 'Luxury & desert', path: '/', dest: 'Dubai, UAE', icon: '🏙️' },
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
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
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
        🔍 <span className="search-trigger-text">Search...</span>
        <span className="search-kbd">Ctrl K</span>
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
            <div className="search-footer">Press Esc to close · Ctrl+K to open</div>
          </div>
        </div>
      )}
    </>
  );
};

export default GlobalSearch;
