import React, { useState, useEffect, useMemo } from 'react';
import { searchHotels } from '../services/bookingService';
import './HotelBooking.css';

const STAR_FILTERS = ['All', '5 Star', '4 Star', '3 Star', 'Budget'];
const AMENITY_FILTERS = ['Pool', 'Spa', 'WiFi', 'Restaurant', 'Gym'];

const HotelBooking = () => {
  const [searchCity, setSearchCity] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');
  const [starFilter, setStarFilter] = useState('All');
  const [amenityFilter, setAmenityFilter] = useState('');
  const [budgetFilter, setBudgetFilter] = useState('All');
  const [wishlist, setWishlist] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Load default hotels on mount
  useEffect(() => {
    loadHotels('India');
  }, []);

  const loadHotels = async (city) => {
    setLoading(true);
    try {
      const data = await searchHotels(city, checkIn, checkOut, parseInt(guests));
      setHotels(data);
    } catch {
      setHotels([]);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  const handleSearch = () => {
    if (!searchCity.trim()) return;
    loadHotels(searchCity);
  };

  const filtered = useMemo(() => {
    return hotels.filter(h => {
      if (starFilter === '5 Star' && h.stars !== 5) return false;
      if (starFilter === '4 Star' && h.stars !== 4) return false;
      if (starFilter === '3 Star' && h.stars !== 3) return false;
      if (starFilter === 'Budget' && h.stars > 2) return false;
      if (amenityFilter && !h.amenities?.includes(amenityFilter)) return false;
      if (budgetFilter === 'Under ₹2k' && h.price >= 2000) return false;
      if (budgetFilter === '₹2k-₹8k' && (h.price < 2000 || h.price > 8000)) return false;
      if (budgetFilter === '₹8k+' && h.price < 8000) return false;
      return true;
    });
  }, [hotels, starFilter, amenityFilter, budgetFilter]);

  const toggleWishlist = (id) => setWishlist(w => w.includes(id) ? w.filter(x => x !== id) : [...w, id]);

  const handleBook = (hotel) => {
    const url = hotel.bookingUrl ||
      `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(hotel.name + ' ' + hotel.city)}&checkin=${checkIn}&checkout=${checkOut}&group_adults=${guests}`;
    window.open(url, '_blank');
  };

  const fmt = (n) => `₹${n.toLocaleString('en-IN')}`;
  const stars = (n) => '★'.repeat(Math.min(n, 5)) + '☆'.repeat(Math.max(0, 5 - n));

  return (
    <section className="hotels-section" id="hotels">
      <div className="section-label">Stay & Relax</div>
      <h2 className="section-title">Hotel Booking</h2>
      <p className="section-sub">Real hotels — search, compare & book directly</p>

      <div className="hotel-search-bar">
        <div className="h-field">
          <label>🏙️ City / Hotel</label>
          <input value={searchCity} onChange={e => setSearchCity(e.target.value)}
            placeholder="Delhi, Goa, Manali..." onKeyDown={e => e.key === 'Enter' && handleSearch()} />
        </div>
        <div className="h-field">
          <label>📅 Check-in</label>
          <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} min={new Date().toISOString().split('T')[0]} />
        </div>
        <div className="h-field">
          <label>📅 Check-out</label>
          <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} min={checkIn || new Date().toISOString().split('T')[0]} />
        </div>
        <div className="h-field">
          <label>👥 Guests</label>
          <select value={guests} onChange={e => setGuests(e.target.value)}>
            {['1','2','3','4','5+'].map(g => <option key={g}>{g} Guest{g !== '1' ? 's' : ''}</option>)}
          </select>
        </div>
        <button className="h-search-btn" onClick={handleSearch} disabled={loading}>
          {loading ? '⏳ Searching...' : '🔍 Search Hotels'}
        </button>
      </div>

      <div className="hotel-filters">
        <span className="filter-label">Stars:</span>
        {STAR_FILTERS.map(f => (
          <button key={f} className={`filter-chip ${starFilter === f ? 'active' : ''}`} onClick={() => setStarFilter(f)}>{f}</button>
        ))}
        <span className="filter-label" style={{marginLeft:8}}>Budget:</span>
        {['All','Under ₹2k','₹2k-₹8k','₹8k+'].map(f => (
          <button key={f} className={`filter-chip ${budgetFilter === f ? 'active' : ''}`} onClick={() => setBudgetFilter(f)}>{f}</button>
        ))}
        <span className="filter-label" style={{marginLeft:8}}>Amenity:</span>
        {AMENITY_FILTERS.map(f => (
          <button key={f} className={`filter-chip ${amenityFilter === f ? 'active' : ''}`} onClick={() => setAmenityFilter(amenityFilter === f ? '' : f)}>{f}</button>
        ))}
      </div>

      {loading && (
        <div style={{textAlign:'center',padding:'40px',color:'rgba(255,255,255,0.5)'}}>
          <div style={{fontSize:'2rem',marginBottom:8}}>🏨</div>
          Searching hotels...
        </div>
      )}

      {!loading && filtered.length === 0 && searched && (
        <div className="no-hotels">No hotels found. Try different filters or city.</div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="hotels-grid">
          {filtered.map(hotel => (
            <div key={hotel.id} className="hotel-card">
              <div className="hotel-img-wrap">
                <img src={hotel.img} alt={hotel.name}
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=200&fit=crop'; }} />
                {hotel.badge && <span className="hotel-badge">{hotel.badge}</span>}
                <button className="hotel-wishlist" onClick={() => toggleWishlist(hotel.id)}>
                  {wishlist.includes(hotel.id) ? '❤️' : '🤍'}
                </button>
              </div>
              <div className="hotel-info">
                <div className="hotel-name">{hotel.name}</div>
                <div className="hotel-location">📍 {hotel.location}</div>
                <div className="hotel-stars">{stars(hotel.stars)} {hotel.stars}-Star</div>
                <div className="hotel-amenities">
                  {hotel.amenities?.slice(0, 4).map(a => <span key={a} className="amenity-tag">{a}</span>)}
                </div>
                <div className="hotel-footer">
                  <div className="hotel-price">
                    <div className="amount">{fmt(hotel.price)}</div>
                    <div className="per">per night</div>
                  </div>
                  <div className="hotel-rating">
                    <span className="rating-score">{hotel.rating}</span>
                    <span className="rating-count">{hotel.reviews?.toLocaleString()} reviews</span>
                  </div>
                </div>
                <button className="book-hotel-btn" onClick={() => handleBook(hotel)}>
                  Book on {hotel.realBooking ? 'Booking.com' : 'MakeMyTrip'} →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default HotelBooking;
