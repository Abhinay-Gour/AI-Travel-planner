import React, { useState } from 'react';
import './TravelInsurance.css';

const PLANS = [
  {
    name: 'Bajaj Allianz Travel Care',
    logo: '🛡️',
    price: 299,
    coverage: '₹50 Lakh',
    features: ['Medical Emergency', 'Trip Cancellation', 'Baggage Loss', 'Flight Delay'],
    rating: 4.3,
    url: 'https://www.bajajallianz.com/travel-insurance.html',
    badge: 'Best Value',
    badgeColor: '#10b981',
  },
  {
    name: 'HDFC ERGO Travel Insurance',
    logo: '🏦',
    price: 499,
    coverage: '₹1 Crore',
    features: ['Medical Emergency', 'Trip Cancellation', 'Passport Loss', 'Adventure Sports', 'COVID Cover'],
    rating: 4.5,
    url: 'https://www.hdfcergo.com/travel-insurance',
    badge: 'Most Popular',
    badgeColor: '#f43f5e',
  },
  {
    name: 'Tata AIG Travel Guard',
    logo: '🔰',
    price: 399,
    coverage: '₹75 Lakh',
    features: ['Medical Emergency', 'Trip Cancellation', 'Baggage Loss', 'Home Burglary'],
    rating: 4.2,
    url: 'https://www.tataaig.com/travel-insurance',
    badge: '',
    badgeColor: '',
  },
  {
    name: 'PolicyBazaar Compare',
    logo: '📊',
    price: null,
    coverage: 'Multiple Plans',
    features: ['Compare 20+ Plans', 'Best Price Guarantee', 'Instant Policy', 'Claim Support'],
    rating: 4.6,
    url: 'https://www.policybazaar.com/travel-insurance/',
    badge: 'Compare All',
    badgeColor: '#a78bfa',
  },
];

const TravelInsurance = () => {
  const [expanded, setExpanded] = useState(null);

  return (
    <section className="insurance-section" id="insurance">
      <div className="section-label">Travel Safe</div>
      <h2 className="section-title">Travel Insurance 🛡️</h2>
      <p className="section-sub">Compare top plans — protect your trip from cancellations, medical emergencies & more</p>

      <div className="insurance-grid">
        {PLANS.map((plan, i) => (
          <div key={i} className="insurance-card">
            {plan.badge && (
              <div className="insurance-badge" style={{ background: plan.badgeColor }}>{plan.badge}</div>
            )}
            <div className="insurance-header">
              <span className="insurance-logo">{plan.logo}</span>
              <div>
                <div className="insurance-name">{plan.name}</div>
                <div className="insurance-rating">{'★'.repeat(Math.floor(plan.rating))} {plan.rating}/5</div>
              </div>
            </div>
            <div className="insurance-price">
              {plan.price ? <><span className="ins-from">From</span> <strong>₹{plan.price}</strong>/trip</> : <strong>Free Comparison</strong>}
            </div>
            <div className="insurance-coverage">Coverage: <strong>{plan.coverage}</strong></div>
            <ul className="insurance-features">
              {plan.features.map((f, j) => <li key={j}>✓ {f}</li>)}
            </ul>
            <a href={plan.url} target="_blank" rel="noopener noreferrer" className="insurance-btn">
              {plan.price ? 'Get Quote →' : 'Compare Plans →'}
            </a>
          </div>
        ))}
      </div>

      <div className="insurance-note">
        💡 Tip: Always buy insurance before your trip departs. Medical emergencies abroad can cost ₹5-50 Lakhs.
      </div>
    </section>
  );
};

export default TravelInsurance;
