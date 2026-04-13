import React, { useState, useMemo } from 'react';
import './CostCalculator.css';

const COST_DATA = {
  destinations: {
    'Goa, India':        { hotel: 3000, food: 1200, transport: 800,  activity: 1500 },
    'Manali, India':     { hotel: 2500, food: 1000, transport: 1200, activity: 1000 },
    'Bali, Indonesia':   { hotel: 5000, food: 2000, transport: 1500, activity: 2500 },
    'Bangkok, Thailand': { hotel: 4000, food: 1500, transport: 1200, activity: 2000 },
    'Paris, France':     { hotel: 12000, food: 5000, transport: 3000, activity: 4000 },
    'Tokyo, Japan':      { hotel: 10000, food: 4000, transport: 2500, activity: 3500 },
    'Dubai, UAE':        { hotel: 15000, food: 6000, transport: 2000, activity: 5000 },
    'Singapore':         { hotel: 11000, food: 4500, transport: 2000, activity: 4000 },
    'Maldives':          { hotel: 25000, food: 8000, transport: 5000, activity: 6000 },
    'Other':             { hotel: 5000, food: 2000, transport: 1500, activity: 2000 }
  },
  travelStyle: {
    budget:  0.6,
    mid:     1.0,
    luxury:  2.2
  }
};

const CostCalculator = () => {
  const [dest, setDest] = useState('Bali, Indonesia');
  const [days, setDays] = useState(5);
  const [people, setPeople] = useState(2);
  const [style, setStyle] = useState('mid');
  const [flightCost, setFlightCost] = useState(15000);

  const breakdown = useMemo(() => {
    const base = COST_DATA.destinations[dest] || COST_DATA.destinations['Other'];
    const multiplier = COST_DATA.travelStyle[style];

    const hotel = Math.round(base.hotel * multiplier * days);
    const food = Math.round(base.food * multiplier * days * people);
    const transport = Math.round(base.transport * multiplier * days);
    const activity = Math.round(base.activity * multiplier * days);
    const flight = flightCost * people;
    const misc = Math.round((hotel + food + transport + activity) * 0.1);
    const total = hotel + food + transport + activity + flight + misc;
    const perPerson = Math.round(total / people);

    return { hotel, food, transport, activity, flight, misc, total, perPerson };
  }, [dest, days, people, style, flightCost]);

  const fmt = (n) => `₹${n.toLocaleString('en-IN')}`;

  const items = [
    { label: '🏨 Hotel', value: breakdown.hotel },
    { label: '🍽️ Food', value: breakdown.food },
    { label: '✈️ Flights', value: breakdown.flight },
    { label: '🚌 Transport', value: breakdown.transport },
    { label: '🎭 Activities', value: breakdown.activity },
    { label: '🛍️ Misc/Shopping', value: breakdown.misc }
  ];

  const maxVal = Math.max(...items.map(i => i.value));

  return (
    <section className="calc-section" id="calculator">
      <div className="section-label">Budget Planner</div>
      <h2 className="section-title">Trip Cost Calculator</h2>
      <p className="section-sub">Get an instant estimate in ₹ before you book</p>

      <div className="calc-wrapper">
        <div className="calc-inputs">
          <div className="calc-group">
            <label>Destination</label>
            <select value={dest} onChange={e => setDest(e.target.value)}>
              {Object.keys(COST_DATA.destinations).map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="calc-row">
            <div className="calc-group">
              <label>Days: <strong>{days}</strong></label>
              <input type="range" min="1" max="30" value={days} onChange={e => setDays(+e.target.value)} />
            </div>
            <div className="calc-group">
              <label>People: <strong>{people}</strong></label>
              <input type="range" min="1" max="10" value={people} onChange={e => setPeople(+e.target.value)} />
            </div>
          </div>

          <div className="calc-group">
            <label>Travel Style</label>
            <div className="style-btns">
              {['budget', 'mid', 'luxury'].map(s => (
                <button
                  key={s}
                  className={`style-btn ${style === s ? 'active' : ''}`}
                  onClick={() => setStyle(s)}
                >
                  {s === 'budget' ? '💸 Budget' : s === 'mid' ? '💳 Mid-Range' : '💎 Luxury'}
                </button>
              ))}
            </div>
          </div>

          <div className="calc-group">
            <label>Flight Cost per person: <strong>{fmt(flightCost)}</strong></label>
            <input
              type="range"
              min="3000"
              max="100000"
              step="1000"
              value={flightCost}
              onChange={e => setFlightCost(+e.target.value)}
            />
          </div>
        </div>

        <div className="calc-results">
          <div className="total-box">
            <div className="total-label">Total Trip Cost</div>
            <div className="total-amount">{fmt(breakdown.total)}</div>
            <div className="per-person">{fmt(breakdown.perPerson)} per person · {days} days · {people} {people === 1 ? 'person' : 'people'}</div>
          </div>

          <div className="breakdown-bars">
            {items.map(item => (
              <div key={item.label} className="bar-row">
                <span className="bar-label">{item.label}</span>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{ width: `${(item.value / maxVal) * 100}%` }}
                  />
                </div>
                <span className="bar-value">{fmt(item.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CostCalculator;
