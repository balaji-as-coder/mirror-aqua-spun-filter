import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Truck,
  CreditCard,
  MessageCircle,
  AlertCircle,
  Tag
} from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { Button, Price } from '../components/ui/Primitives.jsx';
import { wooCommerceService } from '../services/woocommerce.js';
import { paymentService } from '../services/payment.js';
import { shippingService } from '../services/shipping.js';
import { analytics } from '../services/analytics.js';
import './CheckoutPage.css';

export function CheckoutPage({ onNavigate }) {
  const {
    items,
    cartState,
    couponCode,
    applyCoupon,
    removeCoupon,
    clearCart,
    shippingMethod,
    setShippingMethod
  } = useCart();

  // Customer Form State
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    fullName: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    pincode: '',
    notes: ''
  });

  const [pincodeCheckResult, setPincodeCheckResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [completedOrder, setCompletedOrder] = useState(null);
  const [inputCoupon, setInputCoupon] = useState('');

  useEffect(() => {
    if (items.length > 0) {
      analytics.trackBeginCheckout(items, cartState.grandTotal);
    }
  }, [items, cartState.grandTotal]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'pincode' && value.length === 6) {
      shippingService.checkPincode(value).then(res => setPincodeCheckResult(res));
    }
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (inputCoupon.trim()) {
      applyCoupon(inputCoupon);
      setInputCoupon('');
    }
  };

  const handleCompleteOrder = async (e) => {
    e.preventDefault();
    setCheckoutError('');
    setIsProcessing(true);

    try {
      // 1. Authoritatively re-validate cart with WooCommerce
      const validatedCart = await wooCommerceService.validateCart(
        items,
        couponCode,
        shippingMethod
      );

      if (!validatedCart.isValid) {
        throw new Error(validatedCart.errors[0] || 'Cart validation failed with WooCommerce.');
      }

      // 2. Process payment through abstracted payment service
      const paymentResult = await paymentService.processPayment({
        orderId: `TMP-${Date.now()}`,
        amount: validatedCart.grandTotal,
        currency: 'INR',
        customer: formData,
        items: validatedCart.items,
        shippingFee: validatedCart.shippingFee,
        utm: analytics.getAttribution()
      });

      if (!paymentResult.success) {
        throw new Error('Payment was unsuccessful. Please try again.');
      }

      // 3. Create final order in WooCommerce
      const orderResponse = await wooCommerceService.createOrder({
        cartData: validatedCart,
        customer: formData,
        shippingAddress: formData,
        paymentResult,
        attribution: analytics.getAttribution()
      });

      // 4. Track Purchase in Analytics
      analytics.trackPurchase(orderResponse.order);

      // 5. Update UI & Clear Cart
      setCompletedOrder(orderResponse.order);
      clearCart();
    } catch (err) {
      setCheckoutError(err.message || 'An error occurred during checkout.');
    } finally {
      setIsProcessing(false);
    }
  };

  // ORDER CONFIRMATION SCREEN
  if (completedOrder) {
    const shipment = completedOrder.payment?.shipment;
    return (
      <div className="container checkout-success-container">
        <div className="checkout-success-card">
          <div className="success-badge-icon">
            <CheckCircle2 size={44} color="var(--color-success)" />
          </div>
          <span className="section-eyebrow">Payment & Order Confirmed</span>
          <h1 className="success-order-title">Thank You for Your Order</h1>
          <p className="order-number-text">
            Order Reference: <strong>#{completedOrder.orderId}</strong>
          </p>

          <p className="success-lead-p">
            A confirmation receipt has been sent to <strong>{completedOrder.customer.email}</strong>. Your Mirror Aqua PP Spun Filter cartridges are queued for dispatch via Shiprocket.
          </p>

          <div className="order-summary-box">
            <h3 className="summary-box-title">Order Items</h3>
            <div className="order-items-receipt">
              {completedOrder.items.map((item) => (
                <div key={item.productId} className="receipt-item-row">
                  <span>{item.name} × {item.quantity}</span>
                  <strong>₹{item.total.toLocaleString('en-IN')}</strong>
                </div>
              ))}
            </div>
            <div className="receipt-total-row">
              <span>Payment Gateway</span>
              <strong>{completedOrder.payment?.paymentMethod || 'Razorpay Verified'}</strong>
            </div>
            {completedOrder.payment?.transactionId && (
              <div className="receipt-item-row text-muted" style={{ fontSize: '12px' }}>
                <span>Razorpay Txn ID:</span>
                <code>{completedOrder.payment.transactionId}</code>
              </div>
            )}
            <div className="receipt-total-row" style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #e2e8f0' }}>
              <span>Total Paid</span>
              <strong style={{ color: 'var(--color-success)', fontSize: '18px' }}>₹{completedOrder.total.toLocaleString('en-IN')}</strong>
            </div>
          </div>

          {/* Live Shiprocket Logistics Card */}
          <div className="shipment-status-notice">
            <Truck size={22} className="icon-cyan" />
            <div>
              <strong>Shiprocket Logistics Integration:</strong>
              <p style={{ margin: '4px 0 0 0' }}>
                {shipment?.shipmentId ? (
                  <>
                    Shipment ID: <strong>{shipment.shipmentId}</strong> • Courier: <strong>{shipment.courierName || 'Delhivery'}</strong> • Status: <span style={{ color: '#059669', fontWeight: 600 }}>{shipment.status || 'READY TO DISPATCH'}</span>
                  </>
                ) : (
                  <>
                    Courier partner allocated automatically based on pincode <strong>{completedOrder.shippingAddress?.pincode}</strong>. Live tracking updates sent via SMS & WhatsApp.
                  </>
                )}
              </p>
              {shipment?.trackingUrl && (
                <div style={{ marginTop: '6px' }}>
                  <a href={shipment.trackingUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12.5px', color: '#0284c7', textDecoration: 'underline' }}>
                    Track shipment on Shiprocket →
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="success-actions-group">
            <Button variant="primary" onClick={() => onNavigate('/product/10-inch-5-micron-pp-spun-filter')}>
              <span>Continue Shopping</span>
              <ArrowRight size={16} />
            </Button>
            <a
              href={`https://wa.me/919876543210?text=${encodeURIComponent(
                `Hello Mirror Aqua, I placed Order #${completedOrder.orderId} (Razorpay Txn: ${completedOrder.payment?.transactionId || 'N/A'}) and would like dispatch tracking updates.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-receipt-btn"
            >
              <MessageCircle size={16} />
              <span>Contact Mirror Aqua on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  // EMPTY CHECKOUT REDIRECT
  if (items.length === 0) {
    return (
      <div className="container empty-checkout-container">
        <div className="empty-state">
          <Lock size={48} className="empty-state-icon" />
          <h2 className="empty-state-title">Your Cart is Empty</h2>
          <p className="empty-state-text">
            There are currently no spare parts selected for checkout.
          </p>
          <Button variant="primary" onClick={() => onNavigate('/product/10-inch-5-micron-pp-spun-filter')}>
            View 10" PP Spun Filter
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page-wrapper">
      <div className="container">
        <div className="checkout-page-header">
          <span className="section-eyebrow">Secure Checkout</span>
          <h1 className="checkout-main-title">Complete Your Order</h1>
          <div className="checkout-trust-badge">
            <ShieldCheck size={16} color="var(--color-success)" />
            <span>Mirror Aqua Verified • 256-Bit SSL Encrypted</span>
          </div>
        </div>

        <form onSubmit={handleCompleteOrder} className="checkout-layout-grid">
          {/* Left Column: Form Fields */}
          <div className="checkout-form-column">
            {/* Step 1: Contact */}
            <div className="checkout-form-section">
              <h2 className="form-section-title">1. Contact Information</h2>
              <div className="form-grid-2">
                <div className="form-field">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    required
                    placeholder="name@domain.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input-text"
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="phone">Phone (for Delivery & WhatsApp updates) *</label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    required
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="input-text"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Shipping Address */}
            <div className="checkout-form-section">
              <h2 className="form-section-title">2. Delivery Address</h2>
              <div className="form-field">
                <label htmlFor="fullName">Full Name *</label>
                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  required
                  placeholder="Recipient full name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="input-text"
                />
              </div>

              <div className="form-field">
                <label htmlFor="address">Street Address / House No. *</label>
                <input
                  id="address"
                  type="text"
                  name="address"
                  required
                  placeholder="Flat, suite, building, street"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="input-text"
                />
              </div>

              <div className="form-grid-3">
                <div className="form-field">
                  <label htmlFor="pincode">PIN Code *</label>
                  <input
                    id="pincode"
                    type="text"
                    name="pincode"
                    required
                    maxLength={6}
                    placeholder="6 Digits"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className="input-text"
                  />
                  {pincodeCheckResult && (
                    <span className={`pincode-feedback ${pincodeCheckResult.serviceable ? 'success' : 'error'}`}>
                      {pincodeCheckResult.serviceable ? `✓ Deliverable (${pincodeCheckResult.estimatedDays})` : pincodeCheckResult.message}
                    </span>
                  )}
                </div>

                <div className="form-field">
                  <label htmlFor="city">City *</label>
                  <input
                    id="city"
                    type="text"
                    name="city"
                    required
                    placeholder="City"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="input-text"
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="state">State *</label>
                  <input
                    id="state"
                    type="text"
                    name="state"
                    required
                    placeholder="State"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="input-text"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Shipping Method */}
            <div className="checkout-form-section">
              <h2 className="form-section-title">3. Shipping Speed</h2>
              <div className="shipping-options-list">
                <label className={`shipping-radio-card ${shippingMethod === 'standard' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="shippingMethod"
                    value="standard"
                    checked={shippingMethod === 'standard'}
                    onChange={() => setShippingMethod('standard')}
                  />
                  <div className="shipping-radio-info">
                    <strong>Standard Delivery (3-5 business days)</strong>
                    <span>Plastic-free honeycomb cushioning</span>
                  </div>
                  <span className="shipping-radio-price">
                    {cartState.subtotal >= 2500 ? 'FREE' : '₹150'}
                  </span>
                </label>

                <label className={`shipping-radio-card ${shippingMethod === 'express' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="shippingMethod"
                    value="express"
                    checked={shippingMethod === 'express'}
                    onChange={() => setShippingMethod('express')}
                  />
                  <div className="shipping-radio-info">
                    <strong>Express Air Delivery (1-2 business days)</strong>
                    <span>Priority dispatch + custom gift packaging</span>
                  </div>
                  <span className="shipping-radio-price">₹350</span>
                </label>
              </div>
            </div>

            {/* Step 4: Payment Method */}
            <div className="checkout-form-section">
              <h2 className="form-section-title">4. Payment Selection</h2>
              <div className="payment-box-info">
                <div className="payment-header-row">
                  <CreditCard size={20} color="var(--accent-terracotta)" />
                  <strong>Razorpay Secure Gateway / UPI / NetBanking / Cards</strong>
                </div>
                <p className="payment-sub-text">
                  Your payment will be securely processed. We support UPI (Google Pay, PhonePe, Paytm), All Major Debit/Credit Cards, and NetBanking.
                </p>
              </div>
            </div>

            {checkoutError && (
              <div className="checkout-error-banner">
                <AlertCircle size={18} />
                <span>{checkoutError}</span>
              </div>
            )}

            <Button
              type="submit"
              variant="accent"
              className="checkout-submit-order-btn"
              disabled={isProcessing}
            >
              <Lock size={16} />
              <span>{isProcessing ? 'OPENING RAZORPAY SECURE GATEWAY...' : `PAY ₹${cartState.grandTotal?.toLocaleString('en-IN')} VIA RAZORPAY`}</span>
            </Button>
          </div>

          {/* Right Column: Order Summary */}
          <div className="checkout-summary-column">
            <div className="checkout-summary-card">
              <h3 className="summary-title">Order Summary ({items.length} items)</h3>
              
              <div className="summary-items-scroll">
                {cartState.items?.map((item) => (
                  <div key={item.product.id} className="summary-item-line">
                    <img src={item.product.images?.[0]?.url} alt="" className="summary-thumb" />
                    <div className="summary-info">
                      <h4 className="summary-name">{item.product.name}</h4>
                      <span className="summary-qty">Qty: {item.quantity}</span>
                    </div>
                    <span className="summary-line-total">₹{item.lineTotal.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              {/* Coupon Form */}
              <div className="checkout-coupon-wrap">
                {cartState.appliedCoupon ? (
                  <div className="applied-coupon-pill">
                    <Tag size={13} />
                    <span><strong>{cartState.appliedCoupon.code}</strong> (-₹{cartState.discountAmount})</span>
                    <button type="button" onClick={removeCoupon} className="remove-pill-btn">✕</button>
                  </div>
                ) : (
                  <div className="coupon-inline-form">
                    <input
                      type="text"
                      placeholder="Discount Code"
                      value={inputCoupon}
                      onChange={(e) => setInputCoupon(e.target.value)}
                      className="coupon-input"
                    />
                    <button type="button" onClick={handleApplyCoupon} className="coupon-apply-btn">
                      Apply
                    </button>
                  </div>
                )}
              </div>

              <div className="summary-totals-block">
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
                  <span>Shipping</span>
                  <span>{cartState.shippingFee === 0 ? 'FREE' : `₹${cartState.shippingFee}`}</span>
                </div>
                <div className="summary-row">
                  <span>GST (Included)</span>
                  <span>₹{cartState.taxAmount?.toLocaleString('en-IN')}</span>
                </div>
                <div className="summary-row total-row">
                  <strong>Total</strong>
                  <strong>₹{cartState.grandTotal?.toLocaleString('en-IN')}</strong>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
