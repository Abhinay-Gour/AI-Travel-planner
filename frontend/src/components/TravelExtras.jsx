import React, { useState } from 'react';

// ── TRIP SHARE LINK ──
export const TripShareLink = ({ tripData }) => {
  const [copied, setCopied] = useState(false);
  if (!tripData) return null;

  const shareData = btoa(encodeURIComponent(JSON.stringify({
    dest: tripData.destination,
    duration: tripData.duration,
    dates: tripData.dates,
    overview: tripData.overview?.slice(0, 200),
    highlights: tripData.highlights?.slice(0, 3),
  })));
  const shareUrl = `${window.location.origin}/?shared=${shareData}`;

  const copy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div style={{ background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: 12, padding: '14px 16px', marginBottom: 16 }}>
      <div style={{ color: '#a78bfa', fontWeight: 700, fontSize: '0.85rem', marginBottom: 8 }}>🔗 Share Trip Plan</div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input readOnly value={shareUrl} style={{ flex: 1, padding: '8px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: 8, color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', fontFamily: 'DM Sans' }} />
        <button onClick={copy} style={{ padding: '8px 16px', background: copied ? '#10b981' : 'rgba(167,139,250,0.2)', border: 'none', borderRadius: 8, color: 'white', fontFamily: 'DM Sans', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
          {copied ? '✓ Copied!' : '📋 Copy'}
        </button>
        <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Check out my trip plan to ${tripData.destination}! ${shareUrl}`)}`, '_blank')}
          style={{ padding: '8px 14px', background: '#25D366', border: 'none', borderRadius: 8, color: 'white', fontFamily: 'DM Sans', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>
          📱
        </button>
      </div>
    </div>
  );
};

// ── VISA TRACKER ──
const VISA_DATA = {
  'USA': { docs: ['Valid Passport (6+ months)', 'DS-160 Form', 'Photo (2x2 inch)', 'Bank Statements (6 months)', 'ITR (3 years)', 'Employment Letter', 'Travel Itinerary'], processing: '3-5 weeks', fee: '₹13,000', type: 'B1/B2 Tourist', difficulty: 'Hard' },
  'UK': { docs: ['Valid Passport', 'Online Application (VAF1A)', 'Bank Statements', 'Salary Slips', 'Hotel Bookings', 'Return Tickets', 'Travel Insurance'], processing: '3 weeks', fee: '₹11,000', type: 'Standard Visitor', difficulty: 'Medium' },
  'Schengen (Europe)': { docs: ['Valid Passport', 'Schengen Application Form', 'Travel Insurance (€30k)', 'Bank Statements', 'Hotel Bookings', 'Return Tickets', 'ITR'], processing: '2-3 weeks', fee: '₹7,000', type: 'Schengen C', difficulty: 'Medium' },
  'Australia': { docs: ['Valid Passport', 'Online Application', 'Bank Statements', 'Employment Proof', 'Travel Itinerary', 'Health Insurance'], processing: '4-6 weeks', fee: '₹12,000', type: 'Tourist (600)', difficulty: 'Medium' },
  'Canada': { docs: ['Valid Passport', 'Online Application', 'Biometrics', 'Bank Statements (6 months)', 'ITR', 'Employment Letter', 'Travel History'], processing: '4-8 weeks', fee: '₹8,500', type: 'Visitor Visa', difficulty: 'Hard' },
  'Japan': { docs: ['Valid Passport', 'Application Form', 'Photo', 'Bank Statements', 'Itinerary', 'Hotel Bookings', 'Return Tickets'], processing: '5-7 days', fee: '₹1,500', type: 'Tourist', difficulty: 'Easy' },
  'Thailand': { docs: ['Valid Passport', 'Arrival Card', 'Return Ticket', 'Hotel Booking', '₹5000 equivalent cash'], processing: 'On Arrival', fee: 'Free (30 days)', type: 'Visa on Arrival', difficulty: 'Very Easy' },
  'Bali/Indonesia': { docs: ['Valid Passport', 'Return Ticket', 'Hotel Booking', '$35 USD cash'], processing: 'On Arrival', fee: '₹2,900', type: 'Visa on Arrival', difficulty: 'Very Easy' },
};

export const VisaTracker = () => {
  const [selected, setSelected] = useState('Thailand');
  const [checklist, setChecklist] = useState({});
  const visa = VISA_DATA[selected];
  const diffColor = { 'Very Easy': '#10b981', Easy: '#10b981', Medium: '#f59e0b', Hard: '#ef4444' };

  const toggle = (doc) => setChecklist(c => ({ ...c, [`${selected}_${doc}`]: !c[`${selected}_${doc}`] }));
  const checked = visa?.docs.filter(d => checklist[`${selected}_${d}`]).length || 0;

  return (
    <section style={{ padding: '80px 6vw' }} id="visa-tracker">
      <div className="section-label">Travel Documents</div>
      <h2 className="section-title">Visa Document Tracker 🛂</h2>
      <p className="section-sub">Check required documents country-wise — never miss a document</p>

      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <select value={selected} onChange={e => setSelected(e.target.value)}
          style={{ width: '100%', padding: '12px 16px', background: '#1f1014', border: '1px solid rgba(225,29,72,0.2)', borderRadius: 12, color: 'white', fontFamily: 'DM Sans', fontSize: '0.95rem', marginBottom: 20 }}>
          {Object.keys(VISA_DATA).map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        {visa && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 12, marginBottom: 20 }}>
              {[['Type', visa.type, '#a78bfa'], ['Processing', visa.processing, '#f59e0b'], ['Fee', visa.fee, '#10b981'], ['Difficulty', visa.difficulty, diffColor[visa.difficulty]]].map(([label, val, color]) => (
                <div key={label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '12px 14px' }}>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem', marginBottom: 4 }}>{label}</div>
                  <div style={{ color, fontWeight: 700, fontSize: '0.88rem' }}>{val}</div>
                </div>
              ))}
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(225,29,72,0.12)', borderRadius: 14, padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ color: '#f43f5e', fontWeight: 700 }}>📋 Documents Checklist</div>
                <div style={{ color: '#10b981', fontSize: '0.82rem', fontWeight: 700 }}>{checked}/{visa.docs.length} ready</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 6, height: 6, marginBottom: 16 }}>
                <div style={{ background: 'linear-gradient(90deg,#f43f5e,#10b981)', height: '100%', borderRadius: 6, width: `${(checked / visa.docs.length) * 100}%`, transition: 'width 0.3s' }} />
              </div>
              {visa.docs.map(doc => (
                <label key={doc} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <input type="checkbox" checked={!!checklist[`${selected}_${doc}`]} onChange={() => toggle(doc)} style={{ accentColor: '#f43f5e', width: 16, height: 16 }} />
                  <span style={{ color: checklist[`${selected}_${doc}`] ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.8)', fontSize: '0.85rem', textDecoration: checklist[`${selected}_${doc}`] ? 'line-through' : 'none' }}>{doc}</span>
                </label>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};
