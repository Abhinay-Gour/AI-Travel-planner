import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { initiatePayment } from '../services/paymentService';
import './pricing.css';

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 499,
    trips: 5,
    features: ['5 AI Trip Plans', 'Email Delivery', 'Basic Itinerary', '7-day Support'],
    popular: false
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 999,
    trips: 20,
    features: ['20 AI Trip Plans', 'Email + SMS Delivery', 'Detailed Itinerary', 'Weather Data', 'Priority Support'],
    popular: true
  },
  {
    id: 'unlimited',
    name: 'Unlimited',
    price: 1999,
    trips: -1,
    features: ['Unlimited Trip Plans', 'Email + SMS Delivery', 'Full Itinerary', 'Weather Data', '24/7 Support'],
    popular: false
  }
];

const Pricing = () => {
  const { user, isAuthenticated } = useUser();
  const [loading, setLoading] = useState(null);
  const [message, setMessage] = useState('');

  const handlePayment = async (planId) => {
    if (!isAuthenticated) {
      setMessage('Please login first to purchase a plan.');
      return;
    }

    setLoading(planId);
    setMessage('');

    try {
      await initiatePayment(planId, {
        name: user?.name,
        email: user?.email,
        phone: user?.phone
      });
      setMessage('🎉 Payment successful! Plan activated. Check your email & WhatsApp!');
    } catch (err) {
      if (err.message === 'Payment cancelled') {
        setMessage('Payment was cancelled.');
      } else {
        setMessage('Payment failed. Please try again.');
      }
    } finally {
      setLoading(null);
    }
  };

  return (
    <section className="pricing-section" id="pricing">
      <div className="section-label">Pricing</div>
      <h2 className="section-title">Choose Your Plan</h2>
      <p className="section-sub">Start free, upgrade when you need more trips</p>

      {message && (
        <div className={`pricing-message ${message.includes('successful') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <div className="pricing-cards">
        {plans.map((plan) => (
          <div key={plan.id} className={`pricing-card ${plan.popular ? 'popular' : ''}`}>
            {plan.popular && <div className="popular-badge">Most Popular</div>}
            <h3>{plan.name}</h3>
            <div className="price">
              <span className="currency">₹</span>
              <span className="amount">{plan.price}</span>
              <span className="period">/month</span>
            </div>
            <p className="trips-count">
              {plan.trips === -1 ? 'Unlimited' : plan.trips} Trip Plans
            </p>
            <ul className="features-list">
              {plan.features.map((f, i) => (
                <li key={i}>✓ {f}</li>
              ))}
            </ul>
            <button
              className={`plan-btn ${plan.popular ? 'plan-btn-primary' : 'plan-btn-secondary'}`}
              onClick={() => handlePayment(plan.id)}
              disabled={loading === plan.id}
            >
              {loading === plan.id ? 'Processing...' : `Get ${plan.name}`}
            </button>
          </div>
        ))}
      </div>

      <p className="pricing-note">🔒 Secure payments via Razorpay · UPI, Cards, NetBanking accepted</p>
    </section>
  );
};

export default Pricing;
