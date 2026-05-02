import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useAuthModal } from '../context/AuthModalContext';
import { useTheme } from '../context/ThemeContext';
import TripHistory from './TripHistory';
import GlobalSearch from './GlobalSearch';
import './navbar.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Wake up Render backend silently
const wakeBackend = () => {
  fetch(`${API_URL}/health`).catch(() => {});
};

const Navbar = () => {
  const { isAuthenticated, user, login, signup, logout } = useUser();
  const { showAuthModal, authMode, setAuthMode, openAuth, closeAuth: closeAuthModal } = useAuthModal();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [showTrips, setShowTrips] = useState(false);
  const [backendWaking, setBackendWaking] = useState(false);
  const { isDark, toggle: toggleTheme } = useTheme();
  const location = useLocation();
  const firstInputRef = useRef(null);

  // Wake backend when modal opens
  useEffect(() => {
    if (showAuthModal) {
      setTimeout(() => firstInputRef.current?.focus(), 100);
      // Ping backend to wake it up
      setBackendWaking(true);
      fetch(`${API_URL}/health`)
        .then(() => setBackendWaking(false))
        .catch(() => setBackendWaking(false));
    }
  }, [showAuthModal]);

  // Wake backend on page load
  useEffect(() => { wakeBackend(); }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  const openAuthModal = (mode) => { openAuth(mode); setIsMenuOpen(false); };

  const closeAuth = () => {
    closeAuthModal();
    setFormData({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
    setAuthError('');
    setAuthSuccess(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
    setForgotEmail('');
    setForgotSent(false);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (authError) setAuthError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      if (authMode === 'login') {
        await login(formData.email, formData.password);
        setAuthSuccess(true);
        setTimeout(() => closeAuth(), 1200);
      } else {
        if (formData.password !== formData.confirmPassword) {
          setAuthError('Passwords do not match');
          setAuthLoading(false);
          return;
        }
        if (formData.password.length < 6) {
          setAuthError('Password must be at least 6 characters');
          setAuthLoading(false);
          return;
        }
        const cleanPhone = formData.phone.replace(/[\s\-\(\)]/g, '');
        await signup(formData.name, formData.email, cleanPhone, formData.password);
        setAuthSuccess(true);
        setTimeout(() => closeAuth(), 1200);
      }
    } catch (err) {
      const msg = err.response?.data?.message
        || err.response?.data?.errors?.[0]?.msg
        || err.message
        || 'Something went wrong. Please try again.';

      // Handle Render cold start
      if (msg.includes('Network') || msg.includes('ECONNREFUSED') || err.code === 'ERR_NETWORK') {
        setAuthError('Server is starting up (free tier). Please wait 30 seconds and try again.');
      } else {
        setAuthError(msg);
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    setAuthError('');
    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail })
      });
      const data = await res.json();
      if (data.success) setForgotSent(true);
      else setAuthError(data.message || 'Failed to send reset email');
    } catch {
      setAuthError('Network error. Server may be starting up, try again in 30 seconds.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleLogout = () => { logout(); setIsMenuOpen(false); };
  const isActive = (path) => location.pathname === path;

  const PERKS = [
    { icon: '🤖', text: 'AI itineraries in seconds' },
    { icon: '📧', text: 'Auto-send to email & WhatsApp' },
    { icon: '💰', text: 'Budget estimates in ₹' },
    { icon: '🌍', text: '18+ destinations to explore' },
  ];

  return (
    <>
      <nav className="nav">
        <Link to="/" className="logo">
          <span className="logo-icon">✈</span>
          <div className="logo-text">
            <span className="logo-title">AI Travel Planner</span>
            <span className="logo-sub">Powered by Gemini AI</span>
          </div>
        </Link>

        <GlobalSearch />

        <ul className="nav-links">
          <li><Link to="/" className={isActive('/') ? 'nav-active' : ''}>Home</Link></li>
          <li><Link to="/destinations" className={isActive('/destinations') ? 'nav-active' : ''}>Explore</Link></li>
          <li><Link to="/transport" className={isActive('/transport') ? 'nav-active' : ''}>Transport</Link></li>
          <li><Link to="/hotels" className={isActive('/hotels') ? 'nav-active' : ''}>Hotels</Link></li>
          <li><Link to="/packing" className={isActive('/packing') ? 'nav-active' : ''}>Packing</Link></li>
          <li><Link to="/mood-quiz" className={isActive('/mood-quiz') ? 'nav-active' : ''}>Quiz</Link></li>
          <li><Link to="/wishlist" className={isActive('/wishlist') ? 'nav-active' : ''}>Wishlist</Link></li>
        </ul>

        <div className="nav-actions">
          {isAuthenticated ? (
            <>
              <span className="user-greeting">Hi, {user?.name?.split(' ')[0]}!</span>
              <button onClick={() => setShowTrips(true)} className="nav-btn my-trips-btn">My Trips</button>
              <button onClick={handleLogout} className="nav-btn logout-btn">Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => openAuthModal('login')} className="nav-btn login-btn">Login</button>
              <button onClick={() => openAuthModal('signup')} className="nav-btn signup-btn">Sign Up Free</button>
            </>
          )}
          <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">{isDark ? '☀️' : '🌙'}</button>
        </div>

        <button className={`hamburger ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu} aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        <Link to="/" onClick={closeMenu}>Home</Link>
        <Link to="/destinations" onClick={closeMenu}>Explore</Link>
        <Link to="/packing" onClick={closeMenu}>Packing List</Link>
        <Link to="/mood-quiz" onClick={closeMenu}>Mood Quiz</Link>
        <Link to="/wishlist" onClick={closeMenu}>Wishlist</Link>
        <Link to="/transport" onClick={closeMenu}>Transport</Link>
        <Link to="/hotels" onClick={closeMenu}>Hotels</Link>
        <div className="mobile-divider" />
        {isAuthenticated ? (
          <>
            <span className="user-greeting mobile">Hi, {user?.name?.split(' ')[0]}! 👋</span>
            <button onClick={() => { setShowTrips(true); closeMenu(); }} className="nav-btn my-trips-btn mobile">My Trips</button>
            <button onClick={handleLogout} className="nav-btn logout-btn mobile">Logout</button>
          </>
        ) : (
          <>
            <button onClick={() => openAuthModal('login')} className="nav-btn login-btn mobile">Login</button>
            <button onClick={() => openAuthModal('signup')} className="nav-btn signup-btn mobile">Sign Up Free</button>
          </>
        )}
      </div>

      {/* ── AUTH MODAL ── */}
      {showAuthModal && (
        <div className="auth-overlay" onClick={(e) => e.target === e.currentTarget && closeAuth()}>
          <div className="auth-modal">

            {/* Left Visual Panel */}
            <div className="auth-visual">
              <div className="auth-visual-logo">
                <span>✈</span> AI Travel Planner
              </div>
              <div className="auth-visual-content">
                <h3>
                  {authMode === 'login'
                    ? <>Welcome<br /><em>Back!</em></>
                    : authMode === 'forgot'
                    ? <>Reset Your<br /><em>Password</em></>
                    : <>Start Your<br /><em>Journey</em></>}
                </h3>
                <p>
                  {authMode === 'login'
                    ? 'Your dream trips are waiting. Login to access your personalized travel plans.'
                    : authMode === 'forgot'
                    ? 'Enter your email and we\'ll send you a reset link instantly.'
                    : 'Plan smarter with AI. Free to start — no credit card required!'}
                </p>
                <div className="auth-perks">
                  {PERKS.map((p, i) => (
                    <div key={i} className="auth-perk">
                      <div className="auth-perk-icon">{p.icon}</div>
                      <span>{p.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="auth-visual-destinations">
                {['Paris', 'Bali', 'Tokyo', 'Goa', 'Manali', 'Dubai'].map(d => (
                  <span key={d} className="auth-dest-chip">{d}</span>
                ))}
              </div>
            </div>

            {/* Right Form Panel */}
            <div className="auth-form-panel">

              {/* Backend waking notice */}
              {backendWaking && (
                <div className="auth-wake-notice">
                  <span className="wake-dot" /> Server starting up... (may take 30s)
                </div>
              )}

              <div className="auth-header">
                <div className="auth-header-text">
                  <h2>
                    {authMode === 'login' ? 'Sign In'
                      : authMode === 'signup' ? 'Create Account'
                      : 'Reset Password'}
                  </h2>
                  <p>
                    {authMode === 'login' ? 'Enter your credentials to continue'
                      : authMode === 'signup' ? 'Fill in your details to get started'
                      : 'We\'ll send a reset link to your email'}
                  </p>
                </div>
                <button className="close-btn" onClick={closeAuth}>✕</button>
              </div>

              {/* Tabs — only for login/signup */}
              {authMode !== 'forgot' && (
                <div className="auth-tabs">
                  <button className={`tab ${authMode === 'login' ? 'active' : ''}`}
                    onClick={() => { setAuthMode('login'); setAuthError(''); setAuthSuccess(false); }}>
                    Login
                  </button>
                  <button className={`tab ${authMode === 'signup' ? 'active' : ''}`}
                    onClick={() => { setAuthMode('signup'); setAuthError(''); setAuthSuccess(false); }}>
                    Sign Up
                  </button>
                </div>
              )}

              {/* ── SUCCESS STATE ── */}
              {authSuccess ? (
                <div className="auth-success">
                  <div className="auth-success-icon">✓</div>
                  <h3>{authMode === 'login' ? 'Welcome back!' : 'Account created!'}</h3>
                  <p>Redirecting you now...</p>
                </div>
              ) : authMode === 'forgot' ? (
                /* ── FORGOT PASSWORD ── */
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  {forgotSent ? (
                    <div className="auth-sent">
                      <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📧</div>
                      <h3>Check Your Email!</h3>
                      <p>Reset link sent to <strong>{forgotEmail}</strong></p>
                      <p className="auth-sent-note">Link expires in 10 minutes</p>
                    </div>
                  ) : (
                    <form onSubmit={handleForgotPassword}>
                      <p className="auth-forgot-desc">Enter your registered email address.</p>
                      <div className="form-group">
                        <label>📧 Email Address</label>
                        <input
                          ref={firstInputRef}
                          type="email" placeholder="you@example.com"
                          value={forgotEmail}
                          onChange={e => { setForgotEmail(e.target.value); setAuthError(''); }}
                          required
                        />
                      </div>
                      {authError && <div className="auth-error">⚠️ {authError}</div>}
                      <button type="submit" className="auth-submit" disabled={forgotLoading}>
                        {forgotLoading
                          ? <span className="auth-btn-loading"><span className="auth-spinner" /> Sending...</span>
                          : '📧 Send Reset Link'}
                      </button>
                    </form>
                  )}
                  {/* Always visible back button */}
                  <div className="auth-footer" style={{ marginTop: 'auto' }}>
                    <p>
                      <button
                        onClick={() => { setAuthMode('login'); setAuthError(''); setForgotSent(false); setForgotEmail(''); }}
                        className="link-btn"
                      >
                        ← Back to Sign In
                      </button>
                    </p>
                  </div>
                </div>
              ) : (
                /* ── LOGIN / SIGNUP FORM ── */
                <form className="auth-form" onSubmit={handleSubmit}>
                  {authMode === 'signup' && (
                    <div className="form-group">
                      <label>👤 Full Name</label>
                      <input
                        ref={authMode === 'signup' ? firstInputRef : null}
                        type="text" name="name"
                        placeholder="Rahul Sharma"
                        value={formData.name}
                        onChange={handleInputChange}
                        required minLength={2}
                        className={formData.name.length >= 2 ? 'input-valid' : ''}
                      />
                    </div>
                  )}

                  <div className="form-group">
                    <label>📧 Email Address</label>
                    <input
                      ref={authMode === 'login' ? firstInputRef : null}
                      type="email" name="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className={formData.email.includes('@') ? 'input-valid' : ''}
                    />
                  </div>

                  {authMode === 'signup' && (
                    <div className="form-group">
                      <label>📱 Phone Number</label>
                      <input
                        type="tel" name="phone"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className={formData.phone.length >= 10 ? 'input-valid' : ''}
                      />
                    </div>
                  )}

                  <div className="form-group">
                    <label>🔒 Password</label>
                    <div className="input-password-wrap">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Min 6 characters"
                        value={formData.password}
                        onChange={handleInputChange}
                        required minLength={6}
                        className={formData.password.length >= 6 ? 'input-valid' : ''}
                      />
                      <button type="button" className="password-toggle" onClick={() => setShowPassword(s => !s)}>
                        {showPassword ? '🙈' : '👁️'}
                      </button>
                    </div>
                    {authMode === 'signup' && formData.password.length > 0 && (
                      <div className="password-strength">
                        <div className="strength-bar">
                          <div className="strength-fill" style={{
                            width: formData.password.length >= 10 ? '100%' : formData.password.length >= 6 ? '60%' : '30%',
                            background: formData.password.length >= 10 ? '#34d399' : formData.password.length >= 6 ? '#fbbf24' : '#f87171',
                          }} />
                        </div>
                        <span style={{ color: formData.password.length >= 10 ? '#34d399' : formData.password.length >= 6 ? '#fbbf24' : '#f87171' }}>
                          {formData.password.length >= 10 ? 'Strong' : formData.password.length >= 6 ? 'Good' : 'Weak'}
                        </span>
                      </div>
                    )}
                  </div>

                  {authMode === 'signup' && (
                    <div className="form-group">
                      <label>🔒 Confirm Password</label>
                      <div className="input-password-wrap">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          placeholder="Repeat password"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          required
                          className={formData.confirmPassword && formData.confirmPassword === formData.password ? 'input-valid' : formData.confirmPassword ? 'input-error' : ''}
                        />
                        <button type="button" className="password-toggle" onClick={() => setShowConfirmPassword(s => !s)}>
                          {showConfirmPassword ? '🙈' : '👁️'}
                        </button>
                      </div>
                      {formData.confirmPassword && formData.confirmPassword !== formData.password && (
                        <div className="field-error">Passwords don't match</div>
                      )}
                    </div>
                  )}

                  {authError && (
                    <div className="auth-error">
                      ⚠️ {authError}
                      {authError.includes('starting up') && (
                        <button type="button" className="retry-btn" onClick={handleSubmit}>
                          Retry →
                        </button>
                      )}
                    </div>
                  )}

                  <button type="submit" className="auth-submit" disabled={authLoading}>
                    {authLoading
                      ? <span className="auth-btn-loading"><span className="auth-spinner" /> {authMode === 'login' ? 'Signing in...' : 'Creating account...'}</span>
                      : authMode === 'login' ? '🚀 Sign In' : '🎉 Create Account'}
                  </button>
                </form>
              )}

              {/* Footer — only for login/signup, not forgot */}
              {!authSuccess && authMode !== 'forgot' && (
                <div className="auth-footer">
                  {authMode === 'login' ? (
                    <>
                      <p>New here? <button onClick={() => { setAuthMode('signup'); setAuthError(''); }} className="link-btn">Create free account →</button></p>
                      <p style={{ marginTop: 6 }}>
                        <button onClick={() => { setAuthMode('forgot'); setAuthError(''); }} className="link-btn" style={{ color: 'var(--gray)', fontSize: '0.75rem' }}>
                          Forgot password?
                        </button>
                      </p>
                    </>
                  ) : (
                    <p>Already have an account? <button onClick={() => { setAuthMode('login'); setAuthError(''); }} className="link-btn">Sign in →</button></p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showTrips && <TripHistory onClose={() => setShowTrips(false)} />}
    </>
  );
};

export default Navbar;
