import React from 'react';
import { Zap, MessageCircle, Building2, ArrowRight } from 'lucide-react';
import { analytics } from '../../services/analytics.js';
import './ProductLanding.css';

export function FinalCTA({ product, onNavigate }) {
  const WHATSAPP_NUM = import.meta.env.VITE_WHATSAPP_BUSINESS_NUMBER || '919876543210';

  const handleBuyNow = () => {
    analytics.trackBuyNow(product, 1);
    onNavigate('/checkout');
  };

  const handleWhatsApp = () => {
    analytics.trackWhatsAppClick('final_cta_bar', product, 1);
    const text = `Hello Mirror Aqua,\n\nI want to order the Mirror Aqua 10-Inch 5-Micron PP Spun Filter.\nPlease confirm current price and dispatch time.`;
    window.open(`https://wa.me/${WHATSAPP_NUM}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleBulkScroll = (e) => {
    e.preventDefault();
    const el = document.getElementById('bulk-enquiry');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="final-cta-section">
      <div className="container text-center">
        <span className="section-eyebrow eyebrow-light">GENUINE PRE-FILTRATION PROTECTION</span>
        <h2 className="final-cta-title">
          Keep your RO pre-filtration system ready.
        </h2>
        <p className="final-cta-subtitle">
          Mirror Aqua 10-Inch 5-Micron PP Spun Filter — Standard Housing Fit | 100% Pure Polypropylene.
        </p>

        <div className="final-cta-btn-row">
          <button
            type="button"
            className="final-btn-buy"
            onClick={handleBuyNow}
          >
            <Zap size={18} />
            <span>BUY NOW</span>
          </button>

          <button
            type="button"
            className="final-btn-wa"
            onClick={handleWhatsApp}
          >
            <MessageCircle size={18} />
            <span>ORDER ON WHATSAPP</span>
          </button>

          <button
            type="button"
            className="final-btn-bulk"
            onClick={handleBulkScroll}
          >
            <Building2 size={18} />
            <span>BULK ENQUIRY (50+)</span>
          </button>
        </div>
      </div>
    </section>
  );
}
