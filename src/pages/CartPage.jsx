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
  RotateCcw,
  MapPin,
  Sparkles
} from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { isFreeShippingRegion } from '../services/shipping.js';
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
    isValidating,
    deliveryRegion,
    setDeliveryRegion
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponError, setCouponError] = useState('');
  const [pinInput, setPinInput] = useState(deliveryRegion?.pincode || '');
  const [pinStatus, setPinStatus] = useState(null);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    if (!inputCoupon.trim()) return;
    applyCoupon(inputCoupon.trim().toUpperCase());
    setInputCoupon('');
  };

  // Ensure items display even if cartState is validating or synchronizing
  const displayItems = (cartState.items && cartState.items.length > 0)
    ? cartState.items
    : items.map((it, idx) => ({
        itemKey: it.itemKey || `item_${idx}`,
        productId: it.productId || it.product?.id || 'ma-prod-001',
        product: it.product || {},
        quantity: it.quantity || 1,
        unitPrice: it.unitPrice || it.product?.price || 199,
        lineTotal: (it.unitPrice || it.product?.price || 199) * (it.quantity || 1)
      }));

  const hasItems = displayItems && displayItems.length > 0;
  const isAPTS = cartState.isAPTS || isFreeShippingRegion(deliveryRegion?.pincode, deliveryRegion?.state);

  const handleCheckPin = (e) => {
    e.preventDefault();
    if (!pinInput || pinInput.trim().length !== 6) {
      setPinStatus({ type: 'error', message: 'Please enter a valid 6-digit PIN code.' });
      return;
    }
    const clean = pinInput.trim();
    const isQual = isFreeShippingRegion(clean);
    setDeliveryRegion({ pincode: clean, state: isQual ? 'AP/TS' : '' });
    if (isQual) {
      setPinStatus({
        type: 'success',
        message: '🎉 Andhra Pradesh & Telangana: 100% FREE Standard Shipping Unlocked!'
      });
    } else {
      setPinStatus({
        type: 'info',
        message: cartState.subtotal >= 2500
          ? '✓ Pan-India Free Delivery Qualified (Order ≥ ₹2,500)'
          : 'Standard Delivery: ₹150 (FREE on orders above ₹2,500)'
      });
    }
  };

  const handleQuickRegion = (cityName, pincode) => {
    setPinInput(pincode);
    setDeliveryRegion({ pincode, state: 'AP/TS' });
    setPinStatus({
      type: 'success',
      message: `🎉 Delivery to ${cityName} (${pincode}): 100% FREE Shipping Applied!`
    });
  };

  const handleDeleteItem = (e, itemIdentifier, idx) => {
    e.preventDefault();
    e.stopPropagation();
    removeFromCart(itemIdentifier, idx);
  };

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
              {displayItems.length} {displayItems.length === 1 ? 'item' : 'items'}
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

        {/* Special AP & TS Free Shipping Announcement Banner */}
        <div className={`cart-shipping-banner ${isAPTS ? 'ap-ts-active' : ''}`}>
          <div className="shipping-banner-badge">
            <Truck size={20} className="shipping-icon" />
          </div>
          <div className="shipping-banner-content">
            {isAPTS ? (
              <div className="ap-ts-highlight-box">
                <p className="shipping-banner-text qualified">
                  🎉 <strong>Special Offer Applied: 100% FREE Delivery to Andhra Pradesh & Telangana!</strong>
                </p>
                <span className="ap-ts-subtext">No minimum order amount required for AP & TS PIN codes (50xxxx - 53xxxx).</span>
              </div>
            ) : (
              <div>
                <p className="shipping-banner-text">
                  🚚 <strong>FREE Delivery on all orders to Andhra Pradesh (AP) & Telangana (TS)!</strong>
                  {cartState.freeShippingRemaining > 0 ? (
                    <span className="pan-india-note"> (For other states, add <strong className="shipping-highlight">₹{cartState.freeShippingRemaining}</strong> more for Pan-India Free Delivery)</span>
                  ) : (
                    <span className="pan-india-note qualified"> (Pan-India Free Delivery threshold met!)</span>
                  )}
                </p>
                <div className="shipping-progress-track">
                  <div
                    className="shipping-progress-fill"
                    style={{
                      width: `${Math.min(100, Math.max(8, ((2500 - cartState.freeShippingRemaining) / 2500) * 100))}%`
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

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
                  {displayItems.map((item, idx) => {
                    const itemIdentifier = item.itemKey || item.productId || item.product?.id || `cart_item_${idx}`;
                    const packLabel = item.product?.selectedPack || item.product?.category || '10-Inch 5-Micron Sediment Filter';

                    return (
                      <div key={itemIdentifier || idx} className="cart-row-item">
                        {/* Product Info */}
                        <div className="col-product item-product-info">
                          <img
                            src={item.product?.images?.[0]?.url || '/images/product/spun1.jpeg'}
                            alt={item.product?.name || 'PP Spun Filter'}
                            className="item-product-thumb"
                            onClick={() => onNavigate(`/product/${item.product?.slug || '10-inch-5-micron-pp-spun-filter'}`)}
                          />
                          <div className="item-details">
                            <span className="item-pack-badge">{packLabel}</span>
                            <h3
                              className="item-name"
                              onClick={() => onNavigate(`/product/${item.product?.slug || '10-inch-5-micron-pp-spun-filter'}`)}
                            >
                              {item.product?.name || '10" PP Spun Sediment Filter'}
                            </h3>
                            <span className="item-sku">SKU: {item.product?.sku || 'MA-PP-10-05M'}</span>
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
                              onClick={(e) => {
                                e.stopPropagation();
                                updateQuantity(itemIdentifier, item.quantity - 1, idx);
                              }}
                              aria-label="Decrease quantity"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="qty-value">{item.quantity}</span>
                            <button
                              type="button"
                              className="qty-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                updateQuantity(itemIdentifier, item.quantity + 1, idx);
                              }}
                              disabled={item.quantity >= (item.product?.stock || 999)}
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
                            onClick={(e) => handleDeleteItem(e, itemIdentifier, idx)}
                            title="Remove this item from cart"
                            aria-label="Remove item"
                          >
                            <Trash2 size={16} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Delivery Pincode & Free Shipping Checker Card */}
              <div className="cart-pincode-checker-card">
                <div className="checker-header">
                  <MapPin size={18} className="pin-icon" />
                  <div>
                    <strong>Check Delivery & Free Shipping Eligibility</strong>
                    <p>Enter your 6-digit PIN code to check instant ₹0 free delivery qualification:</p>
                  </div>
                </div>

                <form className="pincode-checker-form" onSubmit={handleCheckPin}>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-digit PIN (e.g. 500001, 520001)"
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
                    className="pincode-check-input"
                  />
                  <button type="submit" className="pincode-check-btn">
                    Check Shipping
                  </button>
                </form>

                {/* Quick Selection Buttons for AP / TS major hubs */}
                <div className="ap-ts-quick-cities">
                  <span className="quick-label">⚡ Quick AP & TS Cities (FREE Delivery):</span>
                  <div className="quick-badges-list">
                    <button type="button" onClick={() => handleQuickRegion('Hyderabad', '500001')} className="city-pill">
                      Hyderabad (500001)
                    </button>
                    <button type="button" onClick={() => handleQuickRegion('Vijayawada', '520001')} className="city-pill">
                      Vijayawada (520001)
                    </button>
                    <button type="button" onClick={() => handleQuickRegion('Visakhapatnam', '530001')} className="city-pill">
                      Vizag (530001)
                    </button>
                    <button type="button" onClick={() => handleQuickRegion('Warangal', '506001')} className="city-pill">
                      Warangal (506001)
                    </button>
                    <button type="button" onClick={() => handleQuickRegion('Tirupati', '517501')} className="city-pill">
                      Tirupati (517501)
                    </button>
                  </div>
                </div>

                {pinStatus && (
                  <div className={`pincode-status-box ${pinStatus.type}`}>
                    {pinStatus.type === 'success' && <Sparkles size={16} />}
                    <span>{pinStatus.message}</span>
                  </div>
                )}
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
                    <span>
                      {isAPTS ? (
                        <strong className="free-tag">FREE (AP & TS)</strong>
                      ) : cartState.shippingFee === 0 ? (
                        <strong className="free-tag">FREE</strong>
                      ) : (
                        `₹${cartState.shippingFee}`
                      )}
                    </span>
                  </div>

                  <div className="pricing-row tax-row">
                    <span>GST (Included)</span>
                    <span>₹{cartState.taxAmount?.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="pricing-row total-row">
                    <strong>Total Amount</strong>
                    <strong className="grand-total-price">
                      ₹{(isAPTS
                        ? Math.max(0, cartState.subtotal - (cartState.discountAmount || 0))
                        : cartState.grandTotal
                      )?.toLocaleString('en-IN')}
                    </strong>
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

