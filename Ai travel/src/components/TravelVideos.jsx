import React, { useState } from 'react';

const DEST_VIDEOS = {
  goa: [
    { id: 'kVMDKMZ_QoU', title: 'Goa Travel Guide 2024', channel: 'Travel Vlogs India' },
    { id: 'YQzmHXnBMhA', title: 'Goa on Budget ₹10,000', channel: 'Budget Traveller' },
  ],
  manali: [
    { id: 'Wd_YDKF0Ixo', title: 'Manali Complete Guide', channel: 'Himachal Explorer' },
    { id: 'xvFZjo5PgG0', title: 'Manali in Winter', channel: 'Snow Travel' },
  ],
  bali: [
    { id: 'dQw4w9WgXcQ', title: 'Bali Travel Guide for Indians', channel: 'World Traveller' },
    { id: 'xvFZjo5PgG0', title: 'Bali Budget Trip', channel: 'Budget Travel Asia' },
  ],
  default: [
    { id: 'kVMDKMZ_QoU', title: 'India Travel Guide 2024', channel: 'Incredible India' },
    { id: 'YQzmHXnBMhA', title: 'Top 10 Places in India', channel: 'Travel India' },
  ],
};

const POPULAR_SEARCHES = ['Goa', 'Manali', 'Bali', 'Thailand', 'Dubai', 'Jaipur', 'Kerala', 'Ladakh'];

const TravelVideos = ({ destination }) => {
  const [search, setSearch] = useState(destination || '');
  const [activeVideo, setActiveVideo] = useState(null);

  const getVideos = (dest) => {
    if (!dest) return DEST_VIDEOS.default;
    const key = dest.toLowerCase().split(',')[0].trim();
    for (const [k, v] of Object.entries(DEST_VIDEOS)) {
      if (k !== 'default' && key.includes(k)) return v;
    }
    return DEST_VIDEOS.default;
  };

  const videos = getVideos(search);
  const ytSearchUrl = (dest) => `https://www.youtube.com/results?search_query=${encodeURIComponent(dest + ' travel guide india')}`;

  return (
    <section style={{ padding: '80px 6vw' }} id="videos">
      <div className="section-label">Watch & Explore</div>
      <h2 className="section-title">Travel Videos 🎬</h2>
      <p className="section-sub">Watch travel vlogs before you go — get inspired and informed</p>

      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search destination videos..."
            style={{ flex: 1, padding: '10px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(225,29,72,0.2)', borderRadius: 10, color: 'white', fontFamily: 'DM Sans', fontSize: '0.9rem' }} />
          <a href={ytSearchUrl(search || 'India travel')} target="_blank" rel="noopener noreferrer"
            style={{ padding: '10px 18px', background: '#ff0000', border: 'none', borderRadius: 10, color: 'white', fontFamily: 'DM Sans', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
            ▶ YouTube
          </a>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
          {POPULAR_SEARCHES.map(d => (
            <button key={d} onClick={() => setSearch(d)}
              style={{ padding: '5px 12px', borderRadius: 20, border: `1px solid ${search === d ? '#f43f5e' : 'rgba(225,29,72,0.2)'}`, background: search === d ? 'rgba(244,63,94,0.15)' : 'transparent', color: search === d ? '#f43f5e' : 'rgba(255,255,255,0.5)', fontSize: '0.78rem', cursor: 'pointer', fontFamily: 'DM Sans' }}>
              {d}
            </button>
          ))}
        </div>

        {activeVideo ? (
          <div style={{ marginBottom: 20 }}>
            <div style={{ position: 'relative', paddingBottom: '56.25%', borderRadius: 16, overflow: 'hidden' }}>
              <iframe src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`} title="Travel Video"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            </div>
            <button onClick={() => setActiveVideo(null)} style={{ marginTop: 10, padding: '7px 16px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'rgba(255,255,255,0.6)', fontFamily: 'DM Sans', cursor: 'pointer', fontSize: '0.82rem' }}>✕ Close Video</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
            {videos.map(v => (
              <div key={v.id} onClick={() => setActiveVideo(v.id)} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(225,29,72,0.12)', borderRadius: 14, overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                <div style={{ position: 'relative' }}>
                  <img src={`https://img.youtube.com/vi/${v.id}/mqdefault.jpg`} alt={v.title} style={{ width: '100%', height: 160, objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 50, height: 50, background: 'rgba(255,0,0,0.9)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>▶</div>
                  </div>
                </div>
                <div style={{ padding: '12px 14px' }}>
                  <div style={{ color: 'white', fontWeight: 600, fontSize: '0.88rem', marginBottom: 4 }}>{v.title}</div>
                  <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.75rem' }}>{v.channel}</div>
                </div>
              </div>
            ))}
            <a href={ytSearchUrl(search || 'India travel')} target="_blank" rel="noopener noreferrer"
              style={{ background: 'rgba(255,0,0,0.06)', border: '1px dashed rgba(255,0,0,0.3)', borderRadius: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textDecoration: 'none', gap: 8 }}>
              <div style={{ fontSize: '2rem' }}>▶</div>
              <div style={{ color: '#ff6b6b', fontWeight: 700, fontSize: '0.88rem' }}>More Videos on YouTube</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>Search "{search || 'travel'}" →</div>
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default TravelVideos;
