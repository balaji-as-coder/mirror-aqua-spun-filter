import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
import { Button, Price } from '../ui/Primitives.jsx';
import './CartDrawer.css';

export function CartDrawer({ onNavigate }) {
  const {
    isCartOpen,
    setIsCartOpen,
    cartState,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon,
    couponCode,
    isValidating
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponError, setCouponError] = useState('');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    if (!inputCoupon.trim()) return;
    applyCoupon(inputCoupon);
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    onNavigate('/checkout');
  };

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`drawer-backdrop ${isCartOpen ? 'active' : ''}`}
        onClick={() => setIsCartOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className={`drawer-panel cart-drawer ${isCartOpen ? 'active' : ''}`} role="dialog" aria-label="Shopping Cart">
        {/* Drawer Header */}
        <div className="cart-drawer-header">
          <div className="cart-header-title-wrap">
            <h3 className="cart-header-title">Your Cart</h3>
            <span className="cart-item-count">({cartState.items?.length || 0} items)</span>
          </div>
          <button
            className="drawer-close-btn"
            onClick={() => setIsCartOpen(false)}
            aria-label="Close Cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="free-shipping-bar-wrap">
          {cartState.freeShippingRemaining > 0 ? (
            <p className="shipping-bar-text">
              Add <span className="highlight-amount">₹{cartState.freeShippingRemaining}</span> more for <strong>Free Express Shipping</strong>
            </p>
          ) : (
            <p className="shipping-bar-text qualified">
              🎉 <strong>You've unlocked Free Express Shipping!</strong>
            </p>
          )}
          <div className="shipping-progress-track">
            <div
              className="shipping-progress-fill"
              style={{
                width: `${Math.min(100, ((2500 - cartState.freeShippingRemaining) / 2500) * 100)}%`
              }}
            />
          </div>
        </div>

        {/* Cart Item List / Empty State */}
        <div className="cart-drawer-body">
          {cartState.items && cartState.items.length > 0 ? (
            <div className="cart-items-list">
              {cartState.items.map((item) => (
                <div key={item.product.id} className="cart-item-row">
                  <img
                    src={item.product.images?.[0]?.url}
                    alt={item.product.name}
                    className="cart-item-thumb"
                  />
                  <div className="cart-item-details">
                    <span className="cart-item-craft">{item.product.selectedPack || item.product.category || '10-Inch 5-Micron Sediment Filter'}</span>
                    <h4
                      className="cart-item-name"
                      onClick={() => {
                        setIsCartOpen(false);
                        onNavigate(`/product/${item.product.slug}`);
                      }}
                    >
                      {item.product.name}
                    </h4>
                    <div className="cart-item-price-wrap">
                      <Price price={item.unitPrice} />
                    </div>

                    <div className="cart-item-controls">
                      <div className="qty-stepper">
                        <button
                          className="qty-btn"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          aria-label="Decrease Quantity"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="qty-val">{item.quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          aria-label="Increase Quantity"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      <button
                        className="cart-item-remove-btn"
                        onClick={() => removeFromCart(item.product.id)}
                        aria-label="Remove item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <ShoppingBag size={48} className="empty-state-icon" />
              <h3 className="empty-state-title">Your Cart is Empty</h3>
              <p className="empty-state-text">
                Add the Mirror Aqua 10-Inch 5-Micron PP Spun Filter to start.
              </p>
              <Button
                variant="primary"
                onClick={() => {
                  setIsCartOpen(false);
                  onNavigate('/product/10-inch-5-micron-pp-spun-filter');
                }}
              >
                View 10" PP Spun Filter
              </Button>
            </div>
          )}
        </div>

        {/* Drawer Footer / Summary */}
        {cartState.items && cartState.items.length > 0 && (
          <div className="cart-drawer-footer">
            {/* Coupon Section */}
            <div className="coupon-box">
              {cartState.appliedCoupon ? (
                <div className="applied-coupon-row">
                  <div className="coupon-tag-info">
                    <Tag size={14} color="var(--accent-terracotta)" />
                    <span>Coupon <strong>{cartState.appliedCoupon.code}</strong> applied (-₹{cartState.discountAmount})</span>
                  </div>
                  <button className="remove-coupon-btn" onClick={removeCoupon}>Remove</button>
                </div>
              ) : (
                <form className="coupon-form" onSubmit={handleApplyCoupon}>
                  <input
                    type="text"
                    placeholder="Coupon code (e.g. AQUA10)"
                    value={inputCoupon}
                    onChange={(e) => setInputCoupon(e.target.value)}
                    className="coupon-input"
                  />
                  <button type="submit" className="coupon-apply-btn">Apply</button>
                </form>
              )}
              {cartState.errors && cartState.errors.length > 0 && (
                <p className="cart-error-msg">{cartState.errors[0]}</p>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="cart-summary-breakdown">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{cartState.subtotal?.toLocaleString('en-IN')}</span>
              </div>
              {cartState.discountAmount > 0 && (
                <div className="summary-row discount-row">
                  <span>Discount</span>
                  <span>-₹{cartState.discountAmount?.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="summary-row">
                <span>Estimated Shipping</span>
                <span>{cartState.shippingFee === 0 ? 'Free' : `₹${cartState.shippingFee}`}</span>
              </div>
              <div className="summary-row total-row">
                <strong>Estimated Total</strong>
                <strong>₹{cartState.grandTotal?.toLocaleString('en-IN')}</strong>
              </div>
            </div>

            <Button
              variant="accent"
              className="checkout-cta-btn"
              onClick={handleCheckout}
              disabled={isValidating || !cartState.isValid}
            >
              <span>{isValidating ? 'Validating...' : 'PROCEED TO CHECKOUT'}</span>
              <ArrowRight size={16} />
            </Button>

            <div className="cart-trust-note">
              <ShieldCheck size={14} />
              <span>Mirror Aqua Verified • Secure 256-bit Encryption</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
