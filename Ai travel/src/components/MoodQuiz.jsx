import React, { useState } from 'react';
import './MoodQuiz.css';

const questions = [
  {
    id: 1,
    question: "What's your ideal vibe for this trip?",
    options: [
      { emoji: '🏖️', label: 'Relax & Chill', value: 'relax' },
      { emoji: '🧗', label: 'Adventure & Thrill', value: 'adventure' },
      { emoji: '🏛️', label: 'Culture & History', value: 'culture' },
      { emoji: '🍜', label: 'Food & Nightlife', value: 'food' }
    ]
  },
  {
    id: 2,
    question: "How long do you want to travel?",
    options: [
      { emoji: '⚡', label: 'Weekend (2-3 days)', value: 'short' },
      { emoji: '📅', label: '1 Week', value: 'week' },
      { emoji: '🗓️', label: '2 Weeks', value: 'twoweek' },
      { emoji: '🌍', label: 'Month+', value: 'long' }
    ]
  },
  {
    id: 3,
    question: "What's your budget range?",
    options: [
      { emoji: '💸', label: 'Budget (₹20k-50k)', value: 'budget' },
      { emoji: '💳', label: 'Mid-Range (₹50k-1L)', value: 'mid' },
      { emoji: '💎', label: 'Luxury (₹1L-3L)', value: 'luxury' },
      { emoji: '🚀', label: 'No Limit!', value: 'unlimited' }
    ]
  },
  {
    id: 4,
    question: "Who are you traveling with?",
    options: [
      { emoji: '🧍', label: 'Solo', value: 'solo' },
      { emoji: '💑', label: 'Couple', value: 'couple' },
      { emoji: '👨‍👩‍👧', label: 'Family', value: 'family' },
      { emoji: '👯', label: 'Friends Group', value: 'friends' }
    ]
  }
];

const getDestinations = (answers) => {
  const { vibe, duration, budget, companion } = answers;

  const allDests = {
    relax: {
      budget: ['Goa, India', 'Pondicherry, India', 'Varkala, Kerala'],
      mid: ['Bali, Indonesia', 'Phuket, Thailand', 'Maldives'],
      luxury: ['Maldives', 'Santorini, Greece', 'Bora Bora'],
      unlimited: ['Amalfi Coast, Italy', 'Seychelles', 'Fiji Islands']
    },
    adventure: {
      budget: ['Rishikesh, India', 'Manali, India', 'Coorg, Karnataka'],
      mid: ['Nepal Trekking', 'New Zealand', 'Costa Rica'],
      luxury: ['Patagonia, Argentina', 'Iceland', 'Swiss Alps'],
      unlimited: ['Antarctica Expedition', 'Amazon Rainforest', 'Everest Base Camp']
    },
    culture: {
      budget: ['Varanasi, India', 'Jaipur, India', 'Hampi, Karnataka'],
      mid: ['Rome, Italy', 'Kyoto, Japan', 'Istanbul, Turkey'],
      luxury: ['Paris, France', 'Tokyo, Japan', 'Barcelona, Spain'],
      unlimited: ['Egypt & Pyramids', 'Machu Picchu, Peru', 'Angkor Wat, Cambodia']
    },
    food: {
      budget: ['Mumbai, India', 'Bangkok, Thailand', 'Kolkata, India'],
      mid: ['Tokyo, Japan', 'Barcelona, Spain', 'Mexico City'],
      luxury: ['Paris, France', 'Singapore', 'New York, USA'],
      unlimited: ['Copenhagen, Denmark', 'San Sebastian, Spain', 'Hong Kong']
    }
  };

  const vibeKey = vibe || 'culture';
  const budgetKey = budget || 'mid';
  const dests = allDests[vibeKey]?.[budgetKey] || ['Paris, France', 'Bali, Indonesia', 'Tokyo, Japan'];

  return dests.map((dest, i) => ({
    name: dest,
    match: 98 - i * 7,
    tags: [vibeKey, budgetKey, companion || 'solo'].filter(Boolean)
  }));
};

const MoodQuiz = ({ onSelectDestination }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);

  const handleAnswer = (questionKey, value) => {
    const keys = ['vibe', 'duration', 'budget', 'companion'];
    const newAnswers = { ...answers, [keys[step]]: value };
    setAnswers(newAnswers);

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setResults(getDestinations(newAnswers));
    }
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
    setResults(null);
  };

  const handlePick = (dest) => {
    onSelectDestination(dest.name);
    setIsOpen(false);
    reset();
  };

  if (!isOpen) {
    return (
      <button className="mood-trigger-btn" onClick={() => setIsOpen(true)}>
        🎯 Not sure where to go? Take the Mood Quiz
      </button>
    );
  }

  return (
    <div className="mood-overlay">
      <div className="mood-modal">
        <button className="mood-close" onClick={() => { setIsOpen(false); reset(); }}>×</button>

        {!results ? (
          <>
            <div className="mood-progress">
              {questions.map((_, i) => (
                <div key={i} className={`progress-dot ${i <= step ? 'active' : ''}`} />
              ))}
            </div>
            <div className="mood-question">
              <h3>{questions[step].question}</h3>
              <p className="mood-step">Question {step + 1} of {questions.length}</p>
            </div>
            <div className="mood-options">
              {questions[step].options.map((opt) => (
                <button
                  key={opt.value}
                  className="mood-option"
                  onClick={() => handleAnswer(questions[step].id, opt.value)}
                >
                  <span className="opt-emoji">{opt.emoji}</span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <h3 className="results-title">🎉 Your Perfect Destinations!</h3>
            <p className="results-sub">Based on your travel personality</p>
            <div className="mood-results">
              {results.map((dest, i) => (
                <div key={i} className="result-card">
                  <div className="result-info">
                    <h4>{dest.name}</h4>
                    <div className="result-tags">
                      {dest.tags.map(t => <span key={t} className="tag">{t}</span>)}
                    </div>
                  </div>
                  <div className="result-right">
                    <div className="match-score">{dest.match}% match</div>
                    <button className="pick-btn" onClick={() => handlePick(dest)}>
                      Plan This Trip →
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button className="retake-btn" onClick={reset}>↩ Retake Quiz</button>
          </>
        )}
      </div>
    </div>
  );
};

export default MoodQuiz;
