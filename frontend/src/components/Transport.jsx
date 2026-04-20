import React, { useState } from 'react';
import { searchFlights, searchTrains, searchBuses } from '../services/bookingService';
import './Transport.css';

const Transport = () => {
  const [activeTab, setActiveTab] = useState('flight');
  const [from, setFrom] = useState('Delhi');
  const [to, setTo] = useState('Mumbai');
  const [date, setDate] = useState('');
  const [passengers, setPassengers] = useState('1');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!from.trim() || !to.trim()) return;
    setLoading(true);
    setSearched(true);
    setResults(null);

    try {
      let data;
      const travelDate = date || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];

      if (activeTab === 'flight') data = await searchFlights(from, to, travelDate, parseInt(passengers));
      else if (activeTab === 'train') data = await searchTrains(from, to, travelDate);
      else data = await searchBuses(from, to, travelDate);

      setResults(data);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = (item) => {
    if (item.bookingUrl) {
      window.open(item.bookingUrl, '_blank');
    }
  };

  const tabIcon = activeTab === 'flight' ? '✈️' : activeTab === 'train' ? '🚄' : '🚌';

  return (
    <section className="transport-section" id="transport">
      <div className="section-label">Book Transport</div>
      <h2 className="section-title">Flights, Trains & Buses</h2>
      <p className="section-sub">Real-time search — book directly from here</p>

      <div className="transport-tabs">
        {[{ id:'flight', label:'Flights', icon:'✈️' }, { id:'train', label:'Trains', icon:'🚄' }, { id:'bus', label:'Buses', icon:'🚌' }].map(tab => (
          <button key={tab.id} className={`transport-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => { setActiveTab(tab.id); setResults(null); setSearched(false); }}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="transport-search">
        <div className="t-field">
          <label>From</label>
          <input value={from} onChange={e => setFrom(e.target.value)} placeholder="Delhi, Mumbai..." />
        </div>
        <div className="t-field">
          <label>To</label>
          <input value={to} onChange={e => setTo(e.target.value)} placeholder="Goa, Bangalore..." />
        </div>
        <div className="t-field">
          <label>Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} min={new Date().toISOString().split('T')[0]} />
        </div>
        <div className="t-field">
          <label>Passengers</label>
          <select value={passengers} onChange={e => setPassengers(e.target.value)}>
            {['1','2','3','4','5','6'].map(n => <option key={n} value={n}>{n} {n==='1'?'Adult':'Adults'}</option>)}
          </select>
        </div>
        <button className="t-search-btn" onClick={handleSearch} disabled={loading}>
          {loading ? '⏳ Searching...' : '🔍 Search'}
        </button>
      </div>

      {loading && (
        <div style={{textAlign:'center',padding:'32px',color:'rgba(255,255,255,0.6)'}}>
          <div style={{fontSize:'2rem',marginBottom:8}}>⏳</div>
          Searching real-time {activeTab} options...
        </div>
      )}

      {!loading && searched && results?.length === 0 && (
        <div style={{textAlign:'center',padding:'32px',color:'rgba(255,255,255,0.5)'}}>
          No results found. Try different cities.
        </div>
      )}

      {!loading && results && results.length > 0 && (
        <div className="transport-results">
          {results.map((item, i) => (
            <div key={item.id || i} className={`transport-card ${item.best ? 'best-value' : ''}`}>
              <div className="carrier-logo">{item.emoji}</div>
              <div className="carrier-info">
                <div className="carrier-name">{item.carrierName || item.carrier}</div>
                <div className="carrier-class">{item.class} {item.trainNo ? `· #${item.trainNo}` : ''}</div>
                {item.best && <span className="best-badge">Best Value</span>}
                {item.realBooking && <span className="best-badge" style={{background:'#10b981',marginLeft:4}}>Live</span>}
              </div>
              <div className="route-info">
                <div className="route-time">
                  <div className="time">{item.time}</div>
                  <div className="city">{item.from || from}</div>
                </div>
                <div className="route-line">
                  <div className="route-duration">{item.duration}</div>
                  <div className="route-bar" />
                  <div className="route-stops">{item.stops}</div>
                </div>
                <div className="route-time">
                  <div className="time">{item.arr}</div>
                  <div className="city">{item.to || to}</div>
                </div>
              </div>
              <div className="transport-price">
                <div className="price-amount">₹{(item.price * parseInt(passengers)).toLocaleString('en-IN')}</div>
                <div className="price-per">{passengers > 1 ? `${passengers} passengers` : 'per person'}</div>
                <button className="book-btn" onClick={() => handleBook(item)}>
                  Book Now →
                </button>
              </div>
            </div>
          ))}
          <p className="transport-note">
            🔒 Clicking "Book Now" redirects to official booking site. Prices may vary.
          </p>
        </div>
      )}

      {!searched && (
        <div style={{textAlign:'center',padding:'24px',color:'rgba(255,255,255,0.35)',fontSize:'0.9rem'}}>
          Search flights, trains or buses between any Indian cities
        </div>
      )}
    </section>
  );
};

export default Transport;
