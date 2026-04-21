import React, { useState } from "react";
import "./faq.css";

const FAQ = () => {
  const [openItem, setOpenItem] = useState(null);

  const toggleItem = (index) => {
    setOpenItem(openItem === index ? null : index);
  };

  const faqData = [
    {
      question: "What is AI Travel Planner and how does it work?",
      answer: "AI Travel Planner is an AI-powered travel platform that creates personalized day-by-day itineraries. Simply enter your destination and travel dates, and our AI generates a complete trip plan with activities, accommodations, and local recommendations."
    },
    {
      question: "Is AI Travel Planner free to use?",
      answer: "Yes! We offer a free plan that includes basic itinerary creation and limited AI generations. Premium subscribers unlock unlimited AI itineraries, advanced collaboration, priority support, and the ability to invite unlimited travel companions."
    },
    {
      question: "How does the AI generate my itinerary?",
      answer: "Our AI analyzes your destination, travel dates, and preferences to build optimized daily schedules. It considers popular attractions, restaurant quality, logical routing, and typical visit durations to create realistic, enjoyable plans."
    },
    {
      question: "Can I invite friends to collaborate on my itinerary?",
      answer: "Absolutely! Our collaboration feature lets you invite travel companions via email. They can view your shared itinerary and stay updated. Premium users can invite unlimited companions to their trips."
    },
    {
      question: "Can I access my itinerary on my phone while traveling?",
      answer: "Yes! AI Travel Planner is fully mobile-responsive. Access your itineraries from any device with a browser — no app download required. Just log in and your trip plans are ready anywhere."
    },
    {
      question: "How do I share my itinerary with others?",
      answer: "You can share itineraries multiple ways: generate a shareable link for anyone to view, export to PDF for offline use, or invite specific companions via email for collaborative access."
    }
  ];

  return (
    <section className="faq-section" id="faq">
      <div className="center">
        <div className="section-label">FAQ</div>
        <h2 className="section-title">Frequently Asked Questions</h2>
        <p className="section-sub">Quick answers about AI Travel Planner.</p>
      </div>
      <div className="faq-grid">
        {faqData.map((item, index) => (
          <div 
            key={index} 
            className={`faq-item ${openItem === index ? 'open' : ''}`}
          >
            <div className="faq-q" onClick={() => toggleItem(index)}>
              {item.question}
              <span className="faq-icon">+</span>
            </div>
            <div className="faq-a">
              {item.answer}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;