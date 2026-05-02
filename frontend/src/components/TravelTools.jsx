import React, { useState, useEffect } from 'react';

// ── EMERGENCY CONTACTS ──
const EMERGENCY_DATA = {
  'India':        { police:'100', ambulance:'108', fire:'101', tourist:'1800-11-1363', embassy:'N/A', notes:'IRCTC: 139 | Air India: 1800-180-1407' },
  'USA':          { police:'911', ambulance:'911', fire:'911', tourist:'1-800-USA-TRIP', embassy:'+1-202-588-6500', notes:'Indian Consulate NY: +1-212-774-0600' },
  'UK':           { police:'999', ambulance:'999', fire:'999', tourist:'0845-600-6996', embassy:'+44-20-7836-8484', notes:'NHS non-emergency: 111' },
  'UAE/Dubai':    { police:'999', ambulance:'998', fire:'997', tourist:'800-DUBAI', embassy:'+971-4-397-1222', notes:'Tourist Police: 800-4673' },
  'Thailand':     { police:'191', ambulance:'1669', fire:'199', tourist:'1155', embassy:'+66-2-258-0300', notes:'Tourist Police: 1155 (English)' },
  'Bali/Indonesia':{ police:'110', ambulance:'118', fire:'113', tourist:'1500-304', embassy:'+62-21-5204150', notes:'Bali Tourism: +62-361-222387' },
  'Japan':        { police:'110', ambulance:'119', fire:'119', tourist:'050-3816-2787', embassy:'+81-3-3262-2391', notes:'Japan Helpline: 0570-000-911' },
  'Singapore':    { police:'999', ambulance:'995', fire:'995', tourist:'1800-736-2000', embassy:'+65-6737-6777', notes:'Non-emergency: 1800-255-0000' },
  'France/Paris': { police:'17',  ambulance:'15',  fire:'18',  tourist:'3264', embassy:'+33-1-4050-7070', notes:'European emergency: 112' },
};

