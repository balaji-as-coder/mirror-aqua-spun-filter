import React from 'react';
import { MessageCircle, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import './Footer.css';

function InstagramIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  );
}

function FacebookIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
    </svg>
  );
}

function YoutubeIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
    </svg>
  );
}

export function Footer({ onNavigate }) {
  return (
    <footer className="site-footer">
      {/* Trust & Guarantee Ribbon */}
      <div className="footer-trust-ribbon">
        <div className="container trust-items-grid">
          <div className="trust-item">
            <ShieldCheck size={20} className="trust-icon" />
            <div>
              <strong>100% Genuine Provenance</strong>
              <span>Direct artisan collaboration</span>
            </div>
          </div>
          <div className="trust-item">
            <Truck size={20} className="trust-icon" />
            <div>
              <strong>Plastic-Free Packaging</strong>
              <span>Insured express delivery across India</span>
            </div>
          </div>
          <div className="trust-item">
            <RefreshCw size={20} className="trust-icon" />
            <div>
              <strong>7-Day Doorstep Guarantee</strong>
              <span>Hassle-free replacement if damaged</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container footer-main">
        <div className="footer-grid">
          {/* Column 1: Brand */}
          <div className="footer-col brand-col">
            <div className="footer-brand-logo" onClick={() => onNavigate('/')}>
              <span className="footer-brand-title">MIRROR CRAFT</span>
              <span className="footer-brand-tag">HERITAGE DISCOVERY</span>
            </div>
            <p className="footer-brand-desc">
              Handmade. Carefully selected. Exceptionally made. We discover products with character, quality, and a story worth bringing home.
            </p>
            {/* WhatsApp Direct Assist */}
            <a
              href="https://wa.me/919876543210?text=Hello%20Mirror%20Craft,%20I%20have%20an%20inquiry%20about%20a%20handmade%20piece."
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-assist-btn"
            >
              <MessageCircle size={16} />
              <span>Artisan & Order Help on WhatsApp</span>
            </a>
          </div>

          {/* Column 2: Shop */}
          <div className="footer-col">
            <h4 className="footer-heading">Shop</h4>
            <ul className="footer-links">
              <li><a href="/shop" onClick={(e) => { e.preventDefault(); onNavigate('/shop'); }}>All Products</a></li>
              <li><a href="/category/handmade" onClick={(e) => { e.preventDefault(); onNavigate('/category/handmade'); }}>Handmade Crafts</a></li>
              <li><a href="/category/new-arrivals" onClick={(e) => { e.preventDefault(); onNavigate('/category/new-arrivals'); }}>New Arrivals</a></li>
              <li><a href="/category/featured" onClick={(e) => { e.preventDefault(); onNavigate('/category/featured'); }}>Featured Finds</a></li>
              <li><a href="/shop?filter=editors-pick" onClick={(e) => { e.preventDefault(); onNavigate('/shop?filter=editors-pick'); }}>Editor's Picks</a></li>
            </ul>
          </div>

          {/* Column 3: Discover */}
          <div className="footer-col">
            <h4 className="footer-heading">Discover</h4>
            <ul className="footer-links">
              <li><a href="/about" onClick={(e) => { e.preventDefault(); onNavigate('/about'); }}>Our Philosophy</a></li>
              <li><a href="/stories" onClick={(e) => { e.preventDefault(); onNavigate('/stories'); }}>Artisan Stories</a></li>
              <li><a href="/coming-soon" onClick={(e) => { e.preventDefault(); onNavigate('/coming-soon'); }}>Coming Soon (Regions)</a></li>
              <li><a href="/stories/the-patience-of-clay-kutch-terracotta" onClick={(e) => { e.preventDefault(); onNavigate('/stories/the-patience-of-clay-kutch-terracotta'); }}>The Making of Terracotta</a></li>
            </ul>
          </div>

          {/* Column 4: Help */}
          <div className="footer-col">
            <h4 className="footer-heading">Help</h4>
            <ul className="footer-links">
              <li><a href="/contact" onClick={(e) => { e.preventDefault(); onNavigate('/contact'); }}>Contact Us</a></li>
              <li><a href="/shipping" onClick={(e) => { e.preventDefault(); onNavigate('/shipping'); }}>Shipping & Delivery</a></li>
              <li><a href="/returns" onClick={(e) => { e.preventDefault(); onNavigate('/returns'); }}>Returns & Replacements</a></li>
              <li><a href="/faq" onClick={(e) => { e.preventDefault(); onNavigate('/faq'); }}>FAQs</a></li>
              <li><a href="/privacy-policy" onClick={(e) => { e.preventDefault(); onNavigate('/privacy-policy'); }}>Privacy Policy</a></li>
              <li><a href="/terms" onClick={(e) => { e.preventDefault(); onNavigate('/terms'); }}>Terms & Conditions</a></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p className="copyright-text">
            © 2026 MIRROR CRAFT. All rights reserved. Made slowly. Finished carefully. Designed to be kept.
          </p>
          <div className="footer-social-links">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <InstagramIcon size={18} />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FacebookIcon size={18} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <YoutubeIcon size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
