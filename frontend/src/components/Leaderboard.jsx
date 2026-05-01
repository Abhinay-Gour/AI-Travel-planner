import React, { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const TIER_COLORS = { Legend: '#f59e0b', Expert: '#a78bfa', Pro: '#f43f5e', Explorer: '#10b981', Traveler: '#60a5fa' };
const TIER_BADGES = { Legend: '🏆', Expert: '🥈', Pro: '🥉', Explorer: '⭐', Traveler: '✨' };

const getTier = (trips) => {
  if (trips >= 30) return 'Legend';
  if (trips >= 15) return 'Expert';
  if (trips >= 8)  return 'Pro';
  if (trips >= 3)  return 'Explorer';
  return 'Traveler';
};

const getPoints = (trips) => trips * 250 + Math.floor(Math.random() * 100);

const BADGES_LIST = [
  { icon: '🗺️', name: 'First Trip',    desc: 'Plan your first trip',     key: 'firstTrip' },
  { icon: '✈️', name: 'Jet Setter',    desc: 'Plan 5 trips',             key: 'jetSetter' },
  { icon: '🌍', name: 'Globe Trotter', desc: 'Visit 10 destinations',    key: 'globeTrotter' },
  { icon: '🏔️', name: 'Adventurer',   desc: 'Plan a mountain trip',     key: 'adventurer' },
  { icon: '🏖️', name: 'Beach Bum',    desc: 'Plan 3 beach trips',       key: 'beachBum' },
  { icon: '💰', name: 'Budget Master', desc: 'Use budget optimizer',     key: 'budgetMaster' },
  { icon: '📱', name: 'Social Sharer', desc: 'Share a trip story',       key: 'socialSharer' },
  { icon: '🤖', name: 'AI Lover',      desc: 'Generate 10 AI trips',     key: 'aiLover' },
];

const Leaderboard = () => {
  const [tab, setTab] = useState('leaderboard');
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myStats, setMyStats] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('aiTravelToken');

    // Fetch top travelers
    fetch(`${API_URL}/users/leaderboard`)
      .then(r => r.json())
      .then(d => {
        if (d.success && d.data?.length) {
          setLeaders(d.data.map((u, i) => ({
            rank: i + 1,
            name: u.name,
            trips: u.stats?.tripsPlanned || 0,
            destinations: u.stats?.countriesVisited?.length || 0,
            tier: getTier(u.stats?.tripsPlanned || 0),
            points: getPoints(u.stats?.tripsPlanned || 0),
            avatar: ['👨', '👩', '🧑', '👨‍💼', '👩‍💼'][i % 5],
          })));
        } else {
          // Fallback placeholder
          setLeaders([
            { rank: 1, name: 'Rahul S.',  trips: 12, destinations: 8,  tier: 'Expert',   points: 3200, avatar: '👨' },
            { rank: 2, name: 'Priya M.',  trips: 9,  destinations: 6,  tier: 'Pro',      points: 2400, avatar: '👩' },
            { rank: 3, name: 'Amit K.',   trips: 6,  destinations: 4,  tier: 'Explorer', points: 1600, avatar: '🧑' },
            { rank: 4, name: 'Sneha R.',  trips: 4,  destinations: 3,  tier: 'Explorer', points: 1100, avatar: '👩' },
            { rank: 5, name: 'Vikram T.', trips: 2,  destinations: 2,  tier: 'Traveler', points: 550,  avatar: '👨' },
          ]);
        }
        setLoading(false);
      })
      .catch(() => { setLoading(false); });

    // Fetch my stats if logged in
    if (token) {
      fetch(`${API_URL}/trips/stats/overview`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(r => r.json())
        .then(d => { if (d.success) setMyStats(d.data); })
        .catch(() => {});
    }
  }, []);

  const myTrips = myStats?.totalTrips || 0;
  const myTier = getTier(myTrips);
  const myPoints = getPoints(myTrips);
  const myBadges = BADGES_LIST.map(b => ({
    ...b,
    earned: (b.key === 'firstTrip' && myTrips >= 1) ||
            (b.key === 'jetSetter' && myTrips >= 5) ||
            (b.key === 'aiLover' && myTrips >= 10) ||
            (b.key === 'globeTrotter' && myTrips >= 10) ||
            (b.key === 'budgetMaster' && myTrips >= 2),
  }));

  return (
    <section style={{ padding: '80px 6vw' }} id="leaderboard">
      <div className="section-label">Community</div>
      <h2 className="section-title">Leaderboard & Badges 🏆</h2>
      <p className="section-sub">Earn points by planning trips — compete with fellow travelers</p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
        {['leaderboard', 'badges'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '9px 22px', borderRadius: 20,
            border: `1px solid ${tab === t ? '#f43f5e' : 'rgba(225,29,72,0.2)'}`,
            background: tab === t ? 'rgba(244,63,94,0.15)' : 'transparent',
            color: tab === t ? '#f43f5e' : 'rgba(255,255,255,0.6)',
            fontFamily: 'DM Sans', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
          }}>
            {t === 'leaderboard' ? '🏆 Leaderboard' : '🎖️ My Badges'}
          </button>
        ))}
      </div>

      {tab === 'leaderboard' && (
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 40, color: 'rgba(255,255,255,0.4)' }}>⏳ Loading leaderboard...</div>
          ) : (
            <>
              {leaders.map((u, i) => (
                <div key={u.rank} style={{
                  display: 'flex', alignItems: 'center', gap: 16,
                  padding: '14px 20px',
                  background: i < 3 ? 'rgba(244,63,94,0.06)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${i < 3 ? 'rgba(244,63,94,0.2)' : 'rgba(255,255,255,0.06)'}`,
                  borderRadius: 14, marginBottom: 10, transition: 'transform 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateX(4px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0)'}>
                  <div style={{ fontSize: '1.5rem', width: 36, textAlign: 'center' }}>{TIER_BADGES[u.tier]}</div>
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

              {myStats && (
                <div style={{ marginTop: 16, padding: '16px 20px', background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.25)', borderRadius: 14 }}>
                  <div style={{ color: '#f43f5e', fontWeight: 700, fontSize: '0.85rem', marginBottom: 6 }}>📍 Your Position</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ color: 'white', fontWeight: 600 }}>You</div>
                      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>{myTrips} trips planned</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: TIER_COLORS[myTier], fontWeight: 700, fontSize: '0.8rem' }}>{myTier}</div>
                      <div style={{ color: '#f43f5e', fontWeight: 800 }}>{myPoints.toLocaleString()} pts</div>
                    </div>
                  </div>
                </div>
              )}

              <div style={{ textAlign: 'center', marginTop: 16, padding: 16, background: 'rgba(244,63,94,0.05)', border: '1px dashed rgba(244,63,94,0.2)', borderRadius: 12 }}>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>Plan trips to earn points and climb the leaderboard! 🚀</div>
              </div>
            </>
          )}
        </div>
      )}

      {tab === 'badges' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 16, maxWidth: 800, margin: '0 auto' }}>
          {myBadges.map((b, i) => (
            <div key={i} style={{
              background: b.earned ? 'rgba(244,63,94,0.08)' : 'rgba(255,255,255,0.02)',
              border: `1px solid ${b.earned ? 'rgba(244,63,94,0.25)' : 'rgba(255,255,255,0.06)'}`,
              borderRadius: 16, padding: '20px 16px', textAlign: 'center',
              opacity: b.earned ? 1 : 0.5, transition: 'transform 0.2s',
            }}
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
