import React, { useState } from 'react';
import './ExtraFeatures.css';

const VISA_DATA = [
  { country:'Thailand', flag:'🇹🇭', type:'visa-on-arrival', typeLabel:'Visa on Arrival', duration:'30 days', note:'Free for Indians' },
  { country:'Indonesia (Bali)', flag:'🇮🇩', type:'visa-on-arrival', typeLabel:'Visa on Arrival', duration:'30 days', note:'$35 fee' },
  { country:'Maldives', flag:'🇲🇻', type:'visa-free', typeLabel:'Visa Free', duration:'30 days', note:'Free entry' },
  { country:'Nepal', flag:'🇳🇵', type:'visa-free', typeLabel:'Visa Free', duration:'Unlimited', note:'Open border' },
  { country:'Bhutan', flag:'🇧🇹', type:'visa-free', typeLabel:'Visa Free', duration:'As needed', note:'Permit required' },
  { country:'Sri Lanka', flag:'🇱🇰', type:'evisa', typeLabel:'e-Visa', duration:'30 days', note:'Free e-visa' },
  { country:'Malaysia', flag:'🇲🇾', type:'visa-free', typeLabel:'Visa Free', duration:'30 days', note:'Free entry' },
  { country:'Mauritius', flag:'🇲🇺', type:'visa-free', typeLabel:'Visa Free', duration:'60 days', note:'Free entry' },
  { country:'Cambodia', flag:'🇰🇭', type:'visa-on-arrival', typeLabel:'Visa on Arrival', duration:'30 days', note:'$30 fee' },
  { country:'Vietnam', flag:'🇻🇳', type:'evisa', typeLabel:'e-Visa', duration:'90 days', note:'$25 fee' },
  { country:'Japan', flag:'🇯🇵', type:'evisa', typeLabel:'e-Visa', duration:'15-30 days', note:'Free e-visa' },
  { country:'Singapore', flag:'🇸🇬', type:'visa-on-arrival', typeLabel:'Visa on Arrival', duration:'30 days', note:'Free' },
  { country:'UAE (Dubai)', flag:'🇦🇪', type:'visa-on-arrival', typeLabel:'Visa on Arrival', duration:'14 days', note:'Free on arrival' },
  { country:'Qatar', flag:'🇶🇦', type:'visa-on-arrival', typeLabel:'Visa on Arrival', duration:'30 days', note:'Free' },
  { country:'France', flag:'🇫🇷', type:'visa-required', typeLabel:'Schengen Visa', duration:'90 days', note:'Apply at embassy' },
  { country:'UK', flag:'🇬🇧', type:'visa-required', typeLabel:'UK Visa Required', duration:'6 months', note:'Apply online' },
  { country:'USA', flag:'🇺🇸', type:'visa-required', typeLabel:'B1/B2 Visa', duration:'10 years', note:'Interview required' },
  { country:'Australia', flag:'🇦🇺', type:'evisa', typeLabel:'e-Visa (ETA)', duration:'1 year', note:'$20 fee' },
  { country:'Canada', flag:'🇨🇦', type:'visa-required', typeLabel:'Visa Required', duration:'10 years', note:'Apply online' },
  { country:'Kenya', flag:'🇰🇪', type:'evisa', typeLabel:'e-Visa', duration:'90 days', note:'$51 fee' },
  { country:'Ethiopia', flag:'🇪🇹', type:'visa-on-arrival', typeLabel:'Visa on Arrival', duration:'30 days', note:'$50 fee' },
  { country:'Seychelles', flag:'🇸🇨', type:'visa-free', typeLabel:'Visa Free', duration:'30 days', note:'Free entry' },
  { country:'Fiji', flag:'🇫🇯', type:'visa-free', typeLabel:'Visa Free', duration:'4 months', note:'Free entry' },
  { country:'Turkey', flag:'🇹🇷', type:'evisa', typeLabel:'e-Visa', duration:'30 days', note:'$51 fee' },
];

const FILTERS = ['All', 'Visa Free', 'Visa on Arrival', 'e-Visa', 'Visa Required'];

const VisaInfo = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = VISA_DATA.filter(v => {
    const matchFilter = activeFilter === 'All' ||
      (activeFilter === 'Visa Free' && v.type === 'visa-free') ||
      (activeFilter === 'Visa on Arrival' && v.type === 'visa-on-arrival') ||
      (activeFilter === 'e-Visa' && v.type === 'evisa') ||
      (activeFilter === 'Visa Required' && v.type === 'visa-required');
    const matchSearch = v.country.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <section className="visa-section" id="visa">
      <div className="section-label">Travel Documents</div>
      <h2 className="section-title">Visa Information</h2>
      <p className="section-sub">Indian passport visa requirements for 24+ countries</p>

      <input
        style={{ width:'100%', maxWidth:400, background:'rgba(255,255,255,0.05)', border:'1.5px solid rgba(255,255,255,0.1)', borderRadius:12, padding:'11px 16px', color:'white', fontFamily:'DM Sans,sans-serif', fontSize:'0.9rem', outline:'none', marginBottom:16, boxSizing:'border-box' }}
        placeholder="🔍 Search country..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <div className="visa-filter-tabs">
        {FILTERS.map(f => (
          <button key={f} className={`visa-tab ${activeFilter === f ? 'active' : ''}`} onClick={() => setActiveFilter(f)}>{f}</button>
        ))}
      </div>

      <div className="visa-grid">
        {filtered.map((v, i) => (
          <div key={i} className="visa-card">
            <div className="visa-flag">{v.flag}</div>
            <div className="visa-country">{v.country}</div>
            <span className={`visa-type ${v.type}`}>{v.typeLabel}</span>
            <div className="visa-duration">📅 Stay: {v.duration}</div>
            <div className="visa-duration" style={{marginTop:4}}>ℹ️ {v.note}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default VisaInfo;
