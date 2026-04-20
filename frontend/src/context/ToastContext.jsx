import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();
export const useToast = () => useContext(ToastContext);

const ICONS = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
const COLORS = { success: '#10b981', error: '#ef4444', info: '#3b82f6', warning: '#f59e0b' };

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div style={{ position: 'fixed', bottom: 90, right: 20, zIndex: 99998, display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 320 }}>
        {toasts.map(t => (
          <div key={t.id} style={{ background: '#1f1014', border: `1px solid ${COLORS[t.type]}40`, borderLeft: `4px solid ${COLORS[t.type]}`, borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 8px 32px rgba(0,0,0,0.4)', animation: 'toastIn 0.3s ease', fontFamily: 'DM Sans, sans-serif' }}>
            <span style={{ fontSize: '1.1rem' }}>{ICONS[t.type]}</span>
            <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.875rem', fontWeight: 500 }}>{t.message}</span>
          </div>
        ))}
      </div>
      <style>{`@keyframes toastIn { from { opacity:0; transform:translateX(100%); } to { opacity:1; transform:translateX(0); } }`}</style>
    </ToastContext.Provider>
  );
};
