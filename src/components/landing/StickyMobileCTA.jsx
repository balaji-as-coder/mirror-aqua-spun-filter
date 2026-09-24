import React from 'react';
import { Zap, MessageCircle, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
import { analytics } from '../../services/analytics.js';
import './ProductLanding.css';

export function StickyMobileCTA({ product, onNavigate }) {
  const { addItem, setIsCartOpen } = useCart();
  const WHATSAPP_NUM = import.meta.env.VITE_WHATSAPP_BUSINESS_NUMBER || '919876543210';

  const basePrice = product?.price || 199;
  const isOutOfStock = product?.stockStatus === 'outofstock' || product?.stock === 0;

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addItem(product, 1);
    analytics.trackBuyNow(product, 1);
    onNavigate('/checkout');
  };

  const handleWhatsApp = () => {
    analytics.trackWhatsAppClick('mobile_sticky_cta', product, 1);
    const text = `Hello Mirror Aqua,\n\nI want to order the Mirror Aqua 10-Inch 5-Micron PP Spun Filter (₹${basePrice}).\nPlease confirm delivery availability.`;
    window.open(`https://wa.me/${WHATSAPP_NUM}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <aside className="sticky-mobile-cta-bar" aria-label="Quick Purchase Actions">
      <div className="sticky-mobile-inner">
        <div className="sticky-price-info">
          <span className="sticky-label">Mirror Aqua 10" PP Filter</span>
          <div className="sticky-price-row">
            <span className="sticky-price">₹{basePrice}</span>
            {product?.mrp > basePrice && (
              <span className="sticky-mrp">₹{product.mrp}</span>
            )}
          </div>
        </div>

        <div className="sticky-buttons-group">
          <button
            type="button"
            className="sticky-cart-btn"
            onClick={() => {
              if (isOutOfStock) return;
              addItem(product, 1);
              setIsCartOpen(true);
            }}
            disabled={isOutOfStock}
            aria-label="Add to Cart"
          >
            <ShoppingBag size={18} />
          </button>

          <button
            type="button"
            className="sticky-wa-btn"
            onClick={handleWhatsApp}
            aria-label="Order on WhatsApp"
          >
            <MessageCircle size={18} />
            <span>WhatsApp</span>
          </button>

          <button
            type="button"
            className="sticky-buy-btn"
            onClick={handleBuyNow}
            disabled={isOutOfStock}
            aria-label="Buy Now"
          >
            <Zap size={18} />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
