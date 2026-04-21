import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const MultiCityPlanner = () => {
  const [cities, setCities] = useState([{ city: '', days: '' }, { city: '', days: '' }]);
  const [startDate, setStartDate] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const addCity = () => setCities(c => [...c, { city: '', days: '' }]);
  const removeCity = (i) => setCities(c => c.filter((_, idx) => idx !== i));
  const updateCity = (i, field, val) => setCities(c => c.map((item, idx) => idx === i ? { ...item, [field]: val } : item));

  const totalDays = cities.reduce((sum, c) => sum + (parseInt(c.days) || 0), 0);

  const plan = async () => {
    const validCities = cities.filter(c => c.city.trim() && c.days);
    if (validCities.length < 2) return;
    setLoading(true);
    setResult(null);
    try {
      let text = '';
      if (API_KEY) {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const route = validCities.map(c => `${c.city} (${c.days} days)`).join(' → ');
        const prompt = `Create a multi-city trip plan for Indians:
Route: ${route}
Start Date: ${startDate || 'flexible'}
Total Days: ${totalDays}

For each city give:
CITY: [name]
TRANSPORT: [how to reach from previous city — train/flight/bus with cost in INR and duration]
HIGHLIGHTS: [top 3 must-do things]
STAY: [recommended area to stay]
BUDGET: [estimated daily budget in INR]
---
Keep it concise and practical.`;
        const res = await model.generateContent(prompt);
        text = res.response.text();
      } else {
        text = validCities.map((c, i) => `CITY: ${c.city}\nTRANSPORT: ${i === 0 ? 'Starting point' : 'Train/Flight from previous city ~₹1500-3000, 2-4 hrs'}\nHIGHLIGHTS: Local sightseeing, Food tour, Cultural experience\nSTAY: City center area\nBUDGET: ₹2000-4000/day\n---`).join('\n');
      }

      const segments = text.split('---').filter(s => s.trim());
      const parsed = segments.map(seg => {
        const get = (key) => { const m = seg.match(new RegExp(`${key}:\\s*(.+)`)); return m ? m[1].trim() : ''; };
        return { city: get('CITY'), transport: get('TRANSPORT'), highlights: get('HIGHLIGHTS'), stay: get('STAY'), budget: get('BUDGET') };
      }).filter(s => s.city);

      setResult(parsed);
    } catch { setResult(null); }
    finally { setLoading(false); }
  };

  return (
    <section style={{ padding: '80px 6vw' }} id="multi-city">
      <div className="section-label">Advanced Planning</div>
      <h2 className="section-title">Multi-City Trip Planner 🗺️</h2>
      <p className="section-sub">Plan a trip across multiple cities — AI optimizes your route</p>

      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        {cities.map((c, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 12, alignItems: 'center' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#f43f5e,#9f1239)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
            <input value={c.city} onChange={e => updateCity(i, 'city', e.target.value)} placeholder={`City ${i + 1} (e.g. Delhi)`}
              style={{ flex: 2, padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(225,29,72,0.2)', borderRadius: 10, color: 'white', fontFamily: 'DM Sans', fontSize: '0.9rem' }} />
            <input type="number" value={c.days} onChange={e => updateCity(i, 'days', e.target.value)} placeholder="Days"
              style={{ flex: 1, padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(225,29,72,0.2)', borderRadius: 10, color: 'white', fontFamily: 'DM Sans', fontSize: '0.9rem' }} />
            {cities.length > 2 && (
              <button onClick={() => removeCity(i)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, color: '#f87171', width: 34, height: 34, cursor: 'pointer', fontSize: '1rem', flexShrink: 0 }}>✕</button>
            )}
          </div>
        ))}

        <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
          <button onClick={addCity} style={{ padding: '9px 18px', background: 'rgba(244,63,94,0.08)', border: '1px dashed rgba(244,63,94,0.3)', borderRadius: 10, color: '#f43f5e', fontFamily: 'DM Sans', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>+ Add City</button>
          <div style={{ flex: 1, minWidth: 160 }}>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} min={new Date().toISOString().split('T')[0]}
              style={{ width: '100%', padding: '9px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(225,29,72,0.2)', borderRadius: 10, color: 'white', fontFamily: 'DM Sans', fontSize: '0.85rem', boxSizing: 'border-box' }} />
          </div>
          {totalDays > 0 && <div style={{ padding: '9px 14px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 10, color: '#10b981', fontSize: '0.85rem', fontWeight: 700 }}>Total: {totalDays} days</div>}
        </div>

        <button onClick={plan} disabled={loading || cities.filter(c => c.city && c.days).length < 2}
          style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg,#f43f5e,#9f1239)', border: 'none', borderRadius: 12, color: 'white', fontFamily: 'DM Sans', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
          {loading ? '⏳ Planning Route...' : '🗺️ Plan Multi-City Trip'}
        </button>

        {result && (
          <div style={{ marginTop: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, overflowX: 'auto', paddingBottom: 8 }}>
              {result.map((r, i) => (
                <React.Fragment key={i}>
                  <div style={{ background: 'rgba(244,63,94,0.15)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: 20, padding: '5px 14px', color: '#f43f5e', fontWeight: 700, fontSize: '0.82rem', whiteSpace: 'nowrap' }}>{r.city}</div>
                  {i < result.length - 1 && <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '1.2rem' }}>→</span>}
                </React.Fragment>
              ))}
            </div>
            {result.map((r, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(225,29,72,0.12)', borderRadius: 14, padding: 20, marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                  <h4 style={{ color: 'white', fontSize: '1.1rem', margin: 0 }}>📍 {r.city}</h4>
                  {r.budget && <span style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#10b981', padding: '3px 10px', borderRadius: 10, fontSize: '0.78rem', fontWeight: 700 }}>{r.budget}</span>}
                </div>
                {r.transport && i > 0 && <div style={{ background: 'rgba(244,63,94,0.06)', borderRadius: 8, padding: '8px 12px', marginBottom: 10, color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem' }}>🚌 <strong>Getting here:</strong> {r.transport}</div>}
                {r.highlights && <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem', marginBottom: 6 }}>✨ <strong>Highlights:</strong> {r.highlights}</div>}
                {r.stay && <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem' }}>🏨 <strong>Stay in:</strong> {r.stay}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MultiCityPlanner;
