import React, { useState, useEffect, useMemo } from 'react';
import './ExtraFeatures.css';

const BASE_CURRENCY = import.meta.env.VITE_EXCHANGERATE_BASE || 'INR';

const CURRENCY_NAMES = {
  INR:'Indian Rupee', USD:'US Dollar', EUR:'Euro', GBP:'British Pound',
  JPY:'Japanese Yen', AED:'UAE Dirham', SGD:'Singapore Dollar',
  THB:'Thai Baht', IDR:'Indonesian Rupiah', MYR:'Malaysian Ringgit',
  AUD:'Australian Dollar', CAD:'Canadian Dollar', CHF:'Swiss Franc',
  CNY:'Chinese Yuan', KRW:'South Korean Won', MXN:'Mexican Peso',
  BRL:'Brazilian Real', ZAR:'South African Rand',
};

const ALL_CURRENCIES = Object.keys(CURRENCY_NAMES);
const POPULAR = ['USD','EUR','GBP','JPY','AED','SGD','THB'];

let ratesCache = null;
let cacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const CurrencyConverter = () => {
  const [amount, setAmount] = useState(10000);
  const [from, setFrom] = useState('INR');
  const [to, setTo] = useState('USD');

  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch real rates
  useEffect(() => {
    const fetchRates = async () => {
      if (ratesCache && Date.now() - cacheTime < CACHE_DURATION) {
        setRates(ratesCache);
        setError(null);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${BASE_CURRENCY}`);
        const data = await res.json();
        if (data.rates) {
          ratesCache = data.rates;
          // Always include base currency with rate 1
          if (!ratesCache[BASE_CURRENCY]) ratesCache[BASE_CURRENCY] = 1;
          cacheTime = Date.now();
          setRates(data.rates);
          setError(null);
        } else {
          setError('Could not load rates');
        }
      } catch (err) {
        console.error('Currency API error:', err);
        setError('Failed to load rates (using cached)');
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  const result = useMemo(() => {
    if (!rates[from] || !rates[to]) return 0;
    const inBase = amount / rates[from];
    return (inBase * rates[to]).toFixed(2);
  }, [amount, from, to, rates]);

  const swap = () => { const tmp = from; setFrom(to); setTo(tmp); };

  const fmt = (n) => Number(n).toLocaleString('en-IN', { maximumFractionDigits: 2 });

  return (
    <section className="currency-section" id="currency">
      <div className="section-label">Money Matters</div>
      <h2 className="section-title">Currency Converter</h2>
      <p className="section-sub">Live exchange rates — plan your travel budget</p>

      <div className="currency-widget">
        <div className="currency-row">
          <div className="currency-field">
            <label>Amount</label>
            <input type="number" value={amount} onChange={e => setAmount(+e.target.value)} min="1" />
          </div>
          <div className="currency-field">
            <label>From</label>
        <select value={from} onChange={e => setFrom(e.target.value)}>
          {ALL_CURRENCIES.map(c => <option key={c} value={c}>{c} — {CURRENCY_NAMES[c]}</option>)}
        </select>
          </div>
          <button className="currency-swap" onClick={swap} title="Swap currencies">⇄</button>
          <div className="currency-field">
            <label>To</label>
        <select value={to} onChange={e => setTo(e.target.value)}>
          {ALL_CURRENCIES.map(c => <option key={c} value={c}>{c} — {CURRENCY_NAMES[c]}</option>)}
        </select>
          </div>
        </div>

        <div className="currency-result">
          {loading ? (
            <div style={{textAlign:'center',padding:'20px',color:'rgba(255,255,255,0.6)'}}>⏳ Loading live rates...</div>
          ) : error ? (
            <div style={{textAlign:'center',padding:'20px',color:'rgba(255,255,255,0.6)'}}>⚠️ {error}</div>
          ) : (
            <>
              <div className="currency-result-amount">{fmt(result)} {to}</div>
              <div className="currency-result-label">{fmt(amount)} {from} = {fmt(result)} {to}</div>
              <div className="currency-rate-note">
                1 {from} = {(rates[to] / rates[from] || 0).toFixed(4)} {to} · 
                <span style={{color:'#10b981'}}> Live Rates</span> 
                {ratesCache && <span style={{fontSize:'0.75rem'}}> (cached)</span>}
              </div>
            </>
          )}
        </div>

        <div className="popular-currencies">
          <span style={{fontSize:'0.75rem',color:'rgba(255,255,255,0.4)',alignSelf:'center'}}>Quick:</span>
          {POPULAR.map(c => (
            <button key={c} className="curr-chip" onClick={() => setTo(c)}>
              {c}: {rates[c] ? fmt((amount / rates[from]) * rates[c]) : '–'}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CurrencyConverter;
