import React, { useState } from 'react';
import './ExtraFeatures.css';

const DEST_DATA = {
  'Goa, India': { img:'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=300&h=140&fit=crop', budget:'₹15k–25k/5days', weather:'Oct–Mar best', visa:'No visa (Indian)', season:'Winter', safety:'Safe', food:'Seafood, Vindaloo', lang:'Konkani/English', flight:'₹3,500–6,000' },
  'Manali, India': { img:'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=300&h=140&fit=crop', budget:'₹20k–35k/7days', weather:'May–Jun, Oct–Nov', visa:'No visa (Indian)', season:'Summer/Autumn', safety:'Safe', food:'Siddu, Trout Fish', lang:'Hindi/Pahari', flight:'₹4,000–7,000' },
  'Bali, Indonesia': { img:'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=300&h=140&fit=crop', budget:'₹45k–70k/7days', weather:'Apr–Oct best', visa:'Visa on Arrival', season:'Dry Season', safety:'Very Safe', food:'Nasi Goreng, Satay', lang:'Bahasa/English', flight:'₹18,000–30,000' },
  'Paris, France': { img:'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=300&h=140&fit=crop', budget:'₹1.5L–2.5L/7days', weather:'Apr–Jun, Sep–Oct', visa:'Schengen Visa', season:'Spring/Autumn', safety:'Moderate', food:'Croissant, Escargot', lang:'French/English', flight:'₹45,000–80,000' },
  'Tokyo, Japan': { img:'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=300&h=140&fit=crop', budget:'₹1.2L–2L/7days', weather:'Mar–May, Sep–Nov', visa:'e-Visa', season:'Spring/Autumn', safety:'Very Safe', food:'Sushi, Ramen', lang:'Japanese/English', flight:'₹35,000–60,000' },
  'Dubai, UAE': { img:'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=300&h=140&fit=crop', budget:'₹80k–1.5L/5days', weather:'Oct–Apr best', visa:'Visa on Arrival', season:'Winter', safety:'Very Safe', food:'Shawarma, Hummus', lang:'Arabic/English', flight:'₹12,000–22,000' },
  'Jaipur, India': { img:'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=300&h=140&fit=crop', budget:'₹12k–20k/4days', weather:'Oct–Mar best', visa:'No visa (Indian)', season:'Winter', safety:'Safe', food:'Dal Baati, Ghewar', lang:'Hindi/Rajasthani', flight:'₹2,500–5,000' },
  'Singapore': { img:'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=300&h=140&fit=crop', budget:'₹70k–1.2L/5days', weather:'Year-round', visa:'Visa on Arrival', season:'Any', safety:'Extremely Safe', food:'Chilli Crab, Laksa', lang:'English/Mandarin', flight:'₹15,000–28,000' },
};

const DESTINATIONS = Object.keys(DEST_DATA);
const COMPARE_KEYS = [
  { key:'budget', label:'💰 Budget' },
  { key:'weather', label:'🌤️ Best Weather' },
  { key:'visa', label:'🛂 Visa' },
  { key:'season', label:'🗓️ Best Season' },
  { key:'safety', label:'🛡️ Safety' },
  { key:'food', label:'🍽️ Famous Food' },
  { key:'lang', label:'🗣️ Language' },
  { key:'flight', label:'✈️ Flight Cost' },
];

const getValClass = (key, val) => {
  if (key === 'visa') {
    if (val.includes('No visa')) return 'good';
    if (val.includes('Arrival') || val.includes('e-Visa')) return 'warn';
    return 'bad';
  }
  if (key === 'safety') {
    if (val.includes('Extremely') || val.includes('Very')) return 'good';
    if (val === 'Safe') return 'good';
    return 'warn';
  }
  return '';
};

const TripComparison = () => {
  const [selected, setSelected] = useState(['Goa, India', 'Bali, Indonesia', 'Paris, France']);

  const updateDest = (index, val) => {
    const updated = [...selected];
    updated[index] = val;
    setSelected(updated);
  };

  return (
    <section className="compare-section" id="compare">
      <div className="section-label">Compare Destinations</div>
      <h2 className="section-title">Side-by-Side Comparison</h2>
      <p className="section-sub">Compare up to 3 destinations — budget, visa, weather & more</p>

      <div className="compare-select-row">
        {selected.map((dest, i) => (
          <select key={i} className="compare-select" value={dest} onChange={e => updateDest(i, e.target.value)}>
            {DESTINATIONS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        ))}
      </div>

      <div className="compare-grid">
        {selected.map((dest, i) => {
          const data = DEST_DATA[dest];
          if (!data) return null;
          return (
            <div key={i} className="compare-card">
              <img className="compare-card-img" src={data.img} alt={dest} onError={e => { e.target.style.display='none'; }} />
              <div className="compare-card-body">
                <div className="compare-dest-name">{dest}</div>
                {COMPARE_KEYS.map(({ key, label }) => (
                  <div key={key} className="compare-row">
                    <span className="compare-key">{label}</span>
                    <span className={`compare-val ${getValClass(key, data[key])}`}>{data[key]}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default TripComparison;
