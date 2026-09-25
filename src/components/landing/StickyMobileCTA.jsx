import React from 'react';
import { Zap, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
import { analytics } from '../../services/analytics.js';
import './ProductLanding.css';

export function StickyMobileCTA({ product, onNavigate }) {
  const { addToCart, addItem, setIsCartOpen } = useCart();

  const basePrice = product?.price || 199;
  const isOutOfStock = product?.stockStatus === 'outofstock' || product?.stock === 0;

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    const addFn = addToCart || addItem;
    const itemToAdd = {
      ...product,
      id: product?.id || 'ma-prod-001',
      price: basePrice,
      sku: product?.sku || 'MA-PP-10-05M',
      name: product?.name || 'Mirror Aqua 10-Inch 5-Micron PP Spun Filter',
      selectedPack: '1 Piece (Standard)'
    };
    if (typeof addFn === 'function') {
      addFn(itemToAdd, 1);
    }
    analytics.trackBuyNow(itemToAdd, 1);
    onNavigate('/checkout');
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    const addFn = addToCart || addItem;
    const itemToAdd = {
      ...product,
      id: product?.id || 'ma-prod-001',
      price: basePrice,
      sku: product?.sku || 'MA-PP-10-05M',
      name: product?.name || 'Mirror Aqua 10-Inch 5-Micron PP Spun Filter',
      selectedPack: '1 Piece (Standard)'
    };
    if (typeof addFn === 'function') {
      addFn(itemToAdd, 1);
    }
    analytics.trackAddToCart(itemToAdd, 1);
    if (setIsCartOpen) setIsCartOpen(true);
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
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            aria-label="Add to Cart"
          >
            <ShoppingBag size={18} />
            <span>Add to Cart</span>
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
