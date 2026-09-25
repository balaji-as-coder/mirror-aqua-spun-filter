import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
import { isFreeShippingRegion } from '../../services/shipping.js';
import { Button, Price } from '../ui/Primitives.jsx';
import './CartDrawer.css';

export function CartDrawer({ onNavigate }) {
  const {
    isCartOpen,
    setIsCartOpen,
    items,
    cartState,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon,
    couponCode,
    isValidating,
    deliveryRegion
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

  const displayItems = (cartState.items && cartState.items.length > 0)
    ? cartState.items
    : items.map((it, idx) => ({
        itemKey: it.itemKey || `drawer_item_${idx}`,
        productId: it.productId || it.product?.id,
        product: it.product || {},
        quantity: it.quantity || 1,
        unitPrice: it.unitPrice || it.product?.price || 199,
        lineTotal: (it.unitPrice || it.product?.price || 199) * (it.quantity || 1)
      }));

  const hasItems = displayItems.length > 0;
  const isAPTS = cartState.isAPTS || isFreeShippingRegion(deliveryRegion?.pincode, deliveryRegion?.state);

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
            <span className="cart-item-count">({displayItems.length} items)</span>
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
          {isAPTS ? (
            <p className="shipping-bar-text qualified">
              🎉 <strong>100% FREE Delivery Unlocked for AP & TS!</strong>
            </p>
          ) : cartState.freeShippingRemaining > 0 ? (
            <p className="shipping-bar-text">
              Add <span className="highlight-amount">₹{cartState.freeShippingRemaining}</span> more for <strong>Free Express Shipping</strong> (FREE for AP & TS!)
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
                width: `${isAPTS ? 100 : Math.min(100, ((2500 - cartState.freeShippingRemaining) / 2500) * 100)}%`
              }}
            />
          </div>
        </div>

        {/* Cart Item List / Empty State */}
        <div className="cart-drawer-body">
          {hasItems ? (
            <div className="cart-items-list">
              {displayItems.map((item, idx) => {
                const itemIdentifier = item.itemKey || item.productId || item.product?.id || `drawer_${idx}`;
                return (
                  <div key={itemIdentifier || idx} className="cart-item-row">
                    <img
                      src={item.product?.images?.[0]?.url || '/images/product/spun1.jpeg'}
                      alt={item.product?.name || 'PP Spun Filter'}
                      className="cart-item-thumb"
                    />
                    <div className="cart-item-details">
                      <span className="cart-item-craft">{item.product?.selectedPack || item.product?.category || '10-Inch 5-Micron Sediment Filter'}</span>
                      <h4
                        className="cart-item-name"
                        onClick={() => {
                          setIsCartOpen(false);
                          onNavigate(`/product/${item.product?.slug || '10-inch-5-micron-pp-spun-filter'}`);
                        }}
                      >
                        {item.product?.name || '10" PP Spun Filter'}
                      </h4>
                      <div className="cart-item-price-wrap">
                        <Price price={item.unitPrice} />
                      </div>

                      <div className="cart-item-controls">
                        <div className="qty-stepper">
                          <button
                            type="button"
                            className="qty-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateQuantity(itemIdentifier, item.quantity - 1, idx);
                            }}
                            aria-label="Decrease Quantity"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="qty-val">{item.quantity}</span>
                          <button
                            type="button"
                            className="qty-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateQuantity(itemIdentifier, item.quantity + 1, idx);
                            }}
                            disabled={item.quantity >= (item.product?.stock || 999)}
                            aria-label="Increase Quantity"
                          >
                            <Plus size={13} />
                          </button>
                        </div>

                        <button
                          type="button"
                          className="cart-item-remove-btn"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            removeFromCart(itemIdentifier, idx);
                          }}
                          aria-label="Remove item"
                          title="Remove product from cart"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
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
        {hasItems && (
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
                <span>{isAPTS ? <strong style={{ color: '#059669' }}>FREE (AP & TS)</strong> : cartState.subtotal >= 2500 ? <strong style={{ color: '#059669' }}>FREE</strong> : '₹60 (Other States)'}</span>
              </div>
              <div className="summary-row total-row">
                <strong>Estimated Total</strong>
                <strong>
                  ₹{(isAPTS
                    ? Math.max(0, cartState.subtotal - (cartState.discountAmount || 0))
                    : (cartState.subtotal >= 2500
                        ? Math.max(0, cartState.subtotal - (cartState.discountAmount || 0))
                        : Math.max(0, cartState.subtotal - (cartState.discountAmount || 0) + 60))
                  )?.toLocaleString('en-IN')}
                </strong>
              </div>
            </div>

            <Button
              variant="accent"
              className="checkout-cta-btn"
              onClick={handleCheckout}
            >
              <span>PROCEED TO BUY / PAY</span>
              <ArrowRight size={16} />
            </Button>

            <div className="cart-trust-note">
              <ShieldCheck size={14} />
              <span>Razorpay Verified • Free Delivery for AP & TS • ₹60 Other States</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
