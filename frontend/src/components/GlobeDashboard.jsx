import React, { useState } from 'react';
import { useAuthModal } from '../context/AuthModalContext';
import { useUser } from '../context/UserContext';
import './GlobeDashboard.css';

const CITIES = [
  { id: 1, name: 'Paris', country: 'France', x: 48.5, y: 32, desc: 'City of Love & Lights', tags: ['Romance', 'Art', 'Food'], img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=300&h=120&fit=crop' },
  { id: 2, name: 'Tokyo', country: 'Japan', x: 80, y: 35, desc: 'Neon lights & ancient temples', tags: ['Culture', 'Food', 'Tech'], img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=300&h=120&fit=crop' },
  { id: 3, name: 'New York', country: 'USA', x: 22, y: 34, desc: 'The city that never sleeps', tags: ['Urban', 'Art', 'Food'], img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=300&h=120&fit=crop' },
  { id: 4, name: 'Bali', country: 'Indonesia', x: 76, y: 58, desc: 'Temples, rice fields & beaches', tags: ['Beach', 'Spiritual', 'Nature'], img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=300&h=120&fit=crop' },
  { id: 5, name: 'Rome', country: 'Italy', x: 51, y: 36, desc: 'Eternal city of history', tags: ['History', 'Food', 'Art'], img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=300&h=120&fit=crop' },
  { id: 6, name: 'Dubai', country: 'UAE', x: 60, y: 42, desc: 'Luxury & desert adventures', tags: ['Luxury', 'Shopping', 'Desert'], img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=300&h=120&fit=crop' },
  { id: 7, name: 'London', country: 'UK', x: 46, y: 28, desc: 'Royal history & modern culture', tags: ['History', 'Culture', 'Food'], img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=300&h=120&fit=crop' },
  { id: 8, name: 'Goa', country: 'India', x: 64, y: 46, desc: 'Beaches, spice & Portuguese charm', tags: ['Beach', 'Party', 'Food'], img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=300&h=120&fit=crop' },
  { id: 9, name: 'Bangkok', country: 'Thailand', x: 74, y: 48, desc: 'Street food & golden temples', tags: ['Food', 'Culture', 'Budget'], img: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=300&h=120&fit=crop' },
  { id: 10, name: 'Sydney', country: 'Australia', x: 83, y: 72, desc: 'Opera House & harbour views', tags: ['Nature', 'Urban', 'Beach'], img: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=300&h=120&fit=crop' },
  { id: 11, name: 'Manali', country: 'India', x: 65, y: 36, desc: 'Snow peaks & adventure sports', tags: ['Adventure', 'Mountains', 'Nature'], img: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=300&h=120&fit=crop' },
  { id: 12, name: 'Singapore', country: 'Singapore', x: 75, y: 54, desc: 'Garden city of Asia', tags: ['Modern', 'Food', 'Shopping'], img: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=300&h=120&fit=crop' },
  { id: 13, name: 'Cairo', country: 'Egypt', x: 54, y: 42, desc: 'Pyramids & ancient wonders', tags: ['History', 'Desert', 'Culture'], img: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=300&h=120&fit=crop' },
  { id: 14, name: 'Barcelona', country: 'Spain', x: 46, y: 37, desc: 'Gaudi, beaches & tapas', tags: ['Art', 'Beach', 'Food'], img: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=300&h=120&fit=crop' },
  { id: 15, name: 'Maldives', country: 'Maldives', x: 66, y: 54, desc: 'Crystal waters & overwater villas', tags: ['Luxury', 'Beach', 'Romance'], img: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=300&h=120&fit=crop' },
  { id: 16, name: 'Kyoto', country: 'Japan', x: 79, y: 36, desc: 'Geishas, temples & cherry blossoms', tags: ['Culture', 'History', 'Nature'], img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=300&h=120&fit=crop' },
  { id: 17, name: 'Istanbul', country: 'Turkey', x: 55, y: 35, desc: 'Where East meets West', tags: ['History', 'Food', 'Culture'], img: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=300&h=120&fit=crop' },
  { id: 18, name: 'Jaipur', country: 'India', x: 65, y: 40, desc: 'Pink City of palaces & forts', tags: ['History', 'Culture', 'Shopping'], img: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=300&h=120&fit=crop' },
];

// Duplicate for infinite scroll
const SCROLL_CITIES = [...CITIES, ...CITIES];

const GlobeDashboard = ({ onSelectDestination }) => {
  const [hoveredCity, setHoveredCity] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const { isAuthenticated } = useUser();
  const { openAuth } = useAuthModal();

  const handleCityClick = (cityName) => {
    if (!isAuthenticated) { openAuth('login'); return; }
    onSelectDestination(cityName);
  };

  const handlePinHover = (city, e) => {
    const rect = e.currentTarget.closest('svg').getBoundingClientRect();
    const svgEl = e.currentTarget;
    const cx = parseFloat(svgEl.getAttribute('data-cx'));
    const cy = parseFloat(svgEl.getAttribute('data-cy'));
    setTooltipPos({ x: `${cx}%`, y: `${cy}%` });
    setHoveredCity(city);
  };

  return (
    <section className="globe-section" id="explore">
      <div className="globe-bg" />

      <div className="globe-header">
        <div className="section-label">Explore The World</div>
        <h2>Your Next Adventure<br />Starts Here</h2>
        <p>Click any city pin to instantly plan your trip with AI</p>
      </div>

      <div className="globe-container">
        <div className="globe-svg-wrap">
          <svg
            className="globe-svg"
            viewBox="0 0 1000 560"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Ocean background */}
            <rect className="ocean" width="1000" height="560" rx="16" />

            {/* Grid lines */}
            {[0,1,2,3,4,5,6].map(i => (
              <line key={`h${i}`} x1="0" y1={i*93} x2="1000" y2={i*93}
                stroke="rgba(225,29,72,0.06)" strokeWidth="1" />
            ))}
            {[0,1,2,3,4,5,6,7,8,9,10].map(i => (
              <line key={`v${i}`} x1={i*100} y1="0" x2={i*100} y2="560"
                stroke="rgba(225,29,72,0.06)" strokeWidth="1" />
            ))}

            {/* Simplified continent shapes */}
            {/* North America */}
            <path className="land" d="M80,80 L200,70 L230,100 L220,160 L180,200 L140,220 L100,200 L70,160 Z" />
            {/* South America */}
            <path className="land" d="M150,240 L210,230 L230,280 L220,360 L180,400 L140,380 L120,320 L130,270 Z" />
            {/* Europe */}
            <path className="land" d="M420,80 L520,75 L540,110 L510,150 L460,160 L420,140 L400,110 Z" />
            {/* Africa */}
            <path className="land" d="M440,170 L540,165 L570,220 L560,320 L510,380 L460,370 L420,300 L410,220 Z" />
            {/* Asia */}
            <path className="land" d="M540,60 L820,55 L860,100 L840,200 L780,240 L700,250 L620,220 L560,180 L530,130 Z" />
            {/* India subcontinent */}
            <path className="land" d="M620,200 L680,195 L700,250 L670,310 L630,300 L610,250 Z" />
            {/* Southeast Asia */}
            <path className="land" d="M720,230 L800,220 L820,270 L780,300 L730,280 Z" />
            {/* Australia */}
            <path className="land" d="M760,380 L880,370 L900,430 L860,480 L790,470 L750,430 Z" />
            {/* Japan */}
            <path className="land" d="M800,130 L830,125 L840,155 L815,165 L795,150 Z" />
            {/* UK */}
            <path className="land" d="M440,100 L460,95 L465,125 L445,130 Z" />
            {/* Indonesia */}
            <path className="land" d="M740,310 L800,305 L810,330 L770,340 Z" />

            {/* City Pins */}
            {CITIES.map(city => {
              const cx = city.x * 10;
              const cy = city.y * 5.6;
              return (
                <g
                  key={city.id}
                  className="city-pin"
                  data-cx={city.x}
                  data-cy={city.y}
                  onClick={() => handleCityClick(`${city.name}, ${city.country}`)}
                  onMouseEnter={(e) => handlePinHover(city, e)}
                  onMouseLeave={() => setHoveredCity(null)}
                >
                  <circle className="pin-ring" cx={cx} cy={cy} r="4" />
                  <circle className="pin-dot" cx={cx} cy={cy} r="4" />
                  <text className="pin-label" x={cx + 6} y={cy - 4}>{city.name}</text>
                </g>
              );
            })}
          </svg>

          {/* Tooltip */}
          {hoveredCity && (
            <div
              className="city-tooltip"
              style={{ left: tooltipPos.x, top: tooltipPos.y }}
            >
              <img className="tooltip-img" src={hoveredCity.img} alt={hoveredCity.name}
                onError={e => e.target.style.display='none'} />
              <div className="tooltip-name">{hoveredCity.name}</div>
              <div className="tooltip-country">📍 {hoveredCity.country}</div>
              <div className="tooltip-desc">{hoveredCity.desc}</div>
              <div className="tooltip-tags">
                {hoveredCity.tags.map(t => <span key={t} className="tooltip-tag">{t}</span>)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Auto-scrolling city cards */}
      <div className="city-cards-scroll">
        <div className="city-cards-track">
          {SCROLL_CITIES.map((city, i) => (
            <div
              key={`${city.id}-${i}`}
              className="city-mini-card"
              onClick={() => handleCityClick(`${city.name}, ${city.country}`)}
            >
              <img
                className="city-mini-img"
                src={city.img}
                alt={city.name}
                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=300&h=100&fit=crop'; }}
              />
              <div className="city-mini-info">
                <div className="city-mini-name">{city.name}</div>
                <div className="city-mini-country">{city.country}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GlobeDashboard;
