import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthModal } from '../context/AuthModalContext';
import { useUser } from '../context/UserContext';

const DESTINATIONS = [
  { id:1, name:'Goa', country:'India', img:'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&h=250&fit=crop', tags:['Beach','Party','Food'], budget:'₹15k-25k', days:'4-6', rating:4.7, reviews:2840, best:'Oct-Mar', vibe:'Party' },
  { id:2, name:'Manali', country:'India', img:'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=400&h=250&fit=crop', tags:['Mountains','Adventure','Snow'], budget:'₹20k-35k', days:'6-8', rating:4.8, reviews:1920, best:'May-Jun', vibe:'Adventure' },
  { id:3, name:'Jaipur', country:'India', img:'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400&h=250&fit=crop', tags:['History','Culture','Shopping'], budget:'₹10k-20k', days:'3-4', rating:4.6, reviews:3100, best:'Oct-Mar', vibe:'Culture' },
  { id:4, name:'Kerala', country:'India', img:'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&h=250&fit=crop', tags:['Nature','Backwaters','Relaxation'], budget:'₹18k-30k', days:'5-7', rating:4.9, reviews:2200, best:'Sep-Mar', vibe:'Relaxation' },
  { id:5, name:'Varanasi', country:'India', img:'https://images.unsplash.com/photo-1561361058-c24e01238a46?w=400&h=250&fit=crop', tags:['Spiritual','Culture','History'], budget:'₹8k-15k', days:'3-4', rating:4.5, reviews:1800, best:'Oct-Mar', vibe:'Spiritual' },
  { id:6, name:'Andaman', country:'India', img:'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&h=250&fit=crop', tags:['Beach','Diving','Nature'], budget:'₹25k-40k', days:'5-7', rating:4.9, reviews:1500, best:'Oct-May', vibe:'Beach' },
  { id:7, name:'Rishikesh', country:'India', img:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop', tags:['Adventure','Spiritual','Yoga'], budget:'₹8k-15k', days:'3-5', rating:4.7, reviews:2400, best:'Sep-Jun', vibe:'Adventure' },
  { id:8, name:'Agra', country:'India', img:'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&h=250&fit=crop', tags:['History','Culture'], budget:'₹8k-15k', days:'2-3', rating:4.6, reviews:4200, best:'Oct-Mar', vibe:'Culture' },
  { id:9, name:'Bali', country:'Indonesia', img:'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=250&fit=crop', tags:['Beach','Culture','Food'], budget:'₹40k-70k', days:'7-10', rating:4.8, reviews:5600, best:'Apr-Oct', vibe:'Beach' },
  { id:10, name:'Bangkok', country:'Thailand', img:'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=400&h=250&fit=crop', tags:['Food','Culture','Shopping'], budget:'₹35k-55k', days:'5-7', rating:4.6, reviews:4800, best:'Nov-Mar', vibe:'Food' },
  { id:11, name:'Paris', country:'France', img:'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=250&fit=crop', tags:['Romance','Art','Food'], budget:'₹1.5L-2.5L', days:'6-8', rating:4.8, reviews:8900, best:'Apr-Jun', vibe:'Romance' },
  { id:12, name:'Tokyo', country:'Japan', img:'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=250&fit=crop', tags:['Culture','Food','Tech'], budget:'₹1.2L-2L', days:'8-12', rating:4.9, reviews:7200, best:'Mar-May', vibe:'Culture' },
  { id:13, name:'Dubai', country:'UAE', img:'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=250&fit=crop', tags:['Luxury','Shopping','Desert'], budget:'₹80k-1.5L', days:'5-7', rating:4.7, reviews:6100, best:'Oct-Apr', vibe:'Luxury' },
  { id:14, name:'Singapore', country:'Singapore', img:'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&h=250&fit=crop', tags:['Modern','Food','Shopping'], budget:'₹70k-1.2L', days:'4-6', rating:4.7, reviews:5400, best:'Feb-Apr', vibe:'Modern' },
  { id:15, name:'Maldives', country:'Maldives', img:'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&h=250&fit=crop', tags:['Luxury','Beach','Romance'], budget:'₹1.5L-3L', days:'5-7', rating:4.9, reviews:3200, best:'Nov-Apr', vibe:'Luxury' },
  { id:16, name:'Kyoto', country:'Japan', img:'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=250&fit=crop', tags:['Culture','History','Nature'], budget:'₹1L-1.8L', days:'4-6', rating:4.9, reviews:4100, best:'Mar-May', vibe:'Culture' },
  { id:17, name:'Istanbul', country:'Turkey', img:'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=400&h=250&fit=crop', tags:['History','Food','Culture'], budget:'₹60k-1L', days:'5-7', rating:4.7, reviews:3800, best:'Apr-Jun', vibe:'Culture' },
  { id:18, name:'Barcelona', country:'Spain', img:'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400&h=250&fit=crop', tags:['Art','Beach','Food'], budget:'₹1.2L-2L', days:'5-7', rating:4.8, reviews:5200, best:'May-Jun', vibe:'Art' },
];

const VIBES = ['All', 'Beach', 'Adventure', 'Culture', 'Luxury', 'Romance', 'Food', 'Spiritual', 'Nature', 'Party'];
const BUDGETS = ['All', 'Under ₹20k', '₹20k-50k', '₹50k-1L', 'Above ₹1L'];
const COUNTRIES = ['All', 'India', 'International'];

const DestinationsExplorer = () => {
  const [vibe, setVibe] = useState('All');
  const [budget, setBudget] = useState('All');
  const [country, setCountry] = useState('All');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('rating');
  const { isAuthenticated } = useUser();
  const { openAuth } = useAuthModal();
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    return DESTINATIONS
      .filter(d => {
        if (search && !d.name.toLowerCase().includes(search.toLowerCase()) && !d.country.toLowerCase().includes(search.toLowerCase())) return false;
        if (vibe !== 'All' && !d.tags.includes(vibe) && d.vibe !== vibe) return false;
        if (country === 'India' && d.country !== 'India') return false;
        if (country === 'International' && d.country === 'India') return false;
        return true;
      })
      .sort((a, b) => sort === 'rating' ? b.rating - a.rating : b.reviews - a.reviews);
  }, [vibe, budget, country, search, sort]);

  const handlePlan = (dest) => {
    if (!isAuthenticated) { openAuth('login'); return; }
    window.dispatchEvent(new CustomEvent('selectDestination', { detail: `${dest.name}, ${dest.country}` }));
    navigate('/');
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
  };

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', padding: '100px 6vw 60px' }}>
      <div className="section-label">Explore</div>
      <h2 className="section-title">Destinations Explorer 🌍</h2>
      <p className="section-sub">Browse {DESTINATIONS.length}+ destinations — filter by vibe, budget & more</p>

      {/* Filters */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(225,29,72,0.12)', borderRadius: 16, padding: '20px', marginBottom: 28 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search destination or country..."
          style={{ width: '100%', padding: '10px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(225,29,72,0.2)', borderRadius: 10, color: 'white', fontFamily: 'DM Sans', fontSize: '0.9rem', marginBottom: 16, boxSizing: 'border-box' }} />

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', alignSelf: 'center' }}>Vibe:</span>
          {VIBES.map(v => (
            <button key={v} onClick={() => setVibe(v)}
              style={{ padding: '5px 12px', borderRadius: 20, border: `1px solid ${vibe === v ? '#f43f5e' : 'rgba(225,29,72,0.2)'}`, background: vibe === v ? 'rgba(244,63,94,0.15)' : 'transparent', color: vibe === v ? '#f43f5e' : 'rgba(255,255,255,0.6)', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans' }}>
              {v}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', alignSelf: 'center' }}>Country:</span>
            {COUNTRIES.map(c => (
              <button key={c} onClick={() => setCountry(c)}
                style={{ padding: '5px 12px', borderRadius: 20, border: `1px solid ${country === c ? '#f43f5e' : 'rgba(225,29,72,0.2)'}`, background: country === c ? 'rgba(244,63,94,0.15)' : 'transparent', color: country === c ? '#f43f5e' : 'rgba(255,255,255,0.6)', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans' }}>
                {c}
              </button>
            ))}
          </div>
          <select value={sort} onChange={e => setSort(e.target.value)}
            style={{ marginLeft: 'auto', padding: '6px 12px', background: '#1f1014', border: '1px solid rgba(225,29,72,0.2)', borderRadius: 8, color: 'white', fontFamily: 'DM Sans', fontSize: '0.8rem' }}>
            <option value="rating">⭐ Top Rated</option>
            <option value="reviews">💬 Most Reviewed</option>
          </select>
        </div>
      </div>

      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', marginBottom: 16 }}>{filtered.length} destinations found</div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 20 }}>
        {filtered.map(dest => (
          <div key={dest.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(225,29,72,0.12)', borderRadius: 18, overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(225,29,72,0.2)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
            <div style={{ position: 'relative', height: 180 }}>
              <img src={dest.img} alt={dest.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=250&fit=crop'; }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(transparent 40%,rgba(0,0,0,0.7))' }} />
              <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.6)', borderRadius: 20, padding: '3px 10px', color: '#f59e0b', fontSize: '0.78rem', fontWeight: 700 }}>⭐ {dest.rating}</div>
              <div style={{ position: 'absolute', bottom: 12, left: 12 }}>
                <div style={{ color: 'white', fontWeight: 800, fontSize: '1.2rem' }}>{dest.name}</div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem' }}>📍 {dest.country}</div>
              </div>
            </div>
            <div style={{ padding: '16px' }}>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                {dest.tags.map(t => <span key={t} style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', color: '#fda4af', fontSize: '0.68rem', padding: '2px 8px', borderRadius: 10 }}>{t}</span>)}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                {[['💰 Budget', dest.budget], ['📅 Days', dest.days], ['🗓️ Best Time', dest.best], ['💬 Reviews', dest.reviews.toLocaleString()]].map(([label, val]) => (
                  <div key={label} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '6px 10px' }}>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.68rem' }}>{label}</div>
                    <div style={{ color: 'white', fontSize: '0.8rem', fontWeight: 600 }}>{val}</div>
                  </div>
                ))}
              </div>
              <button onClick={() => handlePlan(dest)}
                style={{ width: '100%', padding: '10px', background: 'linear-gradient(135deg,#f43f5e,#9f1239)', border: 'none', borderRadius: 10, color: 'white', fontFamily: 'DM Sans', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer' }}>
                ✈️ Plan This Trip
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DestinationsExplorer;
