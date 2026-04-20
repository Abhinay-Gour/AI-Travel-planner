import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const BudgetOptimizer = () => {
  const [destination, setDestination] = useState('');
  const [budget, setBudget] = useState('');
  const [days, setDays] = useState('');
  const [style, setStyle] = useState('budget');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const optimize = async () => {
    if (!destination || !budget || !days) return;
    setLoading(true);
    setResult(null);
    try {
      let tips = '';
      if (API_KEY) {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const prompt = `You are a budget travel expert for Indians. 
Destination: ${destination}, Budget: ₹${budget}, Days: ${days}, Style: ${style}

Give EXACTLY this format (no extra text):
VERDICT: [Comfortable/Tight/Very Tight/Generous]
DAILY_BUDGET: ₹[amount]/day
SAVE_ON: [3 specific ways to save money, comma separated]
SPLURGE_ON: [2 things worth spending on, comma separated]
TIP1: [specific money saving tip]
TIP2: [specific money saving tip]
TIP3: [specific money saving tip]
CHEAPER_ALT: [one cheaper alternative destination with similar vibe]`;
        const res = await model.generateContent(prompt);
        tips = res.response.text();
      } else {
        tips = `VERDICT: Comfortable\nDAILY_BUDGET: ₹${Math.round(budget/days)}/day\nSAVE_ON: Local transport, Street food, Shared accommodation\nSPLURGE_ON: One special experience, Local cuisine\nTIP1: Book trains 60 days in advance for best prices\nTIP2: Eat at local dhabas instead of tourist restaurants\nTIP3: Use public transport instead of taxis\nCHEAPER_ALT: Pondicherry`;
      }

      const parse = (key) => {
        const match = tips.match(new RegExp(`${key}:\\s*(.+)`));
        return match ? match[1].trim() : '';
      };

      setResult({
        verdict: parse('VERDICT'),
        dailyBudget: parse('DAILY_BUDGET'),
        saveOn: parse('SAVE_ON').split(',').map(s => s.trim()).filter(Boolean),
        splurgeOn: parse('SPLURGE_ON').split(',').map(s => s.trim()).filter(Boolean),
        tips: [parse('TIP1'), parse('TIP2'), parse('TIP3')].filter(Boolean),
        cheaperAlt: parse('CHEAPER_ALT'),
      });
    } catch { setResult(null); }
    finally { setLoading(false); }
  };

  const verdictColor = { Comfortable: '#10b981', Tight: '#f59e0b', 'Very Tight': '#ef4444', Generous: '#a78bfa' };

  return (
    <section style={{ padding: '80px 6vw' }} id="budget-optimizer">
      <div className="section-label">Smart Planning</div>
      <h2 className="section-title">AI Budget Optimizer 💡</h2>
      <p className="section-sub">Enter your budget — AI will tell you how to make the most of it</p>

      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 12, marginBottom: 16 }}>
          <div>
            <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', display: 'block', marginBottom: 6 }}>Destination</label>
            <input value={destination} onChange={e => setDestination(e.target.value)} placeholder="Goa, Manali, Bali..." style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(225,29,72,0.2)', borderRadius: 10, color: 'white', fontFamily: 'DM Sans', fontSize: '0.9rem', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', display: 'block', marginBottom: 6 }}>Total Budget (₹)</label>
            <input type="number" value={budget} onChange={e => setBudget(e.target.value)} placeholder="25000" style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(225,29,72,0.2)', borderRadius: 10, color: 'white', fontFamily: 'DM Sans', fontSize: '0.9rem', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', display: 'block', marginBottom: 6 }}>Days</label>
            <input type="number" value={days} onChange={e => setDays(e.target.value)} placeholder="5" style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(225,29,72,0.2)', borderRadius: 10, color: 'white', fontFamily: 'DM Sans', fontSize: '0.9rem', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', display: 'block', marginBottom: 6 }}>Travel Style</label>
            <select value={style} onChange={e => setStyle(e.target.value)} style={{ width: '100%', padding: '10px 14px', background: '#1f1014', border: '1px solid rgba(225,29,72,0.2)', borderRadius: 10, color: 'white', fontFamily: 'DM Sans', fontSize: '0.9rem', boxSizing: 'border-box' }}>
              <option value="budget">💸 Budget</option>
              <option value="mid-range">💳 Mid-Range</option>
              <option value="luxury">💎 Luxury</option>
            </select>
          </div>
        </div>

        <button onClick={optimize} disabled={loading || !destination || !budget || !days}
          style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg,#f43f5e,#9f1239)', border: 'none', borderRadius: 12, color: 'white', fontFamily: 'DM Sans', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
          {loading ? '⏳ AI Analyzing...' : '🤖 Optimize My Budget'}
        </button>

        {result && (
          <div style={{ marginTop: 24, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(225,29,72,0.15)', borderRadius: 16, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>Budget Verdict</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: verdictColor[result.verdict] || '#f43f5e' }}>{result.verdict}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>Daily Budget</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f43f5e' }}>{result.dailyBudget}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 12, padding: 16 }}>
                <div style={{ color: '#10b981', fontWeight: 700, marginBottom: 8, fontSize: '0.85rem' }}>💚 Save Money On</div>
                {result.saveOn.map((s, i) => <div key={i} style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.82rem', marginBottom: 4 }}>• {s}</div>)}
              </div>
              <div style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: 12, padding: 16 }}>
                <div style={{ color: '#f43f5e', fontWeight: 700, marginBottom: 8, fontSize: '0.85rem' }}>❤️ Worth Splurging On</div>
                {result.splurgeOn.map((s, i) => <div key={i} style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.82rem', marginBottom: 4 }}>• {s}</div>)}
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ color: '#f43f5e', fontWeight: 700, marginBottom: 10, fontSize: '0.85rem' }}>💡 AI Money Tips</div>
              {result.tips.map((t, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8, alignItems: 'flex-start' }}>
                  <span style={{ background: 'rgba(244,63,94,0.15)', color: '#f43f5e', borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>{i+1}</span>
                  <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', lineHeight: 1.5 }}>{t}</span>
                </div>
              ))}
            </div>

            {result.cheaperAlt && (
              <div style={{ background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: 10, padding: '12px 16px' }}>
                <span style={{ color: '#a78bfa', fontWeight: 700, fontSize: '0.82rem' }}>🔄 Cheaper Alternative: </span>
                <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.82rem' }}>{result.cheaperAlt}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default BudgetOptimizer;
