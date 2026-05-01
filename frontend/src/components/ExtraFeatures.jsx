import React, { useState, useMemo } from 'react';
import './ExtraFeatures.css';

/* ─── LANGUAGE TRANSLATOR ─── */
const LANGUAGES = [
  { lang:'Japanese', flag:'🇯🇵', native:'日本語', phrases:[
    { en:'Hello', local:'Konnichiwa (こんにちは)', pron:'kon-ni-chi-wa' },
    { en:'Thank you', local:'Arigatou (ありがとう)', pron:'a-ri-ga-tou' },
    { en:'Where is...?', local:'...wa doko desu ka?', pron:'wa do-ko des-ka' },
    { en:'How much?', local:'Ikura desu ka?', pron:'i-ku-ra des-ka' },
    { en:'Help!', local:'Tasukete! (助けて)', pron:'ta-su-ke-te' },
  ]},
  { lang:'French', flag:'🇫🇷', native:'Français', phrases:[
    { en:'Hello', local:'Bonjour', pron:'bon-zhoor' },
    { en:'Thank you', local:'Merci', pron:'mair-see' },
    { en:'Where is...?', local:'Où est...?', pron:'oo-ay' },
    { en:'How much?', local:'Combien ça coûte?', pron:'kom-byan sa koot' },
    { en:'Help!', local:'Au secours!', pron:'oh se-koor' },
  ]},
  { lang:'Thai', flag:'🇹🇭', native:'ภาษาไทย', phrases:[
    { en:'Hello', local:'Sawasdee (สวัสดี)', pron:'sa-wat-dee' },
    { en:'Thank you', local:'Khob khun (ขอบคุณ)', pron:'kob-kun' },
    { en:'Where is...?', local:'...yuu tee nai?', pron:'yoo-tee-nai' },
    { en:'How much?', local:'Tao rai? (เท่าไหร่)', pron:'tao-rai' },
    { en:'Help!', local:'Chuay duay! (ช่วยด้วย)', pron:'chuay-duay' },
  ]},
  { lang:'Indonesian', flag:'🇮🇩', native:'Bahasa Indonesia', phrases:[
    { en:'Hello', local:'Halo / Selamat', pron:'ha-lo' },
    { en:'Thank you', local:'Terima kasih', pron:'te-ri-ma ka-sih' },
    { en:'Where is...?', local:'Di mana...?', pron:'di ma-na' },
    { en:'How much?', local:'Berapa harganya?', pron:'be-ra-pa har-ga-nya' },
    { en:'Help!', local:'Tolong!', pron:'to-long' },
  ]},
  { lang:'Spanish', flag:'🇪🇸', native:'Español', phrases:[
    { en:'Hello', local:'Hola', pron:'o-la' },
    { en:'Thank you', local:'Gracias', pron:'gra-syas' },
    { en:'Where is...?', local:'¿Dónde está...?', pron:'don-de es-ta' },
    { en:'How much?', local:'¿Cuánto cuesta?', pron:'kwan-to kwes-ta' },
    { en:'Help!', local:'¡Ayuda!', pron:'a-yoo-da' },
  ]},
  { lang:'Arabic', flag:'🇦🇪', native:'العربية', phrases:[
    { en:'Hello', local:'Marhaba (مرحبا)', pron:'mar-ha-ba' },
    { en:'Thank you', local:'Shukran (شكراً)', pron:'shuk-ran' },
    { en:'Where is...?', local:'Ayna...? (أين)', pron:'ay-na' },
    { en:'How much?', local:'Bikam? (بكم)', pron:'bi-kam' },
    { en:'Help!', local:'Musaada! (مساعدة)', pron:'mu-sa-a-da' },
  ]},
];

