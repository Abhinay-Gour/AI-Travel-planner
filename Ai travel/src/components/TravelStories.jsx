import React, { useState, useEffect } from 'react';

const SAMPLE_STORIES = [
  { id: 1, user: 'Rahul S.', avatar: '👨', dest: 'Goa, India', days: 5, rating: 5, img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&h=250&fit=crop', story: 'Best trip ever! Baga beach at sunset was magical. Street food at Anjuna market was incredible. Highly recommend Oct-March.', tags: ['Beach', 'Food', 'Nightlife'], likes: 42, date: '2 days ago' },
  { id: 2, user: 'Priya M.', avatar: '👩', dest: 'Manali, India', days: 7, rating: 5, img: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=400&h=250&fit=crop', story: 'Rohtang Pass was breathtaking! Snow in June was unexpected. Solang Valley paragliding was the highlight. Must carry warm clothes!', tags: ['Mountains', 'Adventure', 'Snow'], likes: 38, date: '5 days ago' },
  { id: 3, user: 'Amit K.', avatar: '🧑', dest: 'Bali, Indonesia', days: 10, rating: 4, img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=250&fit=crop', story: 'Ubud rice terraces are stunning. Tanah Lot temple at sunset is a must. Food is amazing and cheap. Visa on arrival easy for Indians.', tags: ['Culture', 'Nature', 'International'], likes: 67, date: '1 week ago' },
  { id: 4, user: 'Sneha R.', avatar: '👩', dest: 'Jaipur, India', days: 3, rating: 5, img: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400&h=250&fit=crop', story: 'Pink City is gorgeous! Amber Fort elephant ride was unforgettable. Johari Bazaar shopping was amazing. Dal Baati Churma is a must try!', tags: ['History', 'Shopping', 'Food'], likes: 29, date: '2 weeks ago' },
  { id: 5, user: 'Vikram T.', avatar: '👨', dest: 'Tokyo, Japan', days: 12, rating: 5, img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=250&fit=crop', story: 'Tokyo is mind-blowing! Shibuya crossing at night, Senso-ji temple at dawn, ramen at midnight. Japan is expensive but worth every rupee!', tags: ['Culture', 'Food', 'International'], likes: 89, date: '3 weeks ago' },
  { id: 6, user: 'Ananya P.', avatar: '👩', dest: 'Kerala, India', days: 6, rating: 5, img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&h=250&fit=crop', story: 'Alleppey houseboat was a dream! Backwaters at sunrise, fresh fish curry, coconut trees everywhere. God\'s own country indeed!', tags: ['Nature', 'Relaxation', 'Food'], likes: 54, date: '1 month ago' },
];

const TravelStories = () => {
  const [stories, setStories] = useState(() => {
    try {
      const saved = localStorage.getItem('travel_stories');
      return saved ? [...JSON.parse(saved), ...SAMPLE_STORIES] : SAMPLE_STORIES;
    } catch { return SAMPLE_STORIES; }
  });
  const [showForm, setShowForm] = useState(false);
  const [liked, setLiked] = useState(() => {
    try { return JSON.parse(localStorage.getItem('liked_stories') || '[]'); } catch { return []; }
  });
  const [form, setForm] = useState({ dest: '', days: '', rating: 5, story: '', tags: '' });
  const [filter, setFilter] = useState('All');

  const FILTERS = ['All', 'Beach', 'Mountains', 'Culture', 'Food', 'International', 'Adventure'];

  const toggleLike = (id) => {
    const newLiked = liked.includes(id) ? liked.filter(l => l !== id) : [...liked, id];
    setLiked(newLiked);
    localStorage.setItem('liked_stories', JSON.stringify(newLiked));
    setStories(prev => prev.map(s => s.id === id ? { ...s, likes: s.likes + (liked.includes(id) ? -1 : 1) } : s));
  };

  const submitStory = () => {
    if (!form.dest || !form.story) return;
    const newStory = {
      id: Date.now(), user: 'You', avatar: '😊',
      dest: form.dest, days: parseInt(form.days) || 0,
      rating: form.rating, img: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=250&fit=crop',
      story: form.story, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      likes: 0, date: 'Just now'
    };
    const updated = [newStory, ...stories];
    setStories(updated);
    const userStories = updated.filter(s => s.user === 'You');
    localStorage.setItem('travel_stories', JSON.stringify(userStories));
    setForm({ dest: '', days: '', rating: 5, story: '', tags: '' });
    setShowForm(false);
  };

  const filtered = filter === 'All' ? stories : stories.filter(s => s.tags.includes(filter));

  return (
    <section style={{ padding: '80px 6vw' }} id="stories">
      <div className="section-label">Community</div>
      <h2 className="section-title">Travel Stories ✈️</h2>
      <p className="section-sub">Real experiences from real travelers — get inspired for your next trip</p>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: '6px 14px', borderRadius: 20, border: `1px solid ${filter === f ? '#f43f5e' : 'rgba(225,29,72,0.2)'}`, background: filter === f ? 'rgba(244,63,94,0.15)' : 'transparent', color: filter === f ? '#f43f5e' : 'rgba(255,255,255,0.6)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans' }}>
              {f}
            </button>
          ))}
        </div>
        <button onClick={() => setShowForm(s => !s)}
          style={{ padding: '10px 20px', background: 'linear-gradient(135deg,#f43f5e,#9f1239)', border: 'none', borderRadius: 20, color: 'white', fontFamily: 'DM Sans', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
          ✍️ Share Your Story
        </button>
      </div>

      {showForm && (
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(225,29,72,0.2)', borderRadius: 16, padding: 24, marginBottom: 28 }}>
          <h4 style={{ color: '#f43f5e', marginBottom: 16 }}>📝 Share Your Travel Experience</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 12, marginBottom: 12 }}>
            {[['Destination', 'dest', 'text', 'Goa, Manali, Paris...'], ['Days', 'days', 'number', '5'], ['Tags (comma separated)', 'tags', 'text', 'Beach, Food, Adventure']].map(([label, key, type, ph]) => (
              <div key={key}>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.78rem', display: 'block', marginBottom: 5 }}>{label}</label>
                <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={ph}
                  style={{ width: '100%', padding: '9px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(225,29,72,0.2)', borderRadius: 8, color: 'white', fontFamily: 'DM Sans', fontSize: '0.85rem', boxSizing: 'border-box' }} />
              </div>
            ))}
            <div>
              <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.78rem', display: 'block', marginBottom: 5 }}>Rating</label>
              <div style={{ display: 'flex', gap: 4 }}>
                {[1,2,3,4,5].map(n => (
                  <button key={n} onClick={() => setForm(f => ({ ...f, rating: n }))}
                    style={{ background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer', opacity: n <= form.rating ? 1 : 0.3 }}>⭐</button>
                ))}
              </div>
            </div>
          </div>
          <textarea value={form.story} onChange={e => setForm(f => ({ ...f, story: e.target.value }))} placeholder="Share your experience — what was amazing, what to avoid, tips for others..."
            rows={3} style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(225,29,72,0.2)', borderRadius: 10, color: 'white', fontFamily: 'DM Sans', fontSize: '0.85rem', resize: 'vertical', boxSizing: 'border-box', marginBottom: 12 }} />
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={submitStory} style={{ padding: '10px 24px', background: 'linear-gradient(135deg,#f43f5e,#9f1239)', border: 'none', borderRadius: 10, color: 'white', fontFamily: 'DM Sans', fontWeight: 700, cursor: 'pointer' }}>Post Story</button>
            <button onClick={() => setShowForm(false)} style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: 'rgba(255,255,255,0.7)', fontFamily: 'DM Sans', cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 20 }}>
        {filtered.map(s => (
          <div key={s.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(225,29,72,0.12)', borderRadius: 16, overflow: 'hidden', transition: 'transform 0.2s', cursor: 'default' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ position: 'relative', height: 160 }}>
              <img src={s.img} alt={s.dest} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=250&fit=crop'; }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(transparent,rgba(0,0,0,0.6))' }} />
              <div style={{ position: 'absolute', bottom: 12, left: 12 }}>
                <div style={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>{s.dest}</div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem' }}>{s.days} days · {'⭐'.repeat(s.rating)}</div>
              </div>
            </div>
            <div style={{ padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: '1.4rem' }}>{s.avatar}</span>
                <div>
                  <div style={{ color: 'white', fontWeight: 600, fontSize: '0.85rem' }}>{s.user}</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem' }}>{s.date}</div>
                </div>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.83rem', lineHeight: 1.5, marginBottom: 12 }}>{s.story}</p>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                {s.tags.map(t => <span key={t} style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', color: '#fda4af', fontSize: '0.7rem', padding: '2px 8px', borderRadius: 10 }}>{t}</span>)}
              </div>
              <button onClick={() => toggleLike(s.id)}
                style={{ background: 'none', border: 'none', color: liked.includes(s.id) ? '#f43f5e' : 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '0.82rem', fontFamily: 'DM Sans', display: 'flex', alignItems: 'center', gap: 4 }}>
                {liked.includes(s.id) ? '❤️' : '🤍'} {s.likes} likes
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TravelStories;
