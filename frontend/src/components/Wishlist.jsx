import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';
import './ExtraFeatures.css';

const DEFAULT_WISHLIST = [
  { id:1, name:'Santorini', country:'Greece', img:'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=300&h=150&fit=crop' },
  { id:2, name:'Maldives', country:'Maldives', img:'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=300&h=150&fit=crop' },
  { id:3, name:'Kyoto', country:'Japan', img:'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=300&h=150&fit=crop' },
];

const SUGGESTIONS = [
  { id:4, name:'Patagonia', country:'Argentina', img:'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=300&h=150&fit=crop' },
  { id:5, name:'Iceland', country:'Iceland', img:'https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=300&h=150&fit=crop' },
  { id:6, name:'Machu Picchu', country:'Peru', img:'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=300&h=150&fit=crop' },
  { id:7, name:'Amalfi Coast', country:'Italy', img:'https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?w=300&h=150&fit=crop' },
  { id:8, name:'Bora Bora', country:'French Polynesia', img:'https://images.unsplash.com/photo-1589197331516-4d84b72ebde3?w=300&h=150&fit=crop' },
];

const Wishlist = () => {
  const toast = useToast();
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('travel_wishlist');
      return saved ? JSON.parse(saved) : DEFAULT_WISHLIST;
    } catch { return DEFAULT_WISHLIST; }
  });

  const save = (list) => {
    setWishlist(list);
    try { localStorage.setItem('travel_wishlist', JSON.stringify(list)); } catch {}
  };

  const remove = (id) => { save(wishlist.filter(x => x.id !== id)); toast('Removed from wishlist', 'info'); };
  const add = (dest) => {
    if (!wishlist.find(w => w.id === dest.id)) { save([...wishlist, dest]); toast(`${dest.name} added to wishlist! ❤️`, 'success'); }
  };

  return (
    <section className="wishlist-section" id="wishlist">
      <div className="section-label">Dream Trips</div>
      <h2 className="section-title">My Bucket List ❤️</h2>
      <p className="section-sub">Save destinations you want to visit someday</p>

      {wishlist.length === 0 ? (
        <div className="wishlist-empty">
          <div style={{fontSize:'3rem',marginBottom:12}}>🗺️</div>
          <p>Your bucket list is empty. Add some dream destinations!</p>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map(dest => (
            <div key={dest.id} className="wishlist-card">
              <img src={dest.img} alt={dest.name} onError={e => { e.target.src='https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=300&h=150&fit=crop'; }} />
              <div className="wishlist-card-info">
                <div className="wishlist-card-name">{dest.name}</div>
                <div className="wishlist-card-country">{dest.country}</div>
              </div>
              <button className="wishlist-remove" onClick={() => remove(dest.id)}>✕</button>
            </div>
          ))}
        </div>
      )}

      <div style={{marginTop:32}}>
        <h3 style={{fontSize:'1rem',fontWeight:700,color:'rgba(255,255,255,0.7)',marginBottom:16}}>✨ Suggested Destinations</h3>
        <div className="wishlist-grid">
          {SUGGESTIONS.filter(s => !wishlist.find(w => w.id === s.id)).map(dest => (
            <div key={dest.id} className="wishlist-add-btn" onClick={() => add(dest)}>
              <img src={dest.img} alt={dest.name} style={{width:'100%',height:80,objectFit:'cover',borderRadius:8,marginBottom:8}} onError={e => { e.target.style.display='none'; }} />
              <div style={{fontWeight:700,color:'rgba(255,255,255,0.8)',fontSize:'0.85rem'}}>{dest.name}</div>
              <div style={{fontSize:'0.75rem',color:'var(--rose)'}}>{dest.country}</div>
              <div style={{fontSize:'0.75rem',marginTop:4}}>+ Add to Wishlist</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Wishlist;
