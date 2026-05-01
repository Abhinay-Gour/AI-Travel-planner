import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (password !== confirm) { setError('Passwords do not match'); return; }

    setStatus('loading');
    try {
      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      });
      const data = await res.json();
      if (data.success) {
        setStatus('success');
        setTimeout(() => navigate('/'), 3000);
      } else {
        setError(data.message || 'Reset failed. Link may have expired.');
        setStatus('error');
      }
    } catch {
      setError('Network error. Please try again.');
      setStatus('error');
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--night)', padding: '20px'
    }}>
      <div style={{
        background: 'var(--card)', border: '1px solid var(--border)',
        borderRadius: '20px', padding: '40px 36px',
        width: '100%', maxWidth: '420px',
        boxShadow: '0 24px 60px rgba(0,0,0,0.5)'
      }}>
        {status === 'success' ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✅</div>
            <h2 style={{ color: 'var(--white)', fontFamily: 'Playfair Display, serif', marginBottom: '10px' }}>
              Password Reset!
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
              Your password has been updated. Redirecting to home...
            </p>
            <div style={{ width: '100%', height: '4px', background: 'var(--border)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ height: '100%', background: 'var(--indigo)', borderRadius: '2px', animation: 'progressBar 3s linear forwards' }} />
            </div>
            <style>{`@keyframes progressBar { from { width: 0%; } to { width: 100%; } }`}</style>
          </div>
        ) : (
          <>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🔐</div>
              <h2 style={{
                color: 'var(--white)', fontFamily: 'Playfair Display, serif',
                fontSize: '1.6rem', fontWeight: 900, marginBottom: '6px', letterSpacing: '-0.02em'
              }}>
                Set New Password
              </h2>
              <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
                Enter your new password below
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block', fontSize: '0.75rem', fontWeight: 700,
                  color: 'var(--muted)', marginBottom: '6px',
                  textTransform: 'uppercase', letterSpacing: '0.06em'
                }}>
                  🔒 New Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  required
                  style={{
                    width: '100%', padding: '12px 14px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1.5px solid var(--border)',
                    borderRadius: '11px', color: 'var(--white)',
                    fontFamily: 'Inter, sans-serif', fontSize: '0.92rem',
                    outline: 'none', boxSizing: 'border-box',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--indigo)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block', fontSize: '0.75rem', fontWeight: 700,
                  color: 'var(--muted)', marginBottom: '6px',
                  textTransform: 'uppercase', letterSpacing: '0.06em'
                }}>
                  🔒 Confirm Password
                </label>
                <input
                  type="password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="Repeat password"
                  required
                  style={{
                    width: '100%', padding: '12px 14px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1.5px solid var(--border)',
                    borderRadius: '11px', color: 'var(--white)',
                    fontFamily: 'Inter, sans-serif', fontSize: '0.92rem',
                    outline: 'none', boxSizing: 'border-box',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--indigo)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>

              {error && (
                <div style={{
                  background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.25)',
                  borderRadius: '10px', padding: '10px 14px',
                  color: 'var(--pink)', fontSize: '0.83rem',
                  marginBottom: '16px', textAlign: 'center'
                }}>
                  ⚠️ {error}
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                style={{
                  width: '100%', padding: '13px',
                  background: 'linear-gradient(135deg, var(--rose), var(--deep))',
                  color: '#fff', border: 'none', borderRadius: '12px',
                  fontFamily: 'Inter, sans-serif', fontSize: '0.95rem', fontWeight: 700,
                  cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                  opacity: status === 'loading' ? 0.6 : 1,
                  boxShadow: '0 4px 18px rgba(244,63,94,0.3)',
                  transition: 'all 0.2s'
                }}
              >
                {status === 'loading' ? '⏳ Resetting...' : '🔑 Reset Password'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '18px' }}>
              <button
                onClick={() => navigate('/')}
                style={{
                  background: 'none', border: 'none',
                  color: 'var(--indigo)', fontSize: '0.83rem',
                  fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif'
                }}
              >
                ← Back to Home
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
