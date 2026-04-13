import React, { useState, useEffect } from 'react';
import './PackingList.css';

const DEFAULT_ITEMS = {
  '📄 Documents': ['Passport/ID', 'Visa documents', 'Travel insurance', 'Hotel bookings', 'Flight tickets', 'Emergency contacts'],
  '👕 Clothing': ['T-shirts (3-5)', 'Pants/Jeans (2-3)', 'Underwear & socks', 'Sleepwear', 'Formal outfit', 'Rain jacket', 'Comfortable shoes', 'Sandals/Flip flops'],
  '💊 Health & Safety': ['Prescription medicines', 'Pain relievers', 'Band-aids & antiseptic', 'Sunscreen SPF 50+', 'Insect repellent', 'Hand sanitizer', 'Face masks'],
  '🔌 Electronics': ['Phone + charger', 'Power bank', 'Universal adapter', 'Earphones/Headphones', 'Camera', 'Laptop (if needed)'],
  '🧴 Toiletries': ['Toothbrush & paste', 'Shampoo & conditioner', 'Deodorant', 'Face wash', 'Moisturizer', 'Razor'],
  '🎒 Essentials': ['Wallet & cash', 'Credit/Debit cards', 'Water bottle', 'Snacks for travel', 'Travel pillow', 'Eye mask & earplugs']
};

const PackingList = ({ destination }) => {
  const storageKey = `packing_${destination || 'default'}`;
  const [checked, setChecked] = useState(() => {
    try { return JSON.parse(localStorage.getItem(storageKey)) || {}; } catch { return {}; }
  });
  const [customItem, setCustomItem] = useState('');
  const [customCategory, setCustomCategory] = useState('🎒 Essentials');
  const [items, setItems] = useState(DEFAULT_ITEMS);
  const [activeCategory, setActiveCategory] = useState(Object.keys(DEFAULT_ITEMS)[0]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(checked));
  }, [checked, storageKey]);

  const toggle = (item) => {
    setChecked(prev => ({ ...prev, [item]: !prev[item] }));
  };

  const addCustom = () => {
    if (!customItem.trim()) return;
    setItems(prev => ({
      ...prev,
      [customCategory]: [...(prev[customCategory] || []), customItem.trim()]
    }));
    setCustomItem('');
  };

  const totalItems = Object.values(items).flat().length;
  const checkedCount = Object.values(checked).filter(Boolean).length;
  const progress = Math.round((checkedCount / totalItems) * 100);

  const resetAll = () => {
    setChecked({});
    localStorage.removeItem(storageKey);
  };

  return (
    <div className="packing-wrapper">
      <div className="packing-header">
        <div>
          <h3>🎒 Smart Packing List</h3>
          {destination && <p className="packing-dest">For: {destination}</p>}
        </div>
        <button className="reset-btn" onClick={resetAll}>Reset All</button>
      </div>

      <div className="packing-progress">
        <div className="progress-info">
          <span>{checkedCount} of {totalItems} packed</span>
          <span>{progress}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        {progress === 100 && <div className="all-packed">🎉 All packed! Ready to go!</div>}
      </div>

      <div className="category-tabs">
        {Object.keys(items).map(cat => {
          const catItems = items[cat];
          const catChecked = catItems.filter(i => checked[i]).length;
          return (
            <button
              key={cat}
              className={`cat-tab ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat.split(' ')[0]} <span className="cat-count">{catChecked}/{catItems.length}</span>
            </button>
          );
        })}
      </div>

      <div className="packing-items">
        {items[activeCategory]?.map(item => (
          <label key={item} className={`pack-item ${checked[item] ? 'checked' : ''}`}>
            <input
              type="checkbox"
              checked={!!checked[item]}
              onChange={() => toggle(item)}
            />
            <span>{item}</span>
          </label>
        ))}
      </div>

      <div className="add-custom">
        <input
          type="text"
          placeholder="Add custom item..."
          value={customItem}
          onChange={e => setCustomItem(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addCustom()}
        />
        <select value={customCategory} onChange={e => setCustomCategory(e.target.value)}>
          {Object.keys(items).map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <button onClick={addCustom}>+ Add</button>
      </div>
    </div>
  );
};

export default PackingList;
