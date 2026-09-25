import React, { useState } from 'react';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Tag,
  CheckCircle2,
  Truck,
  RotateCcw
} from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { Button, Price } from '../components/ui/Primitives.jsx';
import './CartPage.css';

export function CartPage({ onNavigate }) {
  const {
    items,
    cartState,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon,
    clearCart,
    isValidating
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponError, setCouponError] = useState('');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    if (!inputCoupon.trim()) return;
    applyCoupon(inputCoupon.trim().toUpperCase());
    setInputCoupon('');
  };

  const hasItems = cartState.items && cartState.items.length > 0;

  return (
    <div className="cart-page-wrapper">
      <div className="container">
        {/* Breadcrumb Navigation */}
        <nav className="cart-breadcrumb" aria-label="Breadcrumb">
          <button type="button" className="breadcrumb-link" onClick={() => onNavigate('/')}>
            Home
          </button>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">Shopping Cart</span>
        </nav>

        {/* Page Header */}
        <div className="cart-page-header">
          <div className="cart-title-wrap">
            <h1 className="cart-main-title">Shopping Cart</h1>
            <span className="cart-badge-count">
              {cartState.items?.length || 0} {cartState.items?.length === 1 ? 'item' : 'items'}
            </span>
          </div>
          {hasItems && (
            <button
              type="button"
              className="clear-cart-text-btn"
              onClick={clearCart}
              title="Remove all items from cart"
            >
              Clear Cart
            </button>
          )}
        </div>

        {/* Free Shipping Progress Meter */}
        {hasItems && (
          <div className="cart-shipping-banner">
            <Truck size={20} className="shipping-icon" />
            <div className="shipping-banner-content">
              {cartState.freeShippingRemaining > 0 ? (
                <p className="shipping-banner-text">
                  Add <strong className="shipping-highlight">₹{cartState.freeShippingRemaining}</strong> more to unlock <strong>Free Express Shipping</strong> across India!
                </p>
              ) : (
                <p className="shipping-banner-text qualified">
                  🎉 <strong>Congratulations! You have unlocked Free Express Shipping!</strong>
                </p>
              )}
              <div className="shipping-progress-track">
                <div
                  className="shipping-progress-fill"
                  style={{
                    width: `${Math.min(100, Math.max(8, ((2500 - cartState.freeShippingRemaining) / 2500) * 100))}%`
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {hasItems ? (
          <div className="cart-layout-grid">
            {/* Left Column: Cart Items List */}
            <div className="cart-items-column">
              <div className="cart-table-card">
                <div className="cart-table-header desktop-only">
                  <span className="col-product">Product</span>
                  <span className="col-price">Unit Price</span>
                  <span className="col-qty">Quantity</span>
                  <span className="col-total">Subtotal</span>
                  <span className="col-remove">Action</span>
                </div>

                <div className="cart-table-rows">
                  {cartState.items.map((item) => {
                    const itemIdentifier = item.itemKey || item.productId || item.product?.id;
                    const packLabel = item.product.selectedPack || item.product.category || '10-Inch 5-Micron Sediment Filter';

                    return (
                      <div key={itemIdentifier} className="cart-row-item">
                        {/* Product Info */}
                        <div className="col-product item-product-info">
                          <img
                            src={item.product.images?.[0]?.url || '/images/product/spun1.jpeg'}
                            alt={item.product.name}
                            className="item-product-thumb"
                            onClick={() => onNavigate(`/product/${item.product.slug}`)}
                          />
                          <div className="item-details">
                            <span className="item-pack-badge">{packLabel}</span>
                            <h3
                              className="item-name"
                              onClick={() => onNavigate(`/product/${item.product.slug}`)}
                            >
                              {item.product.name}
                            </h3>
                            <span className="item-sku">SKU: {item.product.sku}</span>
                          </div>
                        </div>

                        {/* Unit Price */}
                        <div className="col-price item-unit-price">
                          <span className="col-label mobile-only">Price:</span>
                          <Price price={item.unitPrice} />
                        </div>

                        {/* Quantity Stepper */}
                        <div className="col-qty item-quantity-ctrl">
                          <span className="col-label mobile-only">Quantity:</span>
                          <div className="cart-qty-stepper">
                            <button
                              type="button"
                              className="qty-btn"
                              onClick={() => updateQuantity(itemIdentifier, item.quantity - 1)}
                              aria-label="Decrease quantity"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="qty-value">{item.quantity}</span>
                            <button
                              type="button"
                              className="qty-btn"
                              onClick={() => updateQuantity(itemIdentifier, item.quantity + 1)}
                              disabled={item.quantity >= (item.product.stock || 999)}
                              aria-label="Increase quantity"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>

                        {/* Line Total */}
                        <div className="col-total item-line-total">
                          <span className="col-label mobile-only">Total:</span>
                          <strong>₹{(item.lineTotal || (item.unitPrice * item.quantity)).toLocaleString('en-IN')}</strong>
                        </div>

                        {/* Delete / Remove Action */}
                        <div className="col-remove item-remove-action">
                          <button
                            type="button"
                            className="cart-delete-item-btn"
                            onClick={() => removeFromCart(itemIdentifier)}
                            title="Remove this item from cart"
                            aria-label="Remove item"
                          >
                            <Trash2 size={16} />
                            <span className="desktop-only">Delete</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actions below items */}
              <div className="cart-bottom-actions">
                <button
                  type="button"
                  className="continue-shopping-btn"
                  onClick={() => onNavigate('/product/10-inch-5-micron-pp-spun-filter')}
                >
                  ← Continue Shopping
                </button>
              </div>

              {/* Quality & Compatibility Guarantee */}
              <div className="cart-assurance-card">
                <div className="assurance-box">
                  <ShieldCheck size={22} className="icon-cyan" />
                  <div>
                    <strong>100% Fit & Quality Guarantee</strong>
                    <p>Standard 10-inch drop-in size. Compatible with domestic pre-filter housings across India.</p>
                  </div>
                </div>
                <div className="assurance-box">
                  <RotateCcw size={22} className="icon-cyan" />
                  <div>
                    <strong>7-Day Damage Replacement</strong>
                    <p>If parts arrive damaged, we offer an immediate replacement dispatch guarantee.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="cart-summary-column">
              <div className="cart-summary-card">
                <h2 className="summary-title">Order Summary</h2>

                {/* Coupon Box */}
                <div className="cart-coupon-section">
                  {cartState.appliedCoupon ? (
                    <div className="applied-coupon-pill">
                      <div className="coupon-info">
                        <Tag size={14} color="#0284c7" />
                        <span>Coupon <strong>{cartState.appliedCoupon.code}</strong> applied (-₹{cartState.discountAmount})</span>
                      </div>
                      <button type="button" onClick={removeCoupon} className="btn-remove-coupon">
                        ✕
                      </button>
                    </div>
                  ) : (
                    <form className="cart-coupon-form" onSubmit={handleApplyCoupon}>
                      <input
                        type="text"
                        placeholder="Discount code (e.g. AQUA10)"
                        value={inputCoupon}
                        onChange={(e) => setInputCoupon(e.target.value)}
                        className="cart-coupon-input"
                      />
                      <button type="submit" className="cart-coupon-btn">
                        Apply
                      </button>
                    </form>
                  )}
                  {couponError && <p className="coupon-error-text">{couponError}</p>}
                </div>

                {/* Pricing Breakdown */}
                <div className="cart-pricing-rows">
                  <div className="pricing-row">
                    <span>Subtotal</span>
                    <span>₹{cartState.subtotal?.toLocaleString('en-IN')}</span>
                  </div>

                  {cartState.discountAmount > 0 && (
                    <div className="pricing-row discount-row">
                      <span>Discount</span>
                      <span>-₹{cartState.discountAmount?.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="pricing-row">
                    <span>Estimated Shipping</span>
                    <span>{cartState.shippingFee === 0 ? <strong className="free-tag">FREE</strong> : `₹${cartState.shippingFee}`}</span>
                  </div>

                  <div className="pricing-row tax-row">
                    <span>GST (Included)</span>
                    <span>₹{cartState.taxAmount?.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="pricing-row total-row">
                    <strong>Total Amount</strong>
                    <strong className="grand-total-price">₹{cartState.grandTotal?.toLocaleString('en-IN')}</strong>
                  </div>
                </div>

                {/* Checkout CTA */}
                <Button
                  variant="accent"
                  className="cart-checkout-cta"
                  onClick={() => onNavigate('/checkout')}
                  disabled={isValidating || !cartState.isValid}
                >
                  <span>{isValidating ? 'Validating Cart...' : 'PROCEED TO CHECKOUT'}</span>
                  <ArrowRight size={18} />
                </Button>

                <div className="cart-trust-footer">
                  <ShieldCheck size={14} />
                  <span>Razorpay Secure 256-Bit SSL Checkout • Fast Pan-India Dispatch</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Empty Cart State */
          <div className="cart-empty-wrapper">
            <div className="empty-cart-card">
              <div className="empty-cart-icon-wrap">
                <ShoppingBag size={56} className="empty-bag-icon" />
              </div>
              <h2 className="empty-title">Your Cart is Currently Empty</h2>
              <p className="empty-desc">
                Looks like you haven't added any water purifier cartridges or spare parts yet. Explore our high-performance 10-inch 5-micron PP spun filters to get started.
              </p>
              <div className="empty-actions">
                <Button
                  variant="accent"
                  onClick={() => onNavigate('/product/10-inch-5-micron-pp-spun-filter')}
                >
                  <span>View 10" PP Spun Filter</span>
                  <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
