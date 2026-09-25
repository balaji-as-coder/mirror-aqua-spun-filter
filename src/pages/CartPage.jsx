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
  Sparkles,
  Zap,
  Lock,
  CreditCard,
  X,
  Phone,
  User,
  Home
} from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { isFreeShippingRegion } from '../services/shipping.js';
import { paymentService } from '../services/payment.js';
import { wooCommerceService } from '../services/woocommerce.js';
import { analytics } from '../services/analytics.js';
import { PaymentSuccessModal } from '../components/modals/PaymentSuccessModal.jsx';
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

  // Quick Razorpay Checkout State
  const [isQuickCheckoutOpen, setIsQuickCheckoutOpen] = useState(false);
  const [isPayingRazorpay, setIsPayingRazorpay] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [completedOrder, setCompletedOrder] = useState(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // Customer Form for Direct Cart Pay
  const [quickForm, setQuickForm] = useState(() => {
    try {
      const saved = localStorage.getItem('kc_customer_info');
      const parsed = saved ? JSON.parse(saved) : {};
      return {
        fullName: parsed.fullName || '',
        phone: parsed.phone || '',
        email: parsed.email || '',
        address: parsed.address || '',
        city: parsed.city || '',
        state: parsed.state || deliveryRegion?.state || '',
        pincode: parsed.pincode || deliveryRegion?.pincode || ''
      };
    } catch {
      return { fullName: '', phone: '', email: '', address: '', city: '', state: '', pincode: '' };
    }
  });

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
  const isAPTS = cartState.isAPTS || isFreeShippingRegion(deliveryRegion?.pincode || quickForm.pincode, deliveryRegion?.state || quickForm.state);
  const currentShippingFee = isAPTS ? 0 : (cartState.subtotal >= 2500 ? 0 : 60);
  const grandTotalAmount = Math.max(0, cartState.subtotal - (cartState.discountAmount || 0) + currentShippingFee);

  const handleCheckPin = (e) => {
    e.preventDefault();
    if (!pinInput || pinInput.trim().length !== 6) {
      setPinStatus({ type: 'error', message: 'Please enter a valid 6-digit PIN code.' });
      return;
    }
    const clean = pinInput.trim();
    const isQual = isFreeShippingRegion(clean);
    setDeliveryRegion({ pincode: clean, state: isQual ? 'AP/TS' : '' });
    setQuickForm(prev => ({ ...prev, pincode: clean, state: isQual ? 'Andhra Pradesh / Telangana' : prev.state }));
    if (isQual) {
      setPinStatus({
        type: 'success',
        message: '🎉 Andhra Pradesh & Telangana: 100% FREE Standard Shipping Unlocked (₹0)!'
      });
    } else {
      setPinStatus({
        type: 'info',
        message: cartState.subtotal >= 2500
          ? '✓ Pan-India Free Delivery Qualified (Order ≥ ₹2,500)'
          : 'Standard Delivery: ₹60 only across other states (FREE on orders above ₹2,500)'
      });
    }
  };

  const handleQuickRegion = (cityName, pincode) => {
    setPinInput(pincode);
    setDeliveryRegion({ pincode, state: 'AP/TS' });
    setQuickForm(prev => ({ ...prev, pincode, state: 'Andhra Pradesh / Telangana', city: cityName }));
    setPinStatus({
      type: 'success',
      message: `🎉 Delivery to ${cityName} (${pincode}): 100% FREE Shipping Applied (₹0)!`
    });
  };

  const handleDeleteItem = (e, itemIdentifier, idx) => {
    e.preventDefault();
    e.stopPropagation();
    removeFromCart(itemIdentifier, idx);
  };

  // Launch Razorpay directly
  const startRazorpayPayment = async (customerData) => {
    setPaymentError('');
    setIsPayingRazorpay(true);

    try {
      // Save customer info for reuse
      try {
        localStorage.setItem('kc_customer_info', JSON.stringify(customerData));
      } catch (e) {}

      const checkAPTS = isFreeShippingRegion(customerData.pincode, customerData.state) || isAPTS;
      const shipFee = checkAPTS ? 0 : (cartState.subtotal >= 2500 ? 0 : 60);
      const computedTotal = Math.max(0, cartState.subtotal - (cartState.discountAmount || 0) + shipFee);

      // Validate cart authoritatively with WooCommerce
      const validated = await wooCommerceService.validateCart(
        items,
        cartState.appliedCoupon?.code,
        'standard',
        { pincode: customerData.pincode, state: customerData.state }
      );

      // Process live Razorpay payment
      const paymentResult = await paymentService.processPayment({
        orderId: `TMP-${Date.now()}`,
        amount: computedTotal,
        currency: 'INR',
        customer: customerData,
        items: validated.items,
        shippingFee: shipFee,
        utm: analytics.getAttribution()
      });

      if (!paymentResult.success) {
        throw new Error('Payment was declined or not completed. Please try again.');
      }

      // Create official order record
      const orderResponse = await wooCommerceService.createOrder({
        cartData: {
          ...validated,
          shippingFee: shipFee,
          grandTotal: computedTotal
        },
        customer: customerData,
        shippingAddress: customerData,
        paymentResult,
        attribution: analytics.getAttribution()
      });

      analytics.trackPurchase(orderResponse.order);
      setCompletedOrder(orderResponse.order);
      setIsSuccessModalOpen(true);
      setIsQuickCheckoutOpen(false);
      clearCart();
    } catch (err) {
      setPaymentError(err.message || 'Payment could not be completed.');
    } finally {
      setIsPayingRazorpay(false);
    }
  };

  const handleBuyNowClick = () => {
    // If customer has filled their details, directly open Razorpay!
    if (quickForm.fullName && quickForm.phone && quickForm.address && quickForm.pincode) {
      startRazorpayPayment(quickForm);
    } else {
      // Open instant 15-second Quick Checkout modal right in Cart
      setIsQuickCheckoutOpen(true);
    }
  };

  const handleQuickFormSubmit = (e) => {
    e.preventDefault();
    if (!quickForm.fullName || !quickForm.phone || !quickForm.address || !quickForm.pincode) {
      setPaymentError('Please fill in your Name, Phone, Delivery Address, and PIN code.');
      return;
    }
    startRazorpayPayment(quickForm);
  };

  return (
    <div className="cart-page-wrapper">
      <PaymentSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        orderData={completedOrder}
        onNavigate={onNavigate}
      />

      {/* Quick Razorpay Checkout Modal directly on Cart Page */}
      {isQuickCheckoutOpen && (
        <div className="quick-pay-modal-overlay" role="dialog" aria-modal="true">
          <div className="quick-pay-modal-card">
            <button
              type="button"
              className="quick-pay-close-btn"
              onClick={() => setIsQuickCheckoutOpen(false)}
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <div className="quick-pay-header">
              <div className="quick-pay-badge">
                <Zap size={18} color="#0284c7" />
                <span>Instant Razorpay Checkout</span>
              </div>
              <h3 className="quick-pay-title">Delivery Details & Payment</h3>
              <p className="quick-pay-subtitle">
                Enter your delivery address to open Razorpay (UPI, GPay, PhonePe, Cards, NetBanking):
              </p>
            </div>

            <form onSubmit={handleQuickFormSubmit} className="quick-pay-form">
              <div className="quick-field">
                <label><User size={13} /> Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Recipient Name"
                  value={quickForm.fullName}
                  onChange={(e) => setQuickForm({ ...quickForm, fullName: e.target.value })}
                  className="quick-input"
                />
              </div>

              <div className="quick-grid-2">
                <div className="quick-field">
                  <label><Phone size={13} /> Phone (WhatsApp / Updates) *</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="10-digit mobile"
                    value={quickForm.phone}
                    onChange={(e) => setQuickForm({ ...quickForm, phone: e.target.value.replace(/\D/g, '') })}
                    className="quick-input"
                  />
                </div>

                <div className="quick-field">
                  <label><MapPin size={13} /> PIN Code *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="6 digits"
                    value={quickForm.pincode}
                    onChange={(e) => {
                      const clean = e.target.value.replace(/\D/g, '');
                      setQuickForm({ ...quickForm, pincode: clean });
                      if (clean.length === 6) {
                        const isQual = isFreeShippingRegion(clean);
                        setDeliveryRegion({ pincode: clean, state: isQual ? 'AP/TS' : '' });
                      }
                    }}
                    className="quick-input"
                  />
                </div>
              </div>

              {/* Instant Shipping Fee Feedback in Quick Modal */}
              <div className="quick-shipping-status">
                {isFreeShippingRegion(quickForm.pincode, quickForm.state) ? (
                  <span className="free-ship-tag">🎉 AP & TS Qualified: Standard Shipping is 100% FREE!</span>
                ) : (
                  <span className="other-ship-tag">
                    🚚 Standard Shipping: {cartState.subtotal >= 2500 ? 'FREE (Order ≥ ₹2,500)' : '₹60 for Other States'}
                  </span>
                )}
              </div>

              <div className="quick-field">
                <label><Home size={13} /> Complete Delivery Address *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Flat/House No, Building, Street, Area, City"
                  value={quickForm.address}
                  onChange={(e) => setQuickForm({ ...quickForm, address: e.target.value })}
                  className="quick-input"
                />
              </div>

              {paymentError && <div className="quick-pay-error">{paymentError}</div>}

              <button
                type="submit"
                disabled={isPayingRazorpay}
                className="quick-pay-submit-btn"
              >
                <Lock size={16} />
                <span>
                  {isPayingRazorpay
                    ? 'CONNECTING TO RAZORPAY...'
                    : `PAY ₹${grandTotalAmount.toLocaleString('en-IN')} VIA RAZORPAY`}
                </span>
              </button>

              <div className="quick-pay-trust-note">
                <ShieldCheck size={14} color="#059669" />
                <span>Razorpay 256-Bit SSL Encrypted • Fast Pan-India Dispatch</span>
              </div>
            </form>
          </div>
        </div>
      )}

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
                  🎉 <strong>Special Regional Offer: 100% FREE Delivery to Andhra Pradesh & Telangana!</strong>
                </p>
                <span className="ap-ts-subtext">Standard shipping is completely free (₹0) on all orders to AP & TS (PINs 50xxxx - 53xxxx).</span>
              </div>
            ) : (
              <div>
                <p className="shipping-banner-text">
                  🚚 <strong>FREE Delivery for Andhra Pradesh (AP) & Telangana (TS)!</strong>
                  <span className="pan-india-note"> • Other states charge: <strong>₹60</strong> only (FREE on orders above ₹2,500)</span>
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

              {/* Standard Delivery Rates Showcase Card (Show AP & TS Free First, and Other States 60/-) */}
              <div className="cart-shipping-rates-box">
                <div className="rates-header">
                  <Truck size={18} className="icon-cyan" />
                  <strong>Shipping Options & Delivery Rates</strong>
                </div>

                <div className="rates-grid">
                  {/* Option 1: Shown First for AP & TS */}
                  <div className={`rate-card ${isAPTS ? 'active-rate' : ''}`}>
                    <div className="rate-card-content">
                      <div className="rate-badge-row">
                        <span className="rate-pill-featured">Shown First • Special Offer</span>
                        {isAPTS && <span className="rate-pill-applied">✓ Applied to your order</span>}
                      </div>
                      <h4 className="rate-title">Standard Delivery: Andhra Pradesh & Telangana</h4>
                      <p className="rate-desc">Hyderabad, Vijayawada, Vizag, Warangal, Tirupati, Guntur, and all AP/TS PIN codes (50xxxx - 53xxxx).</p>
                    </div>
                    <div className="rate-card-price">
                      <strong className="price-free">FREE (₹0)</strong>
                      <span className="delivery-time">3-5 business days</span>
                    </div>
                  </div>

                  {/* Option 2: Other States Charge of 60/- */}
                  <div className={`rate-card ${!isAPTS ? 'active-rate' : ''}`}>
                    <div className="rate-card-content">
                      <div className="rate-badge-row">
                        <span className="rate-pill-regular">Pan-India Standard</span>
                        {!isAPTS && <span className="rate-pill-applied">✓ Applied to your order</span>}
                      </div>
                      <h4 className="rate-title">Standard Delivery: Other States across India</h4>
                      <p className="rate-desc">Fast surface courier via Shiprocket (Delhivery, Bluedart, Express) across all other Indian states.</p>
                    </div>
                    <div className="rate-card-price">
                      {cartState.subtotal >= 2500 ? (
                        <strong className="price-free">FREE (Order ≥ ₹2,500)</strong>
                      ) : (
                        <strong className="price-fixed">₹60</strong>
                      )}
                      <span className="delivery-time">3-5 business days</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Pincode & Free Shipping Checker Card */}
              <div className="cart-pincode-checker-card">
                <div className="checker-header">
                  <MapPin size={18} className="pin-icon" />
                  <div>
                    <strong>Check Delivery & Free Shipping Eligibility</strong>
                    <p>Enter your 6-digit PIN code to verify ₹0 free delivery for AP/TS or ₹60 for other states:</p>
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
                  <span className="quick-label">⚡ Quick AP & TS Cities (100% FREE Delivery):</span>
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
                      ) : cartState.subtotal >= 2500 ? (
                        <strong className="free-tag">FREE (Above ₹2,500)</strong>
                      ) : (
                        <strong style={{ color: '#0f172a' }}>₹60 (Other States)</strong>
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
                      ₹{grandTotalAmount.toLocaleString('en-IN')}
                    </strong>
                  </div>
                </div>

                {/* Optimized Direct Razorpay Buy Button */}
                <div className="cart-action-buttons-wrap">
                  <button
                    type="button"
                    className="cart-razorpay-direct-btn"
                    onClick={handleBuyNowClick}
                    disabled={isPayingRazorpay}
                    title="Pay directly using Razorpay gateway"
                  >
                    <div className="razorpay-btn-shine" />
                    <div className="razorpay-btn-content">
                      <div className="btn-title-row">
                        <Zap size={18} className="zap-icon-animate" />
                        <span className="btn-main-label">
                          {isPayingRazorpay ? 'CONNECTING TO RAZORPAY...' : '⚡ BUY NOW • PAY VIA RAZORPAY'}
                        </span>
                      </div>
                      <span className="btn-subtext">UPI (Google Pay, PhonePe, Paytm), Cards, NetBanking</span>
                    </div>
                    <span className="btn-price-pill">
                      ₹{grandTotalAmount.toLocaleString('en-IN')}
                    </span>
                  </button>

                  {/* Secondary Full Checkout Button */}
                  <Button
                    variant="primary"
                    className="cart-standard-checkout-cta"
                    onClick={() => onNavigate('/checkout')}
                    disabled={isValidating}
                  >
                    <span>Proceed to Full Address Checkout</span>
                    <ArrowRight size={16} />
                  </Button>
                </div>

                {paymentError && (
                  <p className="cart-payment-inline-error">{paymentError}</p>
                )}

                {/* Razorpay Trust & Payment Methods Icons */}
                <div className="cart-trust-footer">
                  <div className="payment-badges-row">
                    <span className="pay-badge">UPI</span>
                    <span className="pay-badge">GPay</span>
                    <span className="pay-badge">PhonePe</span>
                    <span className="pay-badge">Paytm</span>
                    <span className="pay-badge">Cards</span>
                    <span className="pay-badge">NetBanking</span>
                  </div>
                  <div className="trust-shield-line">
                    <ShieldCheck size={14} color="#059669" />
                    <span>Razorpay Verified Live Gateway • 256-Bit SSL Protection</span>
                  </div>
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

