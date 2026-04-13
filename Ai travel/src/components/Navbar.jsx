import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import { useAuthModal } from "../context/AuthModalContext";
import TripHistory from "./TripHistory";
import "./navbar.css";

const Navbar = () => {
  const { isAuthenticated, user, login, signup, logout } = useUser();
  const { showAuthModal, authMode, setAuthMode, openAuth, closeAuth: closeAuthModal } = useAuthModal();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [showTrips, setShowTrips] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  const openAuthModal = (mode) => { openAuth(mode); setIsMenuOpen(false); };

  const closeAuth = () => {
    closeAuthModal();
    setFormData({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
    setAuthError('');
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
          return;
        }
        await signup(formData.name, formData.email, formData.phone, formData.password);
        closeAuth();
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Something went wrong';
      setAuthError(msg);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => { logout(); setIsMenuOpen(false); };

  return (
    <>
      <nav className="nav">
        <a href="#" className="logo">
          <span className="logo-icon">✈</span>
          AI Travel Planner
        </a>
        
        <ul className="nav-links">
          <li><a href="#">Home</a></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#how">How It Works</a></li>
          <li><a href="#faq">FAQ</a></li>
          {isAuthenticated ? (
            <>
              <li><span className="user-greeting">Hi, {user?.name}!</span></li>
              <li><button onClick={() => setShowTrips(true)} className="nav-btn my-trips-btn">My Trips</button></li>
              <li><button onClick={handleLogout} className="nav-btn logout-btn">Logout</button></li>
            </>
          ) : (
            <>
              <li><button onClick={() => openAuthModal('login')} className="nav-btn login-btn">Login</button></li>
              <li><button onClick={() => openAuthModal('signup')} className="nav-btn signup-btn">Sign Up</button></li>
            </>
          )}
        </ul>
        
        <button 
          className={`hamburger ${isMenuOpen ? 'open' : ''}`} 
          onClick={toggleMenu}
          aria-label="Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        <a href="#" onClick={closeMenu}>Home</a>
        <a href="#features" onClick={closeMenu}>Features</a>
        <a href="#how" onClick={closeMenu}>How It Works</a>
        <a href="#faq" onClick={closeMenu}>FAQ</a>
        {isAuthenticated ? (
          <>
            <span className="user-greeting mobile">Hi, {user?.name}!</span>
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
        <div className="auth-overlay">
          <div className="auth-modal">
            <div className="auth-header">
              <h2>{authMode === 'login' ? 'Welcome Back!' : 'Create Account'}</h2>
              <button className="close-btn" onClick={closeAuth}>×</button>
            </div>
            
            <div className="auth-tabs">
              <button 
                className={`tab ${authMode === 'login' ? 'active' : ''}`}
                onClick={() => setAuthMode('login')}
              >
                Login
              </button>
              <button 
                className={`tab ${authMode === 'signup' ? 'active' : ''}`}
                onClick={() => setAuthMode('signup')}
              >
                Sign Up
              </button>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              {authMode === 'signup' && (
                <div className="form-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    name="name"
                    placeholder="Enter your full name" 
                    value={formData.name}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
              )}
              
              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  placeholder="your@email.com" 
                  value={formData.email}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              
              {authMode === 'signup' && (
                <div className="form-group">
                  <label>Phone Number</label>
                  <input 
                    type="tel" 
                    name="phone"
                    placeholder="+1 234 567 8900" 
                    value={formData.phone}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
              )}
              
              <div className="form-group">
                <label>Password</label>
                <input 
                  type="password" 
                  name="password"
                  placeholder="Enter password" 
                  value={formData.password}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              
              {authMode === 'signup' && (
                <div className="form-group">
                  <label>Confirm Password</label>
                  <input 
                    type="password" 
                    name="confirmPassword"
                    placeholder="Confirm password" 
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
              )}
              
              <button type="submit" className="auth-submit" disabled={authLoading}>
                {authLoading ? 'Please wait...' : authMode === 'login' ? 'Login' : 'Create Account'}
              </button>
            </form>
            
            {authError && (
              <div className="auth-error">{authError}</div>
            )}
            
            <div className="auth-footer">
              {authMode === 'login' ? (
                <p>Don't have an account? <button onClick={() => setAuthMode('signup')} className="link-btn">Sign up</button></p>
              ) : (
                <p>Already have an account? <button onClick={() => setAuthMode('login')} className="link-btn">Login</button></p>
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
