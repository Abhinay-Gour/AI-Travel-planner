import React, { useState, useEffect } from 'react';

// ── EMERGENCY CONTACTS ──
const EMERGENCY_DATA = {
  'India': { police:'100', ambulance:'108', fire:'101', tourist:'1800-11-1363', embassy:'N/A', notes:'IRCTC helpline: 139 | Air India: 1800-180-1407' },
  'USA': { police:'911', ambulance:'911', fire:'911', tourist:'1-800-USA-TRIP', embassy:'+1-202-588-6500 (Indian Embassy DC)', notes:'Indian Consulate NY: +1-212-774-0600' },
  'UK': { police:'999', ambulance:'999', fire:'999', tourist:'0845-600-6996', embassy:'+44-20-7836-8484 (Indian HC London)', notes:'NHS non-emergency: 111' },
  'UAE/Dubai': { police:'999', ambulance:'998', fire:'997', tourist:'800-DUBAI', embassy:'+971-4-397-1222 (Indian Consulate Dubai)', notes:'Tourist Police: 800-4673' },
  'Thailand': { police:'191', ambulance:'1669', fire:'199', tourist:'1155', embassy:'+66-2-258-0300 (Indian Embassy Bangkok)', notes:'Tourist Police: 1155 (English)' },
  'Bali/Indonesia': { police:'110', ambulance:'118', fire:'113', tourist:'1500-304', embassy:'+62-21-5204150 (Indian Embassy Jakarta)', notes:'Bali Tourism: +62-361-222387' },
  'Japan': { police:'110', ambulance:'119', fire:'119', tourist:'050-3816-2787', embassy:'+81-3-3262-2391 (Indian Embassy Tokyo)', notes:'Japan Helpline: 0570-000-911' },
  'Singapore': { police:'999', ambulance:'995', fire:'995', tourist:'1800-736-2000', embassy:'+65-6737-6777 (Indian HC Singapore)', notes:'Non-emergency police: 1800-255-0000' },
  'France/Paris': { police:'17', ambulance:'15', fire:'18', tourist:'3264', embassy:'+33-1-4050-7070 (Indian Embassy Paris)', notes:'European emergency: 112' },
};

