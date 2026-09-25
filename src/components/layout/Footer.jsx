import React from 'react';
import { ShieldCheck, Truck, CheckCircle2 } from 'lucide-react';
import './Footer.css';

export function Footer({ onNavigate }) {
  return (
    <footer className="site-footer">
      {/* Trust & Guarantee Ribbon */}
      <div className="footer-trust-ribbon">
        <div className="container trust-items-grid">
          <div className="trust-item">
            <ShieldCheck size={22} className="trust-icon" />
            <div>
              <strong>100% Polypropylene Media</strong>
              <span>Thermal-bonded fibers with zero chemical binders</span>
            </div>
          </div>
          <div className="trust-item">
            <CheckCircle2 size={22} className="trust-icon" />
            <div>
              <strong>Standard 10-Inch Fit</strong>
              <span>Compatible with standard pre-filter bowls</span>
            </div>
          </div>
          <div className="trust-item">
            <Truck size={22} className="trust-icon" />
            <div>
              <strong>Express Pan-India Dispatch</strong>
              <span>Tracked delivery for domestic & commercial spares</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container footer-main">
        <div className="footer-grid">
          {/* Column 1: Brand */}
          <div className="footer-col brand-col">
            <div className="footer-brand-logo" onClick={() => onNavigate('/product/10-inch-5-micron-pp-spun-filter')}>
              <img
                src="/images/product/logo1.jpeg"
                alt="Mirror Aqua Water Purification & Spares"
                className="footer-logo-img"
              />
            </div>
            <p className="footer-brand-desc">
              Reliable PP spun sediment filters and genuine water purifier pre-filtration elements. Manufactured for consistent filtration performance and long-lasting reliability across India.
            </p>
          </div>

          {/* Column 2: Products */}
          <div className="footer-col">
            <h4 className="footer-heading">Products</h4>
            <ul className="footer-links">
              <li><a href="/product/10-inch-5-micron-pp-spun-filter" onClick={(e) => { e.preventDefault(); onNavigate('/product/10-inch-5-micron-pp-spun-filter'); }}>10" 5-Micron PP Spun Filter</a></li>
              <li><a href="#bulk-enquiry" onClick={(e) => { e.preventDefault(); const el = document.getElementById('bulk-enquiry'); if (el) el.scrollIntoView({ behavior: 'smooth' }); else onNavigate('/product/10-inch-5-micron-pp-spun-filter#bulk-enquiry'); }}>10-Pack Value Bundles</a></li>
              <li><a href="#bulk-enquiry" onClick={(e) => { e.preventDefault(); const el = document.getElementById('bulk-enquiry'); if (el) el.scrollIntoView({ behavior: 'smooth' }); else onNavigate('/product/10-inch-5-micron-pp-spun-filter#bulk-enquiry'); }}>Wholesale Master Cartons</a></li>
            </ul>
          </div>

          {/* Column 3: B2B & Trade */}
          <div className="footer-col">
            <h4 className="footer-heading">Guides & Trade</h4>
            <ul className="footer-links">
              <li><a href="/track" onClick={(e) => { e.preventDefault(); onNavigate('/track'); }}>Track Your Order 🚚</a></li>
              <li><a href="/how-to-change-spun-filter" onClick={(e) => { e.preventDefault(); onNavigate('/how-to-change-spun-filter'); }}>Video: How to Change Filter 🎥</a></li>
              <li><a href="#bulk-enquiry" onClick={(e) => { e.preventDefault(); const el = document.getElementById('bulk-enquiry'); if (el) el.scrollIntoView({ behavior: 'smooth' }); else onNavigate('/product/10-inch-5-micron-pp-spun-filter#bulk-enquiry'); }}>Bulk Cartridge Orders (50+)</a></li>
              <li><a href="#dealer-enquiry" onClick={(e) => { e.preventDefault(); const el = document.getElementById('bulk-enquiry'); if (el) el.scrollIntoView({ behavior: 'smooth' }); else onNavigate('/product/10-inch-5-micron-pp-spun-filter#bulk-enquiry'); }}>Dealer Onboarding</a></li>
              <li><a href="/faq" onClick={(e) => { e.preventDefault(); onNavigate('/faq'); }}>Technical FAQ</a></li>
            </ul>
          </div>

          {/* Column 4: Compliance & Technical Notice */}
          <div className="footer-col">
            <h4 className="footer-heading">Filtration Disclosure</h4>
            <p className="footer-compliance-notice">
              PP spun sediment filters are mechanical depth filters engineered strictly for suspended physical particulate reduction (sand, silt, rust, dirt). They do not reduce dissolved chemical salts (TDS) or replace microbiological disinfection stages (UV/RO).
            </p>
            <div className="footer-contact-info">
              <span>📍 Made in India</span>
              <span>📞 WhatsApp Support Available Mon–Sat</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright-text">
            © {new Date().getFullYear()} Mirror Aqua. All rights reserved. Genuine RO & Water Purification Spare Parts.
          </p>
          <div className="footer-legal-links">
            <a href="/shipping" onClick={(e) => { e.preventDefault(); onNavigate('/shipping'); }}>Shipping Policy</a>
            <a href="/returns" onClick={(e) => { e.preventDefault(); onNavigate('/returns'); }}>Replacement Guarantee</a>
            <a href="/privacy-policy" onClick={(e) => { e.preventDefault(); onNavigate('/privacy-policy'); }}>Privacy Policy</a>
            <a href="/terms" onClick={(e) => { e.preventDefault(); onNavigate('/terms'); }}>Terms of Trade</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
