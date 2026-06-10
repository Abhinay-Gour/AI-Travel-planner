// Simple obfuscation for localStorage — prevents casual snooping
// Note: For true security, sensitive operations should be server-side

const PREFIX = 'atp_';

const encode = (data) => {
  try { return btoa(encodeURIComponent(JSON.stringify(data))); } 
  catch { return null; }
};

const decode = (str) => {
  try { return JSON.parse(decodeURIComponent(atob(str))); } 
  catch { return null; }
};

export const secureStorage = {
  set: (key, value) => {
    try { localStorage.setItem(PREFIX + key, encode(value)); } catch {}
  },
  get: (key) => {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      if (!raw) return null;
      return decode(raw);
    } catch { return null; }
  },
  remove: (key) => {
    try { localStorage.removeItem(PREFIX + key); } catch {}
  },
  clear: () => {
    try {
      Object.keys(localStorage)
        .filter(k => k.startsWith(PREFIX))
        .forEach(k => localStorage.removeItem(k));
    } catch {}
  }
};

// Input sanitization utility
export const sanitize = (input) => {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[<>]/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove JS injection
    .trim()
    .slice(0, 500); // Limit length
};

// Safe JSON parse
export const safeJSONParse = (str, fallback = null) => {
  try { return JSON.parse(str); } 
  catch { return fallback; }
};