export const EmergencyContacts = () => {
  const [selected, setSelected] = useState('India');
  const data = EMERGENCY_DATA[selected];

  const s = {
    section: { padding: '88px 6vw', background: 'var(--night)' },
    select: { width: '100%', padding: '11px 14px', background: 'rgba(255,255,255,0.04)', border: '1.5px solid var(--border)', borderRadius: 11, color: 'var(--white)', fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', outline: 'none', marginBottom: 20, maxWidth: 500 },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: 10, marginBottom: 14 },
    numCard: (color) => ({ background: `${color}10`, border: `1px solid ${color}30`, borderRadius: 12, padding: '13px', textDecoration: 'none', display: 'block', transition: 'background 0.15s' }),
    numLabel: { color: 'var(--gray)', fontSize: '0.7rem', marginBottom: 2, fontFamily: 'Inter, sans-serif' },
    numVal: (color) => ({ color, fontWeight: 800, fontSize: '1.1rem', fontFamily: 'Inter, sans-serif' }),
    infoBox: (bg, border, titleColor) => ({ background: bg, border: `1px solid ${border}`, borderRadius: 11, padding: '13px 16px', marginBottom: 10 }),
    infoTitle: (color) => ({ color, fontWeight: 700, fontSize: '0.82rem', marginBottom: 5, fontFamily: 'Inter, sans-serif' }),
    infoText: { color: 'var(--muted)', fontSize: '0.82rem', fontFamily: 'Inter, sans-serif', lineHeight: 1.5 },
  };

  return (
    <section style={s.section} id="emergency">
      <div className="section-label">Safety First</div>
      <h2 className="section-title">Emergency Contacts 🆘</h2>
      <p className="section-sub">Important numbers for every destination — save before you travel</p>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        <select value={selected} onChange={e => setSelected(e.target.value)} style={s.select}>
          {Object.keys(EMERGENCY_DATA).map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {data && (
          <>
            <div style={s.grid}>
              {[['🚔 Police', data.police, '#ef4444'], ['🚑 Ambulance', data.ambulance, '#10b981'], ['🔥 Fire', data.fire, '#f97316'], ['🗺️ Tourist', data.tourist, '#a78bfa']].map(([label, num, color]) => (
                <a key={label} href={`tel:${num}`} style={s.numCard(color)}
                  onMouseEnter={e => e.currentTarget.style.background = `${color}18`}
                  onMouseLeave={e => e.currentTarget.style.background = `${color}10`}>
                  <div style={{ fontSize: '1.1rem', marginBottom: 4 }}>{label.split(' ')[0]}</div>
                  <div style={s.numLabel}>{label.split(' ').slice(1).join(' ')}</div>
                  <div style={s.numVal(color)}>{num}</div>
                </a>
              ))}
            </div>
            <div style={s.infoBox('rgba(99,102,241,0.06)', 'rgba(99,102,241,0.2)')}>
              <div style={s.infoTitle('#a5b4fc')}>🏛️ Indian Embassy/Consulate</div>
              <div style={s.infoText}>{data.embassy}</div>
            </div>
            <div style={s.infoBox('rgba(245,158,11,0.06)', 'rgba(245,158,11,0.18)')}>
              <div style={s.infoTitle('#fbbf24')}>💡 Additional Info</div>
              <div style={s.infoText}>{data.notes}</div>
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
  '🎒 Day Before':    ['Pack all documents (passport, tickets, hotel)', 'Charge all devices + power bank', 'Download entertainment for flight', 'Set multiple alarms', 'Check weather forecast', 'Exchange some currency', 'Share itinerary with family'],
  '✈️ Day of Travel': ['Reach airport 2-3 hrs early', 'Check-in online if possible', 'Keep liquids in 100ml bottles', 'Carry snacks for journey', 'Screenshot all bookings', 'Note emergency contacts', 'Carry medicines in hand luggage'],
  '🏨 At Destination':['Check hotel check-in time', 'Note local emergency numbers', 'Get local SIM or activate roaming', 'Exchange currency at airport/bank', 'Download local transport app', 'Note nearest hospital', 'Keep hotel address in local language'],
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
    <section style={{ padding: '88px 6vw', background: 'var(--dusk)' }} id="checklist">
      <div className="section-label">Be Prepared</div>
      <h2 className="section-title">Travel Checklist ✅</h2>
      <p className="section-sub">Never forget anything — complete pre-departure checklist</p>

      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        {/* Progress */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 18, marginBottom: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ color: 'var(--muted)', fontSize: '0.82rem', fontFamily: 'Inter, sans-serif' }}>{checkedCount} of {totalItems} completed</span>
            <span style={{ color: '#34d399', fontWeight: 700, fontSize: '0.82rem', fontFamily: 'Inter, sans-serif' }}>{progress}%</span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 6, height: 7 }}>
            <div style={{ background: 'linear-gradient(90deg, var(--indigo), #34d399)', height: '100%', borderRadius: 6, width: `${progress}%`, transition: 'width 0.3s' }} />
          </div>
          {progress === 100 && <div style={{ textAlign: 'center', marginTop: 10, color: '#34d399', fontWeight: 700, fontSize: '0.85rem', fontFamily: 'Inter, sans-serif' }}>🎉 All done! Have a great trip!</div>}
        </div>

        {/* Section Tabs */}
        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 16 }}>
          {Object.keys(CHECKLIST_ITEMS).map(section => {
            const items = CHECKLIST_ITEMS[section];
            const done = items.filter(i => checked[i]).length;
            const isActive = activeSection === section;
            return (
              <button key={section} onClick={() => setActiveSection(section)} style={{
                padding: '6px 13px', borderRadius: 20,
                border: `1px solid ${isActive ? 'var(--indigo)' : 'var(--border)'}`,
                background: isActive ? 'var(--indigo3)' : 'transparent',
                color: isActive ? '#a5b4fc' : 'var(--muted)',
                fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
                fontFamily: 'Inter, sans-serif', transition: 'all 0.15s',
              }}>
                {section} <span style={{ opacity: 0.6 }}>({done}/{items.length})</span>
              </button>
            );
          })}
        </div>

        {/* Items */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: '4px 18px' }}>
          {CHECKLIST_ITEMS[activeSection]?.map(item => (
            <label key={item} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0', cursor: 'pointer', borderBottom: '1px solid var(--border)' }}>
              <input type="checkbox" checked={!!checked[item]} onChange={() => toggle(item)} style={{ accentColor: '#6366f1', width: 17, height: 17, flexShrink: 0 }} />
              <span style={{ color: checked[item] ? 'var(--gray)' : 'var(--white)', fontSize: '0.875rem', textDecoration: checked[item] ? 'line-through' : 'none', transition: 'all 0.2s', fontFamily: 'Inter, sans-serif' }}>{item}</span>
            </label>
          ))}
        </div>
        <button onClick={() => { setChecked({}); localStorage.removeItem('travel_checklist'); }} style={{
          marginTop: 10, padding: '7px 16px',
          background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.18)',
          borderRadius: 8, color: '#f87171', fontFamily: 'Inter, sans-serif',
          fontSize: '0.78rem', cursor: 'pointer', transition: 'all 0.15s',
        }}>
          🔄 Reset Checklist
        </button>
      </div>
    </section>
  );
};

