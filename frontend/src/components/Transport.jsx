import React, { useState } from 'react';
import './Transport.css';

const POPULAR_ROUTES = [
  { from: 'Delhi', to: 'Mumbai' },
  { from: 'Mumbai', to: 'Goa' },
  { from: 'Delhi', to: 'Bangalore' },
  { from: 'Chennai', to: 'Hyderabad' },
  { from: 'Kolkata', to: 'Delhi' },
  { from: 'Mumbai', to: 'Jaipur' },
];

const BOOKING_SITES = {
  flight: [
    { name: 'MakeMyTrip', icon: '✈️', color: '#e53e3e', getUrl: (f, t, d, p) => `https://www.makemytrip.com/flights/domestic/results?tripType=O&itinerary=${f.toUpperCase()}-${t.toUpperCase()}-${d}&paxType=A-${p}_C-0_I-0&cabinClass=E&sTime=${Date.now()}&forwardFlowRequired=true` },
    { name: 'EaseMyTrip', icon: '🛫', color: '#3182ce', getUrl: (f, t, d, p) => `https://www.easemytrip.com/flights/domestic-flights.aspx?org=${f}&dest=${t}&dd=${d}&ad=${p}&cd=0&id=0&tt=1` },
    { name: 'Cleartrip', icon: '🌐', color: '#805ad5', getUrl: (f, t, d, p) => `https://www.cleartrip.com/flights/results?adults=${p}&childs=0&infants=0&class=Economy&depart_date=${d}&from=${f}&to=${t}&intl=n` },
    { name: 'IndiGo', icon: '💙', color: '#2b6cb0', getUrl: (f, t, d, p) => `https://www.goindigo.in/flight-booking.html` },
    { name: 'Air India', icon: '🇮🇳', color: '#c53030', getUrl: (f, t, d, p) => `https://www.airindia.com/in/en/book/flights.html` },
    { name: 'Google Flights', icon: '🔍', color: '#4285f4', getUrl: (f, t, d, p) => `https://www.google.com/travel/flights?q=flights+from+${encodeURIComponent(f)}+to+${encodeURIComponent(t)}+on+${d}` },
  ],
  train: [
    { name: 'IRCTC', icon: '🚄', color: '#2f855a', getUrl: (f, t, d) => `https://www.irctc.co.in/nget/train-search` },
    { name: 'MakeMyTrip Trains', icon: '🚆', color: '#e53e3e', getUrl: (f, t, d) => `https://www.makemytrip.com/railways/` },
    { name: 'Cleartrip Trains', icon: '🛤️', color: '#805ad5', getUrl: (f, t, d) => `https://www.cleartrip.com/trains/results?from=${encodeURIComponent(f)}&to=${encodeURIComponent(t)}&date=${d}` },
    { name: 'RailYatri', icon: '📱', color: '#d69e2e', getUrl: (f, t, d) => `https://www.railyatri.in/train-between-stations?from=${encodeURIComponent(f)}&to=${encodeURIComponent(t)}&date=${d}` },
  ],
  bus: [
    { name: 'redBus', icon: '🚌', color: '#e53e3e', getUrl: (f, t, d) => `https://www.redbus.in/bus-tickets/${f.toLowerCase().replace(/ /g,'-')}-to-${t.toLowerCase().replace(/ /g,'-')}?fromCityName=${encodeURIComponent(f)}&toCityName=${encodeURIComponent(t)}&onward=${d}` },
    { name: 'AbhiBus', icon: '🚍', color: '#2b6cb0', getUrl: (f, t, d) => `https://www.abhibus.com/bus_search/${encodeURIComponent(f)}/${encodeURIComponent(t)}/${d}/S` },
    { name: 'MakeMyTrip Bus', icon: '🛣️', color: '#e53e3e', getUrl: (f, t, d) => `https://www.makemytrip.com/bus-tickets/${f.toLowerCase().replace(/ /g,'-')}-to-${t.toLowerCase().replace(/ /g,'-')}/` },
    { name: 'Paytm Travel', icon: '💳', color: '#00b9f1', getUrl: (f, t, d) => `https://travel.paytm.com/bus/${f.toLowerCase().replace(/ /g,'-')}-to-${t.toLowerCase().replace(/ /g,'-')}` },
  ],
};

