import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, Menu, User, ShieldCheck, Droplet } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { useUI } from '../../context/UIContext.jsx';
import { analytics } from '../../services/analytics.js';
import './Header.css';

export function Header({ currentPath = '/', onNavigate }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const { totalItemCount, setIsCartOpen } = useCart();
  const { wishlistCount, setIsWishlistOpen } = useWishlist();
  const { setIsSearchOpen, setIsNavOpen } = useUI();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'PP Spun Filter (10")', path: '/product/10-inch-5-micron-pp-spun-filter', isHighlight: true },
    { label: 'How to Change Filter 🎥', path: '/how-to-change-spun-filter' },
    { label: 'Track Order 🚚', path: '/track' },
    { label: 'Bulk Enquiry', path: '#bulk-enquiry', isAnchor: true }
  ];

  return (
    <header className={`site-header ${isScrolled ? 'scrolled' : ''}`}>
      {/* Sleek Top Announcement Ribbon */}
      <div className="announcement-bar">
        <div className="container announcement-content">
          <div className="announcement-left">
            <span className="announcement-pill">DISPATCH NOTICE</span>
            <span>Mirror Aqua 10-Inch 5-Micron PP Spun Sediment Filters in Stock for Fast Pan-India Delivery</span>
          </div>
          <div className="announcement-right desktop-only">
            <span className="announcement-badge"><ShieldCheck size={13} /> 100% Polypropylene</span>
            <span className="announcement-badge">Pan-India Express Dispatch</span>
          </div>
        </div>
      </div>

      <div className="container header-main">
        {/* Mobile Menu Trigger */}
        <button
          className="mobile-menu-btn"
          onClick={() => setIsNavOpen(true)}
          aria-label="Open Navigation Menu"
        >
          <Menu size={20} />
        </button>

        {/* Official Mirror Aqua Brand Logo */}
        <div className="brand-logo-wrap" onClick={() => onNavigate('/product/10-inch-5-micron-pp-spun-filter')}>
          <img
            src="/images/product/logo2.jpeg"
            alt="Mirror Aqua Water Purification & Spares"
            className="brand-logo-img"
          />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav" aria-label="Main Navigation">
          <ul className="nav-list">
            {navLinks.map((link) => (
              <li key={link.path} className="nav-item">
                <a
                  href={link.path}
                  className={`nav-link ${link.isHighlight ? 'nav-link-highlight' : ''} ${currentPath === link.path ? 'active' : ''}`}
                  onClick={(e) => {
                    if (link.isAnchor) {
                      e.preventDefault();
                      const el = document.getElementById('bulk-enquiry');
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        onNavigate('/product/10-inch-5-micron-pp-spun-filter#bulk-enquiry');
                      }
                    } else {
                      e.preventDefault();
                      onNavigate(link.path);
                    }
                  }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Header Actions */}
        <div className="header-actions">
          {/* Account */}
          <button
            className="header-action-btn desktop-only"
            onClick={() => onNavigate('/my-account')}
            aria-label="My Account"
          >
            <User size={18} />
          </button>

          {/* Cart Drawer Trigger */}
          <button
            className="header-action-btn cart-btn"
            onClick={() => setIsCartOpen(true)}
            aria-label={`Cart with ${totalItemCount} items`}
          >
            <ShoppingBag size={18} />
            {totalItemCount > 0 && (
              <span className="cart-count-badge" aria-hidden="true">
                {totalItemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