export const EmergencyContacts = () => {
  const [selected, setSelected] = useState('India');
  const data = EMERGENCY_DATA[selected];

  return (
    <section style={{ padding: '80px 6vw' }} id="emergency">
      <div className="section-label">Safety First</div>
      <h2 className="section-title">Emergency Contacts 🆘</h2>
      <p className="section-sub">Important numbers for every destination — save before you travel</p>

      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <select value={selected} onChange={e => setSelected(e.target.value)}
          style={{ width: '100%', padding: '12px 16px', background: '#1f1014', border: '1px solid rgba(225,29,72,0.2)', borderRadius: 12, color: 'white', fontFamily: 'DM Sans', fontSize: '0.95rem', marginBottom: 20 }}>
          {Object.keys(EMERGENCY_DATA).map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        {data && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 12, marginBottom: 16 }}>
              {[['🚔 Police', data.police, '#ef4444'], ['🚑 Ambulance', data.ambulance, '#10b981'], ['🔥 Fire', data.fire, '#f97316'], ['🗺️ Tourist Help', data.tourist, '#a78bfa']].map(([label, num, color]) => (
                <a key={label} href={`tel:${num}`} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${color}30`, borderRadius: 12, padding: '14px', textDecoration: 'none', display: 'block', transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = `${color}15`}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}>
                  <div style={{ fontSize: '1.2rem', marginBottom: 4 }}>{label.split(' ')[0]}</div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem', marginBottom: 2 }}>{label.split(' ').slice(1).join(' ')}</div>
                  <div style={{ color, fontWeight: 800, fontSize: '1.1rem' }}>{num}</div>
                </a>
              ))}
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(225,29,72,0.12)', borderRadius: 12, padding: 16, marginBottom: 12 }}>
              <div style={{ color: '#f43f5e', fontWeight: 700, fontSize: '0.85rem', marginBottom: 6 }}>🏛️ Indian Embassy/Consulate</div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>{data.embassy}</div>
            </div>
            <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 12, padding: 14 }}>
              <div style={{ color: '#f59e0b', fontWeight: 700, fontSize: '0.82rem', marginBottom: 4 }}>💡 Additional Info</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem' }}>{data.notes}</div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

// ── TRAVEL CHECKLIST ──
const CHECKLIST_ITEMS = {
  '📋 1 Week Before': ['Check passport validity (6+ months)', 'Apply for visa if needed', 'Book travel insurance', 'Confirm hotel bookings', 'Download offline maps', 'Inform bank about travel', 'Check baggage allowance'],
  '🎒 Day Before': ['Pack all documents (passport, tickets, hotel)', 'Charge all devices + power bank', 'Download entertainment for flight', 'Set multiple alarms', 'Check weather forecast', 'Exchange some currency', 'Share itinerary with family'],
  '✈️ Day of Travel': ['Reach airport 2-3 hrs early', 'Check-in online if possible', 'Keep liquids in 100ml bottles', 'Carry snacks for journey', 'Screenshot all bookings', 'Note emergency contacts', 'Carry medicines in hand luggage'],
  '🏨 At Destination': ['Check hotel check-in time', 'Note local emergency numbers', 'Get local SIM or activate roaming', 'Exchange currency at airport/bank', 'Download local transport app', 'Note nearest hospital', 'Keep hotel address in local language'],
};

export const TravelChecklist = () => {
  const [checked, setChecked] = useState(() => {
    try { return JSON.parse(localStorage.getItem('travel_checklist') || '{}'); } catch { return {}; }
  });
  const [activeSection, setActiveSection] = useState(Object.keys(CHECKLIST_ITEMS)[0]);

  const toggle = (item) => {
    const updated = { ...checked, [item]: !checked[item] };
    setChecked(updated);
    localStorage.setItem('travel_checklist', JSON.stringify(updated));
  };

  const totalItems = Object.values(CHECKLIST_ITEMS).flat().length;
  const checkedCount = Object.values(checked).filter(Boolean).length;
  const progress = Math.round((checkedCount / totalItems) * 100);

  return (
    <section style={{ padding: '80px 6vw' }} id="checklist">
      <div className="section-label">Be Prepared</div>
      <h2 className="section-title">Travel Checklist ✅</h2>
      <p className="section-sub">Never forget anything — complete pre-departure checklist</p>

      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(225,29,72,0.12)', borderRadius: 14, padding: 20, marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>{checkedCount} of {totalItems} completed</span>
            <span style={{ color: '#10b981', fontWeight: 700, fontSize: '0.85rem' }}>{progress}%</span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 6, height: 8 }}>
            <div style={{ background: 'linear-gradient(90deg,#f43f5e,#10b981)', height: '100%', borderRadius: 6, width: `${progress}%`, transition: 'width 0.3s' }} />
          </div>
          {progress === 100 && <div style={{ textAlign: 'center', marginTop: 10, color: '#10b981', fontWeight: 700 }}>🎉 All done! Have a great trip!</div>}
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          {Object.keys(CHECKLIST_ITEMS).map(section => {
            const items = CHECKLIST_ITEMS[section];
            const done = items.filter(i => checked[i]).length;
            return (
              <button key={section} onClick={() => setActiveSection(section)}
                style={{ padding: '7px 14px', borderRadius: 20, border: `1px solid ${activeSection === section ? '#f43f5e' : 'rgba(225,29,72,0.2)'}`, background: activeSection === section ? 'rgba(244,63,94,0.15)' : 'transparent', color: activeSection === section ? '#f43f5e' : 'rgba(255,255,255,0.6)', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans' }}>
                {section} <span style={{ opacity: 0.7 }}>({done}/{items.length})</span>
              </button>
            );
          })}
        </div>

        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(225,29,72,0.1)', borderRadius: 14, padding: 20 }}>
          {CHECKLIST_ITEMS[activeSection]?.map(item => (
            <label key={item} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <input type="checkbox" checked={!!checked[item]} onChange={() => toggle(item)} style={{ accentColor: '#f43f5e', width: 18, height: 18, flexShrink: 0 }} />
              <span style={{ color: checked[item] ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.85)', fontSize: '0.88rem', textDecoration: checked[item] ? 'line-through' : 'none', transition: 'all 0.2s' }}>{item}</span>
            </label>
          ))}
        </div>
        <button onClick={() => { setChecked({}); localStorage.removeItem('travel_checklist'); }}
          style={{ marginTop: 12, padding: '8px 16px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, color: '#f87171', fontFamily: 'DM Sans', fontSize: '0.8rem', cursor: 'pointer' }}>
          🔄 Reset Checklist
        </button>
      </div>
    </section>
  );
};

// ── TRIP COUNTDOWN + PROGRESS + NOTES ──
export const TripDashboard = () => {
  const [trips, setTrips] = useState(() => {
    try { return JSON.parse(localStorage.getItem('trip_dashboard') || '[]'); } catch { return []; }
  });
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ dest: '', date: '', status: 'planning', note: '' });

  const STATUSES = ['planning', 'booked', 'travelling', 'completed'];
  const STATUS_LABELS = { planning: '📋 Planning', booked: '🎫 Booked', travelling: '✈️ Travelling', completed: '✅ Completed' };
  const STATUS_COLORS = { planning: '#a78bfa', booked: '#f59e0b', travelling: '#10b981', completed: '#6b7280' };

  const save = (updated) => { setTrips(updated); localStorage.setItem('trip_dashboard', JSON.stringify(updated)); };

  const addTrip = () => {
    if (!form.dest || !form.date) return;
    save([...trips, { id: Date.now(), ...form }]);
    setForm({ dest: '', date: '', status: 'planning', note: '' });
    setShowAdd(false);
  };

  const updateStatus = (id, status) => save(trips.map(t => t.id === id ? { ...t, status } : t));
  const deleteTrip = (id) => save(trips.filter(t => t.id !== id));

  const getCountdown = (dateStr) => {
    const diff = new Date(dateStr) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days < 0) return { text: 'Trip passed', color: '#6b7280' };
    if (days === 0) return { text: 'Today! 🎉', color: '#10b981' };
    if (days === 1) return { text: 'Tomorrow! 🚀', color: '#f59e0b' };
    return { text: `${days} days to go`, color: '#f43f5e' };
  };

  return (
    <section style={{ padding: '80px 6vw' }} id="trip-dashboard">
      <div className="section-label">My Trips</div>
      <h2 className="section-title">Trip Dashboard 🗓️</h2>
      <p className="section-sub">Track your trips — countdown, progress, notes all in one place</p>

      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <button onClick={() => setShowAdd(s => !s)}
          style={{ marginBottom: 20, padding: '10px 24px', background: 'linear-gradient(135deg,#f43f5e,#9f1239)', border: 'none', borderRadius: 20, color: 'white', fontFamily: 'DM Sans', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer' }}>
          + Add Trip
        </button>

        {showAdd && (
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(225,29,72,0.2)', borderRadius: 16, padding: 20, marginBottom: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 12, marginBottom: 12 }}>
              {[['Destination', 'dest', 'text', 'Goa, Manali...'], ['Travel Date', 'date', 'date', '']].map(([label, key, type, ph]) => (
                <div key={key}>
                  <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', display: 'block', marginBottom: 5 }}>{label}</label>
                  <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={ph} min={type === 'date' ? new Date().toISOString().split('T')[0] : undefined}
                    style={{ width: '100%', padding: '9px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(225,29,72,0.2)', borderRadius: 8, color: 'white', fontFamily: 'DM Sans', fontSize: '0.85rem', boxSizing: 'border-box' }} />
                </div>
              ))}
              <div>
                <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', display: 'block', marginBottom: 5 }}>Status</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                  style={{ width: '100%', padding: '9px 12px', background: '#1f1014', border: '1px solid rgba(225,29,72,0.2)', borderRadius: 8, color: 'white', fontFamily: 'DM Sans', fontSize: '0.85rem', boxSizing: 'border-box' }}>
                  {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                </select>
              </div>
            </div>
            <textarea value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} placeholder="Notes (optional)..." rows={2}
              style={{ width: '100%', padding: '9px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(225,29,72,0.2)', borderRadius: 8, color: 'white', fontFamily: 'DM Sans', fontSize: '0.85rem', resize: 'none', boxSizing: 'border-box', marginBottom: 12 }} />
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={addTrip} style={{ padding: '9px 20px', background: 'linear-gradient(135deg,#f43f5e,#9f1239)', border: 'none', borderRadius: 8, color: 'white', fontFamily: 'DM Sans', fontWeight: 700, cursor: 'pointer' }}>Save Trip</button>
              <button onClick={() => setShowAdd(false)} style={{ padding: '9px 16px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'rgba(255,255,255,0.6)', fontFamily: 'DM Sans', cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        )}

        {trips.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.35)' }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>✈️</div>
            <p>No trips added yet. Add your first trip!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {trips.map(trip => {
              const countdown = getCountdown(trip.date);
              const statusIdx = STATUSES.indexOf(trip.status);
              return (
                <div key={trip.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(225,29,72,0.12)', borderRadius: 16, padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
                    <div>
                      <div style={{ color: 'white', fontWeight: 700, fontSize: '1.1rem' }}>✈️ {trip.dest}</div>
                      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem' }}>📅 {new Date(trip.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ color: countdown.color, fontWeight: 800, fontSize: '0.9rem' }}>{countdown.text}</div>
                      <button onClick={() => deleteTrip(trip.id)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: '1rem' }}>🗑️</button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      {STATUSES.map((s, i) => (
                        <button key={s} onClick={() => updateStatus(trip.id, s)}
                          style={{ fontSize: '0.68rem', fontWeight: 700, color: i <= statusIdx ? STATUS_COLORS[trip.status] : 'rgba(255,255,255,0.25)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans', padding: 0 }}>
                          {STATUS_LABELS[s]}
                        </button>
                      ))}
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 6, height: 6 }}>
                      <div style={{ background: STATUS_COLORS[trip.status], height: '100%', borderRadius: 6, width: `${((statusIdx + 1) / STATUSES.length) * 100}%`, transition: 'width 0.3s' }} />
                    </div>
                  </div>

                  {trip.note && <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.82rem', fontStyle: 'italic', background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '8px 12px' }}>📝 {trip.note}</div>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