export const LanguageTranslator = () => (
  <section className="language-section" id="language">
    <div className="section-label">Travel Phrases</div>
    <h2 className="section-title">Language Guide 🗣️</h2>
    <p className="section-sub">Essential phrases for every destination — speak like a local</p>
    <div className="lang-grid">
      {LANGUAGES.map((l, i) => (
        <div key={i} className="lang-card">
          <div className="lang-card-header">
            <span className="lang-flag">{l.flag}</span>
            <div>
              <div className="lang-name">{l.lang}</div>
              <div className="lang-native">{l.native}</div>
            </div>
          </div>
          <div className="phrase-list">
            {l.phrases.map((p, j) => (
              <div key={j} className="phrase-item">
                <span className="phrase-english">{p.en}</span>
                <div style={{textAlign:'right'}}>
                  <div className="phrase-local">{p.local}</div>
                  <div className="phrase-pronounce">{p.pron}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </section>
);

/* ─── FESTIVAL CALENDAR ─── */
const FESTIVALS = [
  { name:'Diwali', date:'Oct 20, 2025', month:'Oct', img:'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=300&h=120&fit=crop', desc:'Festival of lights — best in Varanasi, Jaipur, Amritsar', dest:'Varanasi, Jaipur' },
  { name:'Holi', date:'Mar 14, 2025', month:'Mar', img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=120&fit=crop', desc:'Festival of colors — best in Mathura, Vrindavan, Jaipur', dest:'Mathura, Vrindavan' },
  { name:'Navratri / Garba', date:'Sep 22, 2025', month:'Sep', img:'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=300&h=120&fit=crop', desc:'9 nights of dance — best in Ahmedabad, Vadodara', dest:'Ahmedabad, Vadodara' },
  { name:'Pushkar Camel Fair', date:'Nov 1, 2025', month:'Nov', img:'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=300&h=120&fit=crop', desc:'World famous camel fair in Rajasthan desert', dest:'Pushkar, Rajasthan' },
  { name:'Goa Carnival', date:'Feb 28, 2025', month:'Feb', img:'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=300&h=120&fit=crop', desc:'4-day Portuguese-style carnival with parades & music', dest:'Panaji, Goa' },
  { name:'Onam', date:'Aug 27, 2025', month:'Aug', img:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=120&fit=crop', desc:'Kerala harvest festival — snake boat races & sadya feast', dest:'Alleppey, Kerala' },
  { name:'Durga Puja', date:'Sep 28, 2025', month:'Sep', img:'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=300&h=120&fit=crop', desc:'Grand 5-day celebration — best in Kolkata', dest:'Kolkata' },
  { name:'Rann Utsav', date:'Nov 15, 2025', month:'Nov', img:'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=300&h=120&fit=crop', desc:'White desert festival under full moon in Kutch', dest:'Rann of Kutch, Gujarat' },
  { name:'Leh Ladakh Festival', date:'Sep 1, 2025', month:'Sep', img:'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=300&h=120&fit=crop', desc:'Traditional Ladakhi culture, polo & archery', dest:'Leh, Ladakh' },
  { name:'Sunburn Festival', date:'Dec 27, 2025', month:'Dec', img:'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=300&h=120&fit=crop', desc:"Asia's biggest EDM music festival", dest:'Goa' },
  { name:'Jaipur Literature Fest', date:'Jan 30, 2025', month:'Jan', img:'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=300&h=120&fit=crop', desc:"World's largest free literary festival", dest:'Jaipur, Rajasthan' },
  { name:'Hornbill Festival', date:'Dec 1, 2025', month:'Dec', img:'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=120&fit=crop', desc:'Festival of Nagaland tribes — music, dance & food', dest:'Kohima, Nagaland' },
];

const MONTHS = ['All','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export const FestivalCalendar = () => {
  const [activeMonth, setActiveMonth] = useState('All');
  const filtered = FESTIVALS.filter(f => activeMonth === 'All' || f.month === activeMonth);

  return (
    <section className="festival-section" id="festivals">
      <div className="section-label">Plan Around Events</div>
      <h2 className="section-title">Indian Festival Calendar 🎉</h2>
      <p className="section-sub">Travel during festivals for unforgettable experiences</p>
      <div className="festival-month-filter">
        {MONTHS.map(m => (
          <button key={m} className={`month-chip ${activeMonth === m ? 'active' : ''}`} onClick={() => setActiveMonth(m)}>{m}</button>
        ))}
      </div>
      <div className="festival-grid">
        {filtered.map((f, i) => (
          <div key={i} className="festival-card">
            <img src={f.img} alt={f.name} onError={e => { e.target.style.display='none'; }} />
            <div className="festival-card-body">
              <div className="festival-name">{f.name}</div>
              <div className="festival-date">📅 {f.date}</div>
              <div className="festival-desc">{f.desc}</div>
              <div className="festival-dest">📍 {f.dest}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

/* ─── GROUP PLANNER ─── */
export const GroupPlanner = () => {
  const [members, setMembers] = useState(['Rahul', 'Priya', 'Amit']);
  const [newMember, setNewMember] = useState('');
  const [totalBudget, setTotalBudget] = useState(150000);

  const addMember = () => {
    if (newMember.trim() && !members.includes(newMember.trim())) {
      setMembers(m => [...m, newMember.trim()]);
      setNewMember('');
    }
  };

  const removeMember = (name) => setMembers(m => m.filter(x => x !== name));

  const perPerson = members.length > 0 ? Math.round(totalBudget / members.length) : 0;
  const fmt = n => `₹${n.toLocaleString('en-IN')}`;

  const EXPENSE_BREAKDOWN = [
    { label:'✈️ Flights', pct:0.35 },
    { label:'🏨 Hotels', pct:0.30 },
    { label:'🍽️ Food', pct:0.20 },
    { label:'🎭 Activities', pct:0.10 },
    { label:'🚌 Local Transport', pct:0.05 },
  ];

  return (
    <section className="group-section" id="group">
      <div className="section-label">Travel Together</div>
      <h2 className="section-title">Group Trip Planner 👥</h2>
      <p className="section-sub">Plan with friends & split expenses fairly</p>
      <div className="group-widget">
        <h4 style={{color:'var(--rose)',marginBottom:12,fontSize:'0.95rem'}}>👥 Group Members</h4>
        <div className="group-members">
          {members.map((m, i) => (
            <div key={i} className="member-row">
              <input className="member-input" value={m} onChange={e => { const updated=[...members]; updated[i]=e.target.value; setMembers(updated); }} />
              <button className="member-remove" onClick={() => removeMember(m)}>Remove</button>
            </div>
          ))}
        </div>
        <div style={{display:'flex',gap:8,marginBottom:20}}>
          <input className="member-input" value={newMember} onChange={e => setNewMember(e.target.value)} placeholder="Add member name..." onKeyDown={e => e.key==='Enter' && addMember()} />
          <button className="pnr-btn" onClick={addMember}>Add</button>
        </div>

        <h4 style={{color:'var(--rose)',marginBottom:8,fontSize:'0.95rem'}}>💰 Total Trip Budget (₹)</h4>
        <input className="total-budget-input" type="number" value={totalBudget} onChange={e => setTotalBudget(+e.target.value)} />

        <div className="expense-split">
          <h4>Split per person: <span style={{color:'var(--white)',fontSize:'1.1rem'}}>{fmt(perPerson)}</span> ({members.length} people)</h4>
          {EXPENSE_BREAKDOWN.map((e, i) => (
            <div key={i} className="split-row">
              <span className="split-name">{e.label}</span>
              <span className="split-amount">{fmt(Math.round(totalBudget * e.pct / members.length))} /person</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─── TIMELINE VIEW ─── */
export const TripTimeline = ({ tripData }) => {
  if (!tripData?.dailyItinerary?.length) return null;

  return (
    <section className="timeline-section" id="timeline">
      <div className="section-label">Your Journey</div>
      <h2 className="section-title">Trip Timeline 📅</h2>
      <p className="section-sub">Day-by-day view of your {tripData.destination} trip</p>
      <div className="timeline-wrap">
        {tripData.dailyItinerary.map((day, i) => (
          <div key={i} className="timeline-item">
            <div className="timeline-dot">
              {i === 0 ? '🛫' : i === tripData.dailyItinerary.length - 1 ? '🛬' : '📍'}
            </div>
            <div className="timeline-content">
              <div className="timeline-day">Day {day.day} · {day.date}</div>
              <div className="timeline-title">{day.title}</div>
              <div className="timeline-activities">
                {day.activities?.slice(0, 3).map((act, j) => (
                  <div key={j} className="timeline-act">
                    <span className="timeline-act-time">{act.time}</span>
                    <span>{act.activity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