// ── TRIP DASHBOARD ──
export const TripDashboard = () => {
  const [trips, setTrips] = useState(() => {
    try { return JSON.parse(localStorage.getItem('trip_dashboard') || '[]'); } catch { return []; }
  });
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ dest: '', date: '', status: 'planning', note: '' });

  const STATUSES = ['planning', 'booked', 'travelling', 'completed'];
  const STATUS_LABELS = { planning: '📋 Planning', booked: '🎫 Booked', travelling: '✈️ Travelling', completed: '✅ Completed' };
  const STATUS_COLORS = { planning: '#a78bfa', booked: '#f59e0b', travelling: '#34d399', completed: '#6b7280' };

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
    const days = Math.ceil((new Date(dateStr) - new Date()) / 86400000);
    if (days < 0) return { text: 'Trip passed', color: '#6b7280' };
    if (days === 0) return { text: 'Today! 🎉', color: '#34d399' };
    if (days === 1) return { text: 'Tomorrow! 🚀', color: '#fbbf24' };
    return { text: `${days} days to go`, color: '#a5b4fc' };
  };

  const inputStyle = { width: '100%', padding: '9px 12px', background: 'rgba(255,255,255,0.04)', border: '1.5px solid var(--border)', borderRadius: 9, color: 'var(--white)', fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', boxSizing: 'border-box', outline: 'none' };

  return (
    <section style={{ padding: '88px 6vw', background: 'var(--night)' }} id="trip-dashboard">
      <div className="section-label">My Trips</div>
      <h2 className="section-title">Trip Dashboard 🗓️</h2>
      <p className="section-sub">Track your trips — countdown, status & notes</p>

      <div style={{ maxWidth: 780, margin: '0 auto' }}>
        <button onClick={() => setShowAdd(s => !s)} style={{
          marginBottom: 18, padding: '10px 22px',
          background: 'linear-gradient(135deg, var(--indigo), var(--indigo2))',
          border: 'none', borderRadius: 11, color: 'white',
          fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.85rem',
          cursor: 'pointer', boxShadow: '0 3px 12px var(--glow-indigo)',
        }}>
          + Add Trip
        </button>

        {showAdd && (
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: 20, marginBottom: 18 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 12, marginBottom: 12 }}>
              {[['Destination', 'dest', 'text', 'Goa, Manali...'], ['Travel Date', 'date', 'date', '']].map(([label, key, type, ph]) => (
                <div key={key}>
                  <label style={{ color: 'var(--muted)', fontSize: '0.72rem', fontWeight: 700, display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'Inter, sans-serif' }}>{label}</label>
                  <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={ph}
                    min={type === 'date' ? new Date().toISOString().split('T')[0] : undefined} style={inputStyle} />
                </div>
              ))}
              <div>
                <label style={{ color: 'var(--muted)', fontSize: '0.72rem', fontWeight: 700, display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'Inter, sans-serif' }}>Status</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                  style={{ ...inputStyle, background: 'rgba(255,255,255,0.04)' }}>
                  {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                </select>
              </div>
            </div>
            <textarea value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} placeholder="Notes (optional)..." rows={2}
              style={{ ...inputStyle, resize: 'none', marginBottom: 12 }} />
            <div style={{ display: 'flex', gap: 9 }}>
              <button onClick={addTrip} style={{ padding: '9px 20px', background: 'linear-gradient(135deg, var(--indigo), var(--indigo2))', border: 'none', borderRadius: 9, color: 'white', fontFamily: 'Inter, sans-serif', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}>Save Trip</button>
              <button onClick={() => setShowAdd(false)} style={{ padding: '9px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: 9, color: 'var(--muted)', fontFamily: 'Inter, sans-serif', cursor: 'pointer', fontSize: '0.85rem' }}>Cancel</button>
            </div>
          </div>
        )}

        {trips.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>✈️</div>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem' }}>No trips added yet. Add your first trip!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {trips.map(trip => {
              const countdown = getCountdown(trip.date);
              const statusIdx = STATUSES.indexOf(trip.status);
              return (
                <div key={trip.id} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 15, padding: 18 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                    <div>
                      <div style={{ color: 'var(--white)', fontWeight: 700, fontSize: '1rem', fontFamily: 'Inter, sans-serif', letterSpacing: '-0.01em' }}>✈️ {trip.dest}</div>
                      <div style={{ color: 'var(--gray)', fontSize: '0.75rem', fontFamily: 'Inter, sans-serif', marginTop: 2 }}>
                        📅 {new Date(trip.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ color: countdown.color, fontWeight: 700, fontSize: '0.85rem', fontFamily: 'Inter, sans-serif' }}>{countdown.text}</div>
                      <button onClick={() => deleteTrip(trip.id)} style={{ background: 'none', border: 'none', color: 'var(--gray)', cursor: 'pointer', fontSize: '0.95rem', padding: '2px 4px', borderRadius: 6, transition: 'color 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--gray)'}>🗑️</button>
                    </div>
                  </div>

                  <div style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      {STATUSES.map((s, i) => (
                        <button key={s} onClick={() => updateStatus(trip.id, s)} style={{
                          fontSize: '0.65rem', fontWeight: 700,
                          color: i <= statusIdx ? STATUS_COLORS[trip.status] : 'var(--gray)',
                          background: 'none', border: 'none', cursor: 'pointer',
                          fontFamily: 'Inter, sans-serif', padding: 0, transition: 'color 0.15s',
                        }}>
                          {STATUS_LABELS[s]}
                        </button>
                      ))}
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 5, height: 5 }}>
                      <div style={{ background: STATUS_COLORS[trip.status], height: '100%', borderRadius: 5, width: `${((statusIdx + 1) / STATUSES.length) * 100}%`, transition: 'width 0.3s' }} />
                    </div>
                  </div>

                  {trip.note && (
                    <div style={{ color: 'var(--muted)', fontSize: '0.8rem', fontStyle: 'italic', background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '7px 11px', fontFamily: 'Inter, sans-serif' }}>
                      📝 {trip.note}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
