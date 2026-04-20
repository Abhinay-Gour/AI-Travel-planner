import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './BottomNav.css';

const TABS = [
  { path: '/', icon: '🏠', label: 'Home' },
  { path: '/destinations', icon: '🌍', label: 'Explore' },
  { path: '/transport', icon: '✈️', label: 'Transport' },
  { path: '/wishlist', icon: '❤️', label: 'Wishlist' },
  { path: '/packing', icon: '🎒', label: 'Packing' },
];

const BottomNav = () => {
  const { pathname } = useLocation();
  return (
    <nav className="bottom-nav">
      {TABS.map(tab => (
        <Link key={tab.path} to={tab.path} className={`bottom-nav-item ${pathname === tab.path ? 'active' : ''}`}>
          <span className="bottom-nav-icon">{tab.icon}</span>
          <span className="bottom-nav-label">{tab.label}</span>
        </Link>
      ))}
    </nav>
  );
};

export default BottomNav;
