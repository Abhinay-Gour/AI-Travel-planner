import React, { useState } from 'react';

const LEADERBOARD = [
  { rank: 1, name: 'Rahul Sharma', trips: 47, destinations: 23, badge: '🏆', tier: 'Legend', points: 12400, avatar: '👨' },
  { rank: 2, name: 'Priya Mehta', trips: 38, destinations: 19, badge: '🥈', tier: 'Expert', points: 9800, avatar: '👩' },
  { rank: 3, name: 'Amit Kumar', trips: 31, destinations: 15, badge: '🥉', tier: 'Expert', points: 7600, avatar: '🧑' },
  { rank: 4, name: 'Sneha Rao', trips: 24, destinations: 12, badge: '⭐', tier: 'Pro', points: 5200, avatar: '👩' },
  { rank: 5, name: 'Vikram Tiwari', trips: 18, destinations: 9, badge: '✨', tier: 'Pro', points: 3800, avatar: '👨' },
  { rank: 6, name: 'Ananya Patel', trips: 12, destinations: 7, badge: '🌟', tier: 'Explorer', points: 2400, avatar: '👩' },
  { rank: 7, name: 'Rohan Gupta', trips: 8, destinations: 5, badge: '🎯', tier: 'Explorer', points: 1600, avatar: '🧑' },
];

const BADGES = [
  { icon: '🗺️', name: 'First Trip', desc: 'Plan your first trip', earned: true },
  { icon: '✈️', name: 'Jet Setter', desc: 'Plan 5 trips', earned: true },
  { icon: '🌍', name: 'Globe Trotter', desc: 'Visit 10 destinations', earned: false },
  { icon: '🏔️', name: 'Adventurer', desc: 'Plan a mountain trip', earned: true },
  { icon: '🏖️', name: 'Beach Bum', desc: 'Plan 3 beach trips', earned: false },
  { icon: '💰', name: 'Budget Master', desc: 'Use budget optimizer', earned: true },
  { icon: '📱', name: 'Social Sharer', desc: 'Share a trip story', earned: false },
  { icon: '🤖', name: 'AI Lover', desc: 'Use AI chat 10 times', earned: true },
];

const TIER_COLORS = { Legend: '#f59e0b', Expert: '#a78bfa', Pro: '#f43f5e', Explorer: '#10b981' };

const Leaderboard = () => {
  const [tab, setTab] = useState('leaderboard');

  return (
    <section style={{ padding: '80px 6vw' }} id="leaderboard">
      <div className="section-label">Community</div>
      <h2 className="section-title">Leaderboard & Badges 🏆</h2>
      <p className="section-sub">Earn points, unlock badges, compete with fellow travelers</p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
        {['leaderboard', 'badges'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding: '9px 22px', borderRadius: 20, border: `1px solid ${tab === t ? '#f43f5e' : 'rgba(225,29,72,0.2)'}`, background: tab === t ? 'rgba(244,63,94,0.15)' : 'transparent', color: tab === t ? '#f43f5e' : 'rgba(255,255,255,0.6)', fontFamily: 'DM Sans', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', textTransform: 'capitalize' }}>
            {t === 'leaderboard' ? '🏆 Leaderboard' : '🎖️ My Badges'}
          </button>
        ))}
      </div>

      {tab === 'leaderboard' && (
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          {LEADERBOARD.map((u, i) => (
            <div key={u.rank} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px', background: i < 3 ? 'rgba(244,63,94,0.06)' : 'rgba(255,255,255,0.02)', border: `1px solid ${i < 3 ? 'rgba(244,63,94,0.2)' : 'rgba(255,255,255,0.06)'}`, borderRadius: 14, marginBottom: 10, transition: 'transform 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateX(4px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0)'}>
              <div style={{ fontSize: '1.5rem', width: 36, textAlign: 'center' }}>{u.badge}</div>
              <div style={{ fontSize: '1.8rem' }}>{u.avatar}</div>
              <div style={{ flex: 1 }}>
                <div style={{ color: 'white', fontWeight: 700, fontSize: '0.95rem' }}>{u.name}</div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>{u.trips} trips · {u.destinations} destinations</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: TIER_COLORS[u.tier], fontWeight: 700, fontSize: '0.8rem' }}>{u.tier}</div>
                <div style={{ color: '#f43f5e', fontWeight: 800, fontSize: '0.95rem' }}>{u.points.toLocaleString()} pts</div>
              </div>
            </div>
          ))}
          <div style={{ textAlign: 'center', marginTop: 20, padding: '16px', background: 'rgba(244,63,94,0.05)', border: '1px dashed rgba(244,63,94,0.2)', borderRadius: 12 }}>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>Plan trips to earn points and climb the leaderboard! 🚀</div>
          </div>
        </div>
      )}

      {tab === 'badges' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 16, maxWidth: 800, margin: '0 auto' }}>
          {BADGES.map((b, i) => (
            <div key={i} style={{ background: b.earned ? 'rgba(244,63,94,0.08)' : 'rgba(255,255,255,0.02)', border: `1px solid ${b.earned ? 'rgba(244,63,94,0.25)' : 'rgba(255,255,255,0.06)'}`, borderRadius: 16, padding: '20px 16px', textAlign: 'center', opacity: b.earned ? 1 : 0.5, transition: 'transform 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
              <div style={{ fontSize: '2.5rem', marginBottom: 8, filter: b.earned ? 'none' : 'grayscale(1)' }}>{b.icon}</div>
              <div style={{ color: b.earned ? 'white' : 'rgba(255,255,255,0.4)', fontWeight: 700, fontSize: '0.85rem', marginBottom: 4 }}>{b.name}</div>
              <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.72rem' }}>{b.desc}</div>
              {b.earned && <div style={{ marginTop: 8, color: '#10b981', fontSize: '0.72rem', fontWeight: 700 }}>✓ Earned</div>}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Leaderboard;
