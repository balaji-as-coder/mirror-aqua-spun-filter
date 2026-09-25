import React from 'react';
import {
  X,
  Droplet,
  Truck,
  Video,
  ShoppingBag,
  MessageCircle,
  Building2,
  ChevronRight,
  ShieldCheck,
  PhoneCall
} from 'lucide-react';
import { useUI } from '../../context/UIContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import './MobileNavDrawer.css';

export function MobileNavDrawer({ currentPath = '/', onNavigate }) {
  const { isNavOpen, setIsNavOpen } = useUI();
  const { setIsCartOpen, totalItemCount } = useCart();
  const WHATSAPP_NUM = import.meta.env.VITE_WHATSAPP_BUSINESS_NUMBER || '919876543210';

  if (!isNavOpen) return null;

  const links = [
    { label: 'PP Spun Filter (10" 5-Micron)', path: '/product/10-inch-5-micron-pp-spun-filter', icon: Droplet },
    { label: 'How to Change Filter 🎥', path: '/how-to-change-spun-filter', icon: Video },
    { label: 'Track Live Order 🚚', path: '/track', icon: Truck },
    { label: 'B2B Wholesale / Bulk Enquiry', path: '#bulk-enquiry', icon: Building2, isAnchor: true }
  ];

  const handleLinkClick = (link) => {
    setIsNavOpen(false);
    if (link.isAnchor) {
      const el = document.getElementById('bulk-enquiry');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        onNavigate('/product/10-inch-5-micron-pp-spun-filter#bulk-enquiry');
      }
    } else {
      onNavigate(link.path);
    }
  };

  const handleOpenCart = () => {
    setIsNavOpen(false);
    setIsCartOpen(true);
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
          <div className="brand-logo-wrap" onClick={() => { setIsNavOpen(false); onNavigate('/product/10-inch-5-micron-pp-spun-filter'); }}>
            <img
              src="/images/product/logo2.jpeg"
              alt="Mirror Aqua"
              className="brand-logo-img"
              style={{ maxHeight: '36px', objectFit: 'contain' }}
            />
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
          <span className="nav-section-label">Products & Solutions</span>
          <ul className="mobile-nav-list">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <li key={link.path}>
                  <button
                    className={`mobile-nav-item ${currentPath === link.path ? 'active' : ''}`}
                    onClick={() => handleLinkClick(link)}
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

          <span className="nav-section-label">Cart & Quick Actions</span>
          <ul className="mobile-nav-list">
            <li>
              <button className="mobile-nav-item" onClick={handleOpenCart}>
                <div className="nav-item-left">
                  <ShoppingBag size={18} className="nav-icon" />
                  <span>View Shopping Cart ({totalItemCount})</span>
                </div>
                <ChevronRight size={16} className="nav-chevron" />
              </button>
            </li>
            <li>
              <button className="mobile-nav-item" onClick={() => { setIsNavOpen(false); onNavigate('/track'); }}>
                <div className="nav-item-left">
                  <Truck size={18} className="nav-icon" />
                  <span>Shiprocket Order Tracking</span>
                </div>
                <ChevronRight size={16} className="nav-chevron" />
              </button>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
