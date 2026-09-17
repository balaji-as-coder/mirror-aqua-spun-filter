import React, { useState, useEffect } from 'react';
import { Search, Heart, ShoppingBag, Menu, User, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { useUI } from '../../context/UIContext.jsx';
import './Header.css';

export function Header({ currentPath = '/', onNavigate }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const { totalItemCount, setIsCartOpen } = useCart();
  const { wishlistCount, setIsWishlistOpen } = useWishlist();
  const { setIsSearchOpen, setIsNavOpen } = useUI();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Shop', path: '/shop' },
    { label: 'Handmade', path: '/category/handmade' },
    { label: 'New Finds', path: '/category/new-arrivals' },
    { label: 'Our Stories', path: '/stories' },
    { label: 'Coming Soon', path: '/coming-soon' }
  ];

  return (
    <header className={`site-header ${isScrolled ? 'scrolled' : 'transparent-hero'}`}>
      {/* Announcement Bar */}
      <div className="announcement-bar">
        <div className="container announcement-content">
          <span>✨ Curated Handmade Craftsmanship — Complimentary Express Shipping on orders over ₹2,500</span>
        </div>
      </div>

      <div className="container header-main">
        {/* Mobile Menu Trigger */}
        <button
          className="mobile-menu-btn"
          onClick={() => setIsNavOpen(true)}
          aria-label="Open Navigation Menu"
        >
          <Menu size={22} />
        </button>

        {/* Brand Logo */}
        <div className="brand-logo-wrap" onClick={() => onNavigate('/')}>
          <span className="brand-logo-sub">EST. 2026</span>
          <span className="brand-logo">KALA & CRAFT</span>
          <span className="brand-logo-tagline">HERITAGE DISCOVERY</span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav" aria-label="Main Navigation">
          <ul className="nav-list">
            {navLinks.map((link) => (
              <li key={link.path} className="nav-item">
                <a
                  href={link.path}
                  className={`nav-link ${currentPath === link.path ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(link.path);
                  }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Header Action Icons */}
        <div className="header-actions">
          {/* Search Trigger */}
          <button
            className="header-action-btn"
            onClick={() => setIsSearchOpen(true)}
            aria-label="Search Collection"
          >
            <Search size={20} />
            <span className="action-label desktop-only">Search</span>
          </button>

          {/* Account */}
          <button
            className="header-action-btn desktop-only"
            onClick={() => onNavigate('/my-account')}
            aria-label="My Account"
          >
            <User size={20} />
            <span className="action-label">Account</span>
          </button>

          {/* Wishlist */}
          <button
            className="header-action-btn"
            onClick={() => setIsWishlistOpen(true)}
            aria-label="Wishlist"
          >
            <div className="icon-with-badge">
              <Heart size={20} />
              {wishlistCount > 0 && <span className="action-badge">{wishlistCount}</span>}
            </div>
            <span className="action-label desktop-only">Wishlist</span>
          </button>

          {/* Cart Drawer Trigger */}
          <button
            className="header-action-btn header-cart-btn"
            onClick={() => setIsCartOpen(true)}
            aria-label="Shopping Cart"
          >
            <div className="icon-with-badge">
              <ShoppingBag size={20} />
              {totalItemCount > 0 && <span className="action-badge cart-badge">{totalItemCount}</span>}
            </div>
            <span className="action-label desktop-only">Cart</span>
          </button>
        </div>
      </div>
    </header>
  );
}
