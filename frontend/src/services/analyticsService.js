// Lightweight analytics — tracks page views & events in localStorage
// Can be swapped with Google Analytics / Mixpanel later

const STORAGE_KEY = 'ai_travel_analytics';

const getStore = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
  catch { return {}; }
};

const saveStore = (data) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
  catch {}
};

// Track page view
export const trackPage = (page) => {
  const store = getStore();
  const today = new Date().toISOString().split('T')[0];
  if (!store.pages) store.pages = {};
  if (!store.pages[page]) store.pages[page] = {};
  store.pages[page][today] = (store.pages[page][today] || 0) + 1;
  store.lastPage = page;
  store.lastVisit = new Date().toISOString();
  store.totalPageViews = (store.totalPageViews || 0) + 1;
  saveStore(store);

  // Also send to backend if user is logged in
  const token = localStorage.getItem('aiTravelToken');
  if (token) {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
    fetch(`${API_URL}/users/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ event: 'page_view', page, timestamp: new Date().toISOString() })
    }).catch(() => {});
  }
};

// Track custom event
export const trackEvent = (event, data = {}) => {
  const store = getStore();
  if (!store.events) store.events = [];
  store.events.push({ event, data, timestamp: new Date().toISOString() });
  // Keep only last 100 events
  if (store.events.length > 100) store.events = store.events.slice(-100);
  saveStore(store);
};

// Get analytics summary
export const getAnalytics = () => getStore();
