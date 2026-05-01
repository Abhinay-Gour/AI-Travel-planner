import React, { useState } from "react";
import "./faq.css";

const FAQ_DATA = [
  {
    q: "How does the AI trip planner work?",
    a: "Enter your destination and travel dates — our AI generates a complete day-by-day itinerary with activities, timings, local food, and travel tips in under 30 seconds. Powered by Google Gemini AI."
  },
  {
    q: "Is it free to use?",
    a: "Yes! The free plan lets you generate AI trip plans. Paid plans (Basic ₹499, Pro ₹999, Unlimited ₹1999) give you more trip generations per month."
  },
  {
    q: "Will I get the trip plan on email and WhatsApp?",
    a: "Yes — the moment your trip is generated, it's automatically sent to your registered email and WhatsApp number. No manual sharing needed."
  },
  {
    q: "Can I download my trip plan as PDF?",
    a: "Yes! Every generated trip plan has a 'Download PDF' button. The PDF includes the full day-by-day itinerary, budget estimate, and travel tips."
  },
  {
    q: "What tools are available besides trip planning?",
    a: "We offer a live Currency Converter (18+ currencies), Visa Document Tracker (country-wise checklist), Travel Checklist, Cost Calculator, Festival Calendar, and a Smart Packing List."
  },
  {
    q: "Is my data safe?",
    a: "Yes. We use JWT authentication, bcrypt password hashing, and HTTPS. Your personal data is never shared with third parties."
  },
  {
    q: "Can I use it on mobile?",
    a: "Absolutely. The site is fully mobile-responsive with a bottom navigation bar for easy access on phones. No app download needed."
  },
  {
    q: "How do I reset my password?",
    a: "Click 'Forgot password?' on the login screen. Enter your email and you'll receive a reset link within seconds. The link expires in 10 minutes."
  }
];

const FAQ = () => {
  const [open, setOpen] = useState(null);

  return (
    <section className="faq-section" id="faq">
      <div className="center">
        <div className="section-label">FAQ</div>
        <h2 className="section-title">Frequently Asked Questions</h2>
        <p className="section-sub">Everything you need to know about AI Travel Planner.</p>
      </div>
      <div className="faq-grid">
        {FAQ_DATA.map((item, i) => (
          <div key={i} className={`faq-item ${open === i ? 'open' : ''}`} onClick={() => setOpen(open === i ? null : i)}>
            <div className="faq-q">
              {item.q}
              <span className="faq-icon">+</span>
            </div>
            <div className="faq-a">{item.a}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
