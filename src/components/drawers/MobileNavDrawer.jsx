import React from 'react';
import { X, Sparkles, Compass, BookOpen, MessageCircle, Heart, User, ChevronRight } from 'lucide-react';
import { useUI } from '../../context/UIContext.jsx';
import './MobileNavDrawer.css';

export function MobileNavDrawer({ currentPath = '/', onNavigate }) {
  const { isNavOpen, setIsNavOpen } = useUI();

  if (!isNavOpen) return null;

  const links = [
    { label: 'Shop All Products', path: '/shop', icon: Compass },
    { label: 'Handmade Crafts', path: '/category/handmade', icon: Sparkles },
    { label: 'New Arrivals', path: '/category/new-arrivals', icon: Sparkles },
    { label: "Editor's Picks", path: '/shop?filter=editors-pick', icon: Sparkles },
    { label: 'Our Stories', path: '/stories', icon: BookOpen },
    { label: 'Coming Soon (Regions)', path: '/coming-soon', icon: Compass }
  ];

  const handleLinkClick = (path) => {
    setIsNavOpen(false);
    onNavigate(path);
  };

  return (
    <>
      <div
        className={`drawer-backdrop ${isNavOpen ? 'active' : ''}`}
        onClick={() => setIsNavOpen(false)}
        aria-hidden="true"
      />

      <div className={`drawer-panel mobile-nav-drawer ${isNavOpen ? 'active' : ''}`} role="dialog" aria-label="Navigation Menu">
        <div className="nav-drawer-header">
          <div className="brand-logo-wrap" onClick={() => handleLinkClick('/')}>
            <span className="brand-logo" style={{ fontSize: '1.25rem' }}>MIRROR CRAFT</span>
          </div>
          <button
            className="drawer-close-btn"
            onClick={() => setIsNavOpen(false)}
            aria-label="Close Menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="nav-drawer-body">
          <span className="nav-section-label">Discover Collections</span>
          <ul className="mobile-nav-list">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <li key={link.path}>
                  <button
                    className={`mobile-nav-item ${currentPath === link.path ? 'active' : ''}`}
                    onClick={() => handleLinkClick(link.path)}
                  >
                    <div className="nav-item-left">
                      <Icon size={18} className="nav-icon" />
                      <span>{link.label}</span>
                    </div>
                    <ChevronRight size={16} className="nav-chevron" />
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mobile-nav-divider" />

          <span className="nav-section-label">Customer & Support</span>
          <ul className="mobile-nav-list">
            <li>
              <button className="mobile-nav-item" onClick={() => handleLinkClick('/my-account')}>
                <div className="nav-item-left">
                  <User size={18} className="nav-icon" />
                  <span>My Account</span>
                </div>
                <ChevronRight size={16} className="nav-chevron" />
              </button>
            </li>
            <li>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="mobile-nav-item whatsapp-nav-item"
              >
                <div className="nav-item-left">
                  <MessageCircle size={18} />
                  <span>Artisan Help on WhatsApp</span>
                </div>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