const Transport = () => {
  const [activeTab, setActiveTab] = useState('flight');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [passengers, setPassengers] = useState('1');
  const [searched, setSearched] = useState(false);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const handleSearch = () => {
    if (!from.trim() || !to.trim()) return;
    setSearched(true);
  };

  const handleRedirect = (site) => {
    const travelDate = date || minDate;
    const url = site.getUrl(from, to, travelDate, passengers);
    window.open(url, '_blank');
  };

  const setRoute = (route) => {
    setFrom(route.from);
    setTo(route.to);
    setSearched(false);
  };

  const sites = BOOKING_SITES[activeTab];

  return (
    <section className="transport-section" id="transport">
      <div className="section-label">Book Transport</div>
      <h2 className="section-title">Flights, Trains & Buses ✈️</h2>
      <p className="section-sub">Fill your details — we'll take you directly to the best booking sites</p>

      {/* Tabs */}
      <div className="transport-tabs">
        {[{ id: 'flight', label: 'Flights', icon: '✈️' }, { id: 'train', label: 'Trains', icon: '🚄' }, { id: 'bus', label: 'Buses', icon: '🚌' }].map(tab => (
          <button key={tab.id} className={`transport-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => { setActiveTab(tab.id); setSearched(false); }}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Search Form */}
      <div className="transport-search">
        <div className="t-field">
          <label>From</label>
          <input value={from} onChange={e => setFrom(e.target.value)} placeholder="Delhi, Mumbai..." />
        </div>
        <button className="t-swap-btn" onClick={() => { const tmp = from; setFrom(to); setTo(tmp); }}>⇄</button>
        <div className="t-field">
          <label>To</label>
          <input value={to} onChange={e => setTo(e.target.value)} placeholder="Goa, Bangalore..." />
        </div>
        <div className="t-field">
          <label>Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} min={minDate} />
        </div>
        {activeTab === 'flight' && (
          <div className="t-field">
            <label>Passengers</label>
            <select value={passengers} onChange={e => setPassengers(e.target.value)}>
              {['1','2','3','4','5','6'].map(n => <option key={n} value={n}>{n} {n === '1' ? 'Adult' : 'Adults'}</option>)}
            </select>
          </div>
        )}
        <button className="t-search-btn" onClick={handleSearch}>
          🔍 Find Options
        </button>
      </div>

      {/* Popular Routes */}
      {!searched && (
        <div className="popular-routes">
          <p className="popular-label">Popular Routes:</p>
          <div className="routes-list">
            {POPULAR_ROUTES.map((r, i) => (
              <button key={i} className="route-chip" onClick={() => setRoute(r)}>
                {r.from} → {r.to}
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
              {activeTab === 'flight' ? '✈️' : activeTab === 'train' ? '🚄' : '🚌'} {from} → {to}
              {date && <span className="booking-date"> · {new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>}
            </h3>
            <p>Click any site to search & book directly</p>
          </div>

          <div className="booking-sites-grid">
            {sites.map((site, i) => (
              <button key={i} className="booking-site-card" onClick={() => handleRedirect(site)}>
                <div className="site-icon" style={{ background: site.color + '20', border: `1px solid ${site.color}40` }}>
                  {site.icon}
                </div>
                <div className="site-info">
                  <div className="site-name">{site.name}</div>
                  <div className="site-action">Search & Book →</div>
                </div>
                <div className="site-arrow">↗</div>
              </button>
            ))}
          </div>

          <div className="booking-note">
            🔒 You'll be redirected to the official booking site. Prices & availability shown there.
          </div>

          <button className="modify-search-btn" onClick={() => setSearched(false)}>
            ← Modify Search
          </button>
        </div>
      )}
    </section>
  );
};

export default Transport;
