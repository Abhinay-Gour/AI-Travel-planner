import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useAuthModal } from '../context/AuthModalContext';
import { useTheme } from '../context/ThemeContext';
import TripHistory from './TripHistory';
import GlobalSearch from './GlobalSearch';
import './navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, login, signup, logout } = useUser();
  const { showAuthModal, authMode, setAuthMode, openAuth, closeAuth: closeAuthModal } = useAuthModal();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [showTrips, setShowTrips] = useState(false);
  const { isDark, toggle: toggleTheme } = useTheme();
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  const openAuthModal = (mode) => { openAuth(mode); setIsMenuOpen(false); };

  const closeAuth = () => {
    closeAuthModal();
    setFormData({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
    setAuthError('');
    setForgotEmail('');
    setForgotSent(false);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    setAuthError('');
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail })
      });
      const data = await res.json();
      if (data.success) setForgotSent(true);
      else setAuthError(data.message || 'Failed to send reset email');
    } catch {
      setAuthError('Network error. Please try again.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setAuthError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    try {
      if (authMode === 'login') {
        await login(formData.email, formData.password);
        closeAuth();
      } else {
        if (formData.password !== formData.confirmPassword) {
          setAuthError('Passwords do not match!');
          setAuthLoading(false);
          return;
        }
        if (formData.password.length < 6) {
          setAuthError('Password must be at least 6 characters!');
          setAuthLoading(false);
          return;
        }
        // Clean phone number - remove spaces and dashes
        const cleanPhone = formData.phone.replace(/[\s\-\(\)]/g, '');
        await signup(formData.name, formData.email, cleanPhone, formData.password);
        closeAuth();
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || err.message || 'Something went wrong. Check if backend is running.';
      setAuthError(msg);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => { logout(); setIsMenuOpen(false); };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="nav">
        <Link to="/" className="logo">
          <span className="logo-icon">✈</span>
          AI Travel Planner
        </Link>

        <GlobalSearch />

        <ul className="nav-links">
          <li><Link to="/" className={isActive('/') ? 'nav-active' : ''}>Home</Link></li>
          <li><Link to="/transport" className={isActive('/transport') ? 'nav-active' : ''}>✈️ Transport</Link></li>
          <li><Link to="/hotels" className={isActive('/hotels') ? 'nav-active' : ''}>🏨 Hotels</Link></li>
          <li><Link to="/wishlist" className={isActive('/wishlist') ? 'nav-active' : ''}>❤️ Wishlist</Link></li>
          <li><Link to="/packing" className={isActive('/packing') ? 'nav-active' : ''}>🎒 Packing</Link></li>
          <li><Link to="/mood-quiz" className={isActive('/mood-quiz') ? 'nav-active' : ''}>🎯 Quiz</Link></li>
          <li><Link to="/destinations" className={isActive('/destinations') ? 'nav-active' : ''}>🌍 Explore</Link></li>
          {isAuthenticated ? (
            <>
              <li><span className="user-greeting">Hi, {user?.name?.split(' ')[0]}!</span></li>
              <li><button onClick={() => setShowTrips(true)} className="nav-btn my-trips-btn">My Trips</button></li>
              <li><button onClick={handleLogout} className="nav-btn logout-btn">Logout</button></li>
            </>
          ) : (
            <>
              <li><button onClick={() => openAuthModal('login')} className="nav-btn login-btn">Login</button></li>
              <li><button onClick={() => openAuthModal('signup')} className="nav-btn signup-btn">Sign Up</button></li>
            </>
          )}
          <li><button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">{isDark ? '☀️' : '🌙'}</button></li>
        </ul>

        <button className={`hamburger ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu} aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        <Link to="/" onClick={closeMenu}>Home</Link>
        <Link to="/transport" onClick={closeMenu}>✈️ Transport</Link>
        <Link to="/hotels" onClick={closeMenu}>🏨 Hotels</Link>
        <Link to="/wishlist" onClick={closeMenu}>❤️ Wishlist</Link>
        <Link to="/packing" onClick={closeMenu}>🎒 Packing</Link>
        <Link to="/mood-quiz" onClick={closeMenu}>🎯 Mood Quiz</Link>
        <Link to="/destinations" onClick={closeMenu}>🌍 Explore</Link>
        {isAuthenticated ? (
          <>
            <span className="user-greeting mobile">Hi, {user?.name?.split(' ')[0]}!</span>
            <button onClick={() => { setShowTrips(true); closeMenu(); }} className="nav-btn my-trips-btn mobile">My Trips</button>
            <button onClick={handleLogout} className="nav-btn logout-btn mobile">Logout</button>
          </>
        ) : (
          <>
            <button onClick={() => openAuthModal('login')} className="nav-btn login-btn mobile">Login</button>
            <button onClick={() => openAuthModal('signup')} className="nav-btn signup-btn mobile">Sign Up</button>
          </>
        )}
      </div>

      {/* Auth Modal */}
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
                  {authMode === 'login' ? <>Welcome<br /><em>Back!</em></> : <>Start Your<br /><em>Journey</em></>}
                </h3>
                <p>
                  {authMode === 'login'
                    ? 'Your dream trips are waiting. Login to access your personalized travel plans.'
                    : 'Join 50,000+ travelers who plan smarter with AI. Free to start!'}
                </p>
                <div className="auth-perks">
                  {[
                    { icon: '🤖', text: 'AI-generated itineraries in seconds' },
                    { icon: '📧', text: 'Auto-send to email & WhatsApp' },
                    { icon: '💰', text: 'Real budget estimates in ₹' },
                    { icon: '✈️', text: 'Flights, trains & buses in one place' },
                  ].map((p, i) => (
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
              <div className="auth-header">
                <div className="auth-header-text">
                  <h2>{authMode === 'login' ? 'Sign In' : 'Create Account'}</h2>
                  <p>{authMode === 'login' ? 'Enter your credentials to continue' : 'Fill in your details to get started'}</p>
                </div>
                <button className="close-btn" onClick={closeAuth}>✕</button>
              </div>

              <div className="auth-tabs">
                <button className={`tab ${authMode === 'login' ? 'active' : ''}`} onClick={() => { setAuthMode('login'); setAuthError(''); }}>Login</button>
                <button className={`tab ${authMode === 'signup' ? 'active' : ''}`} onClick={() => { setAuthMode('signup'); setAuthError(''); }}>Sign Up</button>
              </div>

              {authMode === 'forgot' ? (
                <div>
                  {forgotSent ? (
                    <div style={{textAlign:'center',padding:'32px 0'}}>
                      <div style={{fontSize:'3rem',marginBottom:'16px'}}>📧</div>
                      <h3 style={{color:'var(--white)',marginBottom:'8px'}}>Check Your Email!</h3>
                      <p style={{color:'rgba(255,255,255,0.6)',fontSize:'0.9rem'}}>We sent a password reset link to <strong style={{color:'var(--rose)'}}>{forgotEmail}</strong></p>
                      <p style={{color:'rgba(255,255,255,0.4)',fontSize:'0.8rem',marginTop:'8px'}}>Link expires in 10 minutes</p>
                    </div>
                  ) : (
                    <form onSubmit={handleForgotPassword}>
                      <p style={{color:'rgba(255,255,255,0.6)',fontSize:'0.9rem',marginBottom:'20px'}}>Enter your email and we'll send you a reset link.</p>
                      <div className="form-group">
                        <label>📧 Email Address</label>
                        <input type="email" placeholder="you@example.com" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} required />
                      </div>
                      {authError && <div className="auth-error">⚠️ {authError}</div>}
                      <button type="submit" className="auth-submit" disabled={forgotLoading}>
                        {forgotLoading ? '⏳ Sending...' : '📧 Send Reset Link'}
                      </button>
                    </form>
                  )}
                </div>
              ) : (
                {authMode === 'signup' && (
                  <div className="form-group">
                    <label>👤 Full Name</label>
                    <input type="text" name="name" placeholder="Rahul Sharma" value={formData.name} onChange={handleInputChange} required minLength={2} />
                  </div>
                )}
                <div className="form-group">
                  <label>📧 Email Address</label>
                  <input type="email" name="email" placeholder="you@example.com" value={formData.email} onChange={handleInputChange} required />
                </div>
                {authMode === 'signup' && (
                  <div className="form-group">
                    <label>📱 Phone Number</label>
                    <input type="tel" name="phone" placeholder="+91 98765 43210" value={formData.phone} onChange={handleInputChange} required />
                  </div>
                )}
                <div className="form-group">
                  <label>🔒 Password</label>
                  <input type="password" name="password" placeholder="Min 6 characters" value={formData.password} onChange={handleInputChange} required minLength={6} />
                </div>
                {authMode === 'signup' && (
                  <div className="form-group">
                    <label>🔒 Confirm Password</label>
                    <input type="password" name="confirmPassword" placeholder="Repeat password" value={formData.confirmPassword} onChange={handleInputChange} required />
                  </div>
                )}

                {authError && <div className="auth-error">⚠️ {authError}</div>}

                <button type="submit" className="auth-submit" disabled={authLoading}>
                  {authLoading ? '⏳ Please wait...' : authMode === 'login' ? '🚀 Sign In' : '🎉 Create Account'}
                </button>
              </form>
              )}

              <div className="auth-footer">
                {authMode === 'login'
                  ? <>
                      <p>New here? <button onClick={() => { setAuthMode('signup'); setAuthError(''); }} className="link-btn">Create free account →</button></p>
                      <p style={{marginTop:'8px'}}><button onClick={() => { setAuthMode('forgot'); setAuthError(''); }} className="link-btn" style={{color:'rgba(255,255,255,0.4)',fontSize:'0.8rem'}}>Forgot password?</button></p>
                    </>
                  : authMode === 'signup'
                  ? <p>Already have an account? <button onClick={() => { setAuthMode('login'); setAuthError(''); }} className="link-btn">Sign in →</button></p>
                  : <p>Remember password? <button onClick={() => { setAuthMode('login'); setAuthError(''); }} className="link-btn">Sign in →</button></p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {showTrips && <TripHistory onClose={() => setShowTrips(false)} />}
    </>
  );
};

export default Navbar;
