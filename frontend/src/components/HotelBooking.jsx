import React, { useState } from 'react';
import './HotelBooking.css';

const POPULAR_CITIES = ['Goa', 'Manali', 'Jaipur', 'Mumbai', 'Delhi', 'Bangalore', 'Kerala', 'Shimla', 'Ooty', 'Udaipur'];

const HOTEL_SITES = [
  { name: 'Booking.com', icon: '🏨', color: '#003580', desc: '28M+ listings worldwide', getUrl: (city, ci, co, g) => `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(city)}&checkin=${ci}&checkout=${co}&group_adults=${g}&no_rooms=1` },
  { name: 'MakeMyTrip', icon: '🏩', color: '#e53e3e', desc: 'Best Indian hotel deals', getUrl: (city, ci, co, g) => `https://www.makemytrip.com/hotels/${city.toLowerCase().replace(/ /g,'-')}-hotels.html` },
  { name: 'OYO Rooms', icon: '🛏️', color: '#e53e3e', desc: 'Budget & premium stays', getUrl: (city, ci, co, g) => `https://www.oyorooms.com/search/?location=${encodeURIComponent(city)}&checkin=${ci}&checkout=${co}&guests=${g}` },
  { name: 'Airbnb', icon: '🏠', color: '#ff5a5f', desc: 'Unique stays & homes', getUrl: (city, ci, co, g) => `https://www.airbnb.co.in/s/${encodeURIComponent(city)}/homes?checkin=${ci}&checkout=${co}&adults=${g}` },
  { name: 'Agoda', icon: '🌏', color: '#5392f9', desc: 'Best Asia hotel prices', getUrl: (city, ci, co, g) => `https://www.agoda.com/search?city=${encodeURIComponent(city)}&checkIn=${ci}&checkOut=${co}&adults=${g}` },
  { name: 'Goibibo', icon: '🏪', color: '#e53e3e', desc: 'Exclusive Indian deals', getUrl: (city, ci, co, g) => `https://www.goibibo.com/hotels/hotels-in-${city.toLowerCase().replace(/ /g,'-')}/` },
  { name: 'Treebo Hotels', icon: '🌲', color: '#2f855a', desc: 'Quality budget hotels', getUrl: (city, ci, co, g) => `https://www.treebo.com/hotels-in-${city.toLowerCase().replace(/ /g,'-')}/` },
  { name: 'Google Hotels', icon: '🔍', color: '#4285f4', desc: 'Compare all prices', getUrl: (city, ci, co, g) => `https://www.google.com/travel/hotels/${encodeURIComponent(city)}?checkin=${ci}&checkout=${co}&guests=${g}` },
];

const HotelBooking = () => {
  const [city, setCity] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');
  const [searched, setSearched] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const handleSearch = () => {
    if (!city.trim()) return;
    setSearched(true);
  };

  const handleRedirect = (site) => {
    const ci = checkIn || today;
    const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
    const co = checkOut || tomorrow.toISOString().split('T')[0];
    window.open(site.getUrl(city, ci, co, guests), '_blank');
  };

  const nights = checkIn && checkOut
    ? Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000))
    : null;

  return (
    <section className="hotels-section" id="hotels">
      <div className="section-label">Stay & Relax</div>
      <h2 className="section-title">Hotel Booking 🏨</h2>
      <p className="section-sub">Search your city — we'll redirect you to the best booking sites</p>

      {/* Search Form */}
      <div className="hotel-search-bar">
        <div className="h-field">
          <label>🏙️ City / Destination</label>
          <input value={city} onChange={e => setCity(e.target.value)}
            placeholder="Goa, Manali, Jaipur..."
            onKeyDown={e => e.key === 'Enter' && handleSearch()} />
        </div>
        <div className="h-field">
          <label>📅 Check-in</label>
          <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} min={today} />
        </div>
        <div className="h-field">
          <label>📅 Check-out</label>
          <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} min={checkIn || today} />
        </div>
        <div className="h-field">
          <label>👥 Guests</label>
          <select value={guests} onChange={e => setGuests(e.target.value)}>
            {['1','2','3','4','5','6'].map(g => <option key={g} value={g}>{g} Guest{g !== '1' ? 's' : ''}</option>)}
          </select>
        </div>
        <button className="h-search-btn" onClick={handleSearch}>
          🔍 Find Hotels
        </button>
      </div>

      {/* Popular Cities */}
      {!searched && (
        <div className="popular-routes">
          <p className="popular-label">Popular Destinations:</p>
          <div className="routes-list">
            {POPULAR_CITIES.map(c => (
              <button key={c} className="route-chip" onClick={() => { setCity(c); setSearched(true); }}>
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Booking Sites */}
      {searched && (
        <div className="booking-sites-section">
          <div className="booking-sites-header">
            <h3>
              🏨 Hotels in {city}
              {nights && <span className="booking-date"> · {nights} night{nights > 1 ? 's' : ''} · {guests} guest{guests !== '1' ? 's' : ''}</span>}
            </h3>
            <p>Click any site to search & book directly</p>
          </div>

          <div className="booking-sites-grid">
            {HOTEL_SITES.map((site, i) => (
              <button key={i} className="booking-site-card" onClick={() => handleRedirect(site)}>
                <div className="site-icon" style={{ background: site.color + '20', border: `1px solid ${site.color}40` }}>
                  {site.icon}
                </div>
                <div className="site-info">
                  <div className="site-name">{site.name}</div>
                  <div className="site-desc">{site.desc}</div>
                </div>
                <div className="site-arrow">↗</div>
              </button>
            ))}
          </div>

          <div className="booking-note">
            🔒 You'll be redirected to the official site. Best prices & availability shown there.
          </div>

          <button className="modify-search-btn" onClick={() => setSearched(false)}>
            ← Modify Search
          </button>
        </div>
      )}
    </section>
  );
};

export default HotelBooking;
