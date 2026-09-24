import React, { useState, useEffect } from 'react';
import { ShoppingBag, Zap, MessageCircle, ShieldCheck, CheckCircle2, Truck, Star, MapPin, Check, Clock, Flame } from 'lucide-react';
import { ProductGallery } from './ProductGallery.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { analytics } from '../../services/analytics.js';
import './ProductLanding.css';

export function ProductHero({ product, onNavigate }) {
  const { addItem, setIsCartOpen } = useCart();
  const WHATSAPP_NUM = import.meta.env.VITE_WHATSAPP_BUSINESS_NUMBER || '919876543210';

  // 15-Hour Flash Sample Offer Timer State
  const [selectedPackType, setSelectedPackType] = useState('sample'); // 'sample' | 'single' | 'bulk' | 'custom'
  const [sampleTimeLeft, setSampleTimeLeft] = useState(() => {
    if (typeof window === 'undefined') return 15 * 3600 * 1000;
    const stored = localStorage.getItem('mirror_aqua_sample_expiry');
    const now = Date.now();
    if (stored) {
      const exp = parseInt(stored, 10);
      if (exp > now) return exp - now;
    }
    const newExp = now + 15 * 60 * 60 * 1000; // 15 hours from now
    localStorage.setItem('mirror_aqua_sample_expiry', newExp.toString());
    return 15 * 60 * 60 * 1000;
  });

  const isSampleActive = sampleTimeLeft > 0;

  useEffect(() => {
    if (!isSampleActive) return;
    const interval = setInterval(() => {
      const stored = localStorage.getItem('mirror_aqua_sample_expiry');
      if (stored) {
        const remaining = parseInt(stored, 10) - Date.now();
        if (remaining <= 0) {
          setSampleTimeLeft(0);
          if (selectedPackType === 'sample') {
            setSelectedPackType('single');
            setQuantity(1);
          }
          clearInterval(interval);
        } else {
          setSampleTimeLeft(remaining);
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isSampleActive, selectedPackType]);

  // Format countdown clock HH:MM:SS
  const formatTimer = (ms) => {
    const totalSec = Math.floor(ms / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${String(h).padStart(2, '0')}h : ${String(m).padStart(2, '0')}m : ${String(s).padStart(2, '0')}s`;
  };

  // Custom Quantity State (Default: 1)
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState(null);

  // Dynamic Pricing Calculation
  // Sample: ₹10 (MRP ₹399), Single <10 pieces: ₹199/pc (MRP ₹399/pc), >=10 pieces: ₹180/pc (MRP ₹399/pc)
  const isSampleSelected = isSampleActive && selectedPackType === 'sample';
  const isBulkRate = !isSampleSelected && (selectedPackType === 'bulk' || quantity >= 10);
  const unitPrice = isSampleSelected ? 10 : (isBulkRate ? 180 : 199);
  const unitMrp = 399;
  const currentPrice = isSampleSelected ? 10 : (quantity * unitPrice);
  const currentMrp = isSampleSelected ? 399 : (quantity * unitMrp);
  const totalSavings = currentMrp - currentPrice;
  const savingsPercent = Math.round(((currentMrp - currentPrice) / currentMrp) * 100);

  const isOutOfStock = product?.stockStatus === 'outofstock' || product?.stock === 0;

  const handlePresetSelect = (presetQty, packType = 'custom') => {
    setSelectedPackType(packType);
    setQuantity(presetQty);
    analytics.trackQuantitySelect(product, presetQty, `${presetQty} Piece(s)`);
  };

  const handleQuantityChange = (newQty) => {
    const val = Math.max(1, Math.min(500, parseInt(newQty, 10) || 1));
    setSelectedPackType('custom');
    setQuantity(val);
    analytics.trackQuantitySelect(product, val, `Custom ${val} Units`);
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    const itemToAdd = {
      ...product,
      price: unitPrice,
      sku: isSampleSelected ? 'MA-PP-10-SAMPLE' : product.sku,
      name: isSampleSelected
        ? 'Mirror Aqua 10" PP Spun Filter (1-Piece Quality Sample)'
        : product.name,
      selectedPack: isSampleSelected
        ? '1-Piece Quality Sample (⚡ ₹10 Flash Offer)'
        : `${quantity} Piece${quantity > 1 ? 's' : ''}`
    };
    addItem(itemToAdd, isSampleSelected ? 1 : quantity);
    analytics.trackAddToCart(itemToAdd, isSampleSelected ? 1 : quantity);
    setIsCartOpen(true);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    const itemToAdd = {
      ...product,
      price: unitPrice,
      sku: isSampleSelected ? 'MA-PP-10-SAMPLE' : product.sku,
      name: isSampleSelected
        ? 'Mirror Aqua 10" PP Spun Filter (1-Piece Quality Sample)'
        : product.name,
      selectedPack: isSampleSelected
        ? '1-Piece Quality Sample (⚡ ₹10 Flash Offer)'
        : `${quantity} Piece${quantity > 1 ? 's' : ''}`
    };
    addItem(itemToAdd, isSampleSelected ? 1 : quantity);
    analytics.trackBuyNow(itemToAdd, isSampleSelected ? 1 : quantity);
    onNavigate('/checkout');
  };

  const handleWhatsAppOrder = () => {
    analytics.trackWhatsAppClick('hero_order_btn', product, isSampleSelected ? 1 : quantity);
    const text = isSampleSelected
      ? `Hello Mirror Aqua,\n\nI want to claim the 15-Hour Flash Trial:\n• Product: Mirror Aqua 10-Inch 5-Micron PP Spun Filter (1-Piece Quality Sample)\n• Flash Trial Price: ₹10/- (MRP ₹399 • 97% OFF)\n\nPlease confirm delivery availability.`
      : `Hello Mirror Aqua,\n\nI want to order:\n\n• Product: ${product?.name || '10-Inch 5-Micron PP Spun Filter'}\n• Quantity: ${quantity} Piece${quantity > 1 ? 's' : ''} (${isBulkRate ? '₹180/pc Value Rate' : '₹199/pc Standard'})\n• Total Amount: ₹${currentPrice.toLocaleString('en-IN')}\n\nPlease confirm stock availability and express dispatch to my pincode.`;
    window.open(`https://wa.me/${WHATSAPP_NUM}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleCheckPincode = (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pincode.trim())) {
      setPincodeStatus({ valid: false, message: 'Please enter a valid 6-digit Indian pincode.' });
      return;
    }
    setPincodeStatus({ valid: true, message: `Dispatches in 24 hrs to ${pincode.trim()} via Pan-India Courier.` });
  };

  const scrollToBulk = (e) => {
    e.preventDefault();
    const el = document.getElementById('bulk-enquiry');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="product-hero-section">
      <div className="container hero-grid">
        {/* Left Column: Commercial Offer & Actions */}
        <div className="hero-content-col">
          {/* Breadcrumb Navigation */}
          <nav className="hero-breadcrumb" aria-label="Breadcrumb">
            <span>Mirror Aqua</span>
            <span className="crumb-sep">/</span>
            <span>{product?.category || 'Sediment Filter'}</span>
            <span className="crumb-sep">/</span>
            <span className="crumb-active">10-Inch 5-Micron PP Spun Filter</span>
          </nav>

          {/* Rating Micro-Badge */}
          <div className="hero-rating-badge">
            <div className="hero-stars">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={13} className="hero-star-filled" />
              ))}
            </div>
            <span className="rating-num">4.9 / 5.0</span>
            <span className="rating-sep">•</span>
            <span className="rating-label">140+ Verified RO Technicians & Buyers</span>
          </div>

          {/* Main Title & Subtitle */}
          <h1 className="hero-product-title">
            Mirror Aqua <span className="title-nowrap">10-Inch 5-Micron</span> <span className="title-highlight">PP Spun Filter</span>
          </h1>
          <p className="hero-product-subtitle">
            Precision-engineered 5-micron depth sediment filter for standard 10-inch pre-filter bowls. 100% pure melt-blown polypropylene with gradient multi-layer structure.
          </p>

          {/* Feature Badges */}
          <div className="hero-feature-badges">
            <span className="hero-badge badge-cyan">5 Micron Depth</span>
            <span className="hero-badge badge-emerald">100% Virgin PP</span>
            <span className="hero-badge badge-slate">Universal 10-Inch Fit</span>
            <span className="hero-badge badge-slate">Made in India</span>
          </div>

          {/* 15-Hour Flash Trial Offer Ribbon */}
          {isSampleActive && (
            <div className="sample-flash-banner">
              <div className="flash-banner-top">
                <div className="flash-badge-pill">
                  <Flame size={14} className="icon-flame" />
                  <span>15-HOUR FLASH TRIAL OFFER</span>
                </div>
                <div className="flash-timer-display">
                  <Clock size={13} />
                  <span>{formatTimer(sampleTimeLeft)} left</span>
                </div>
              </div>
              <p className="flash-banner-text">
                Experience Mirror Aqua melt-blown quality firsthand: <strong>Get 1 Sample Filter for just ₹10/-</strong> (Offer disappears when timer expires).
              </p>
            </div>
          )}

          {/* Pricing Glass Card */}
          <div className="hero-price-block">
            <div className="price-main-row">
              <span className="price-currency">₹</span>
              <span className="price-amount">{currentPrice.toLocaleString('en-IN')}</span>
              {currentMrp > currentPrice && (
                <span className="price-mrp">
                  MRP ₹{currentMrp.toLocaleString('en-IN')}
                </span>
              )}
              {savingsPercent > 0 && (
                <span className="price-discount-tag">
                  {savingsPercent}% OFF
                </span>
              )}
            </div>

            <p className="price-unit-note">
              {isSampleSelected ? (
                <>⚡ <strong>15-Hour Experience Trial:</strong> Single sample cartridge for <strong>₹10 only</strong> (Includes all taxes • Limit 1 per customer)</>
              ) : quantity === 1 ? (
                <>Single cartridge pack • <strong>₹199 / piece</strong> (Includes all taxes)</>
              ) : (
                <>Unit price: <strong>₹{unitPrice} per piece</strong> for {quantity} units • Total savings: <strong>₹{totalSavings.toLocaleString('en-IN')}</strong></>
              )}
            </p>

            {/* Live Stock Status */}
            <div className="hero-stock-indicator">
              <span className={`stock-dot ${isOutOfStock ? 'dot-red' : 'dot-green'}`} />
              <span className="stock-text">
                {isOutOfStock
                  ? 'Temporarily Out of Stock — Pre-order on WhatsApp'
                  : 'In Stock — Dispatches within 24 Hours via Pan-India Courier'}
              </span>
            </div>
          </div>

          {/* Flexible Quantity & Pack Selector */}
          <div className="hero-pack-selector-block">
            <div className="pack-selector-header">
              <span className="pack-label-title">Select Quantity or Pack:</span>
              <a href="#bulk-enquiry" onClick={scrollToBulk} className="bulk-link-hint">
                Need 50+ pieces? Get B2B Trade Quote
              </a>
            </div>

            {/* Quick Pack Preset Cards */}
            <div className={`pack-options-grid-presets ${isSampleActive ? 'has-sample' : ''}`}>
              {/* Option 1: ₹10 Flash Sample (Visible ONLY during 15-Hour Window) */}
              {isSampleActive && (
                <button
                  type="button"
                  className={`pack-card-hero sample-pack-card ${isSampleSelected ? 'selected' : ''}`}
                  onClick={() => handlePresetSelect(1, 'sample')}
                >
                  <span className="pack-badge-hero sample-badge">
                    ⚡ 15h Flash Trial • ₹10 Only
                  </span>
                  <div className="pack-card-top">
                    <div className="pack-radio-circle">
                      {isSampleSelected && <div className="pack-radio-inner" />}
                    </div>
                    <span className="pack-name-hero">1-Pc Quality Sample</span>
                    <span className="pack-price-hero flash-price">₹10</span>
                  </div>
                  <div className="pack-sub-info">
                    <span>Experience Trial • ₹10/pc • <strong>97% OFF</strong></span>
                  </div>
                </button>
              )}

              {/* Option 2: 1 Piece Standard ₹199 */}
              <button
                type="button"
                className={`pack-card-hero ${selectedPackType === 'single' && quantity === 1 ? 'selected' : ''}`}
                onClick={() => handlePresetSelect(1, 'single')}
              >
                <div className="pack-card-top">
                  <div className="pack-radio-circle">
                    {selectedPackType === 'single' && quantity === 1 && <div className="pack-radio-inner" />}
                  </div>
                  <span className="pack-name-hero">1 Piece (Standard)</span>
                  <span className="pack-price-hero">₹199</span>
                </div>
                <div className="pack-sub-info">
                  <span>Standard Pack • ₹199/pc • 50% OFF</span>
                </div>
              </button>

              {/* Option 3: 10 Pieces Value Pack ₹1,800 */}
              <button
                type="button"
                className={`pack-card-hero ${selectedPackType === 'bulk' || quantity === 10 ? 'selected' : ''}`}
                onClick={() => handlePresetSelect(10, 'bulk')}
              >
                <span className="pack-badge-hero popular-badge">
                  ⭐ Best Value • Save ₹2,190
                </span>
                <div className="pack-card-top">
                  <div className="pack-radio-circle">
                    {(selectedPackType === 'bulk' || quantity === 10) && <div className="pack-radio-inner" />}
                  </div>
                  <span className="pack-name-hero">10 Pieces (Value Pack)</span>
                  <span className="pack-price-hero">₹1,800</span>
                </div>
                <div className="pack-sub-info">
                  <span>Wholesale Rate • ₹180/pc • 55% OFF</span>
                </div>
              </button>
            </div>

            {/* Custom Quantity Stepper */}
            <div className="custom-qty-container">
              <div className="custom-qty-label-row">
                <span className="custom-qty-title">Or Enter Any Custom Quantity:</span>
                {quantity < 10 ? (
                  <span className="custom-qty-hint">
                    💡 Tip: Buy <strong>{10 - quantity} more</strong> to unlock <strong>₹180/pc</strong> rate!
                  </span>
                ) : (
                  <span className="custom-qty-hint success">
                    🎉 Value Tier Applied: <strong>₹180 / piece</strong>
                  </span>
                )}
              </div>

              <div className="custom-qty-controls">
                <button
                  type="button"
                  className="qty-stepper-btn"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(e.target.value)}
                  className="qty-stepper-input"
                  aria-label="Filter quantity"
                />
                <button
                  type="button"
                  className="qty-stepper-btn"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
                <div className="qty-quick-buttons">
                  {[2, 3, 5, 20].map((q) => (
                    <button
                      key={q}
                      type="button"
                      className={`qty-quick-pill ${quantity === q ? 'active' : ''}`}
                      onClick={() => handlePresetSelect(q)}
                    >
                      {q} Pcs
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* High-Conversion Action Buttons */}
          <div className="hero-cta-group">
            <button
              type="button"
              className="cta-btn cta-buy-now"
              onClick={handleBuyNow}
              disabled={isOutOfStock}
            >
              <Zap size={18} />
              <span>BUY NOW • ₹{currentPrice.toLocaleString('en-IN')} ({quantity} {quantity > 1 ? 'Units' : 'Unit'})</span>
            </button>

            <button
              type="button"
              className="cta-btn cta-add-cart"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
            >
              <ShoppingBag size={18} />
              <span>ADD {quantity > 1 ? `(${quantity})` : ''} TO CART</span>
            </button>

            <button
              type="button"
              className="cta-btn cta-whatsapp"
              onClick={handleWhatsAppOrder}
            >
              <MessageCircle size={18} />
              <span>ORDER {quantity} ON WHATSAPP</span>
            </button>
          </div>

          {/* Integrated Pincode Checker */}
          <div className="hero-pincode-checker">
            <form onSubmit={handleCheckPincode} className="pincode-form">
              <div className="pincode-input-wrap">
                <MapPin size={16} className="pincode-icon" />
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit delivery pincode"
                  className="pincode-input"
                />
              </div>
              <button type="submit" className="pincode-check-btn">
                Check
              </button>
            </form>
            {pincodeStatus && (
              <p className={`pincode-result ${pincodeStatus.valid ? 'valid' : 'invalid'}`}>
                {pincodeStatus.valid && <Check size={14} />}
                {pincodeStatus.message}
              </p>
            )}
          </div>

          {/* Trust Guarantees */}
          <div className="hero-trust-indicators">
            <div className="trust-indicator-item">
              <Truck size={16} />
              <span>Pan-India Courier Dispatch</span>
            </div>
            <div className="trust-indicator-item">
              <ShieldCheck size={16} />
              <span>100% Virgin Food-Grade Polypropylene</span>
            </div>
            <div className="trust-indicator-item">
              <CheckCircle2 size={16} />
              <span>Fits Standard 10-Inch Bowls</span>
            </div>
          </div>
        </div>

        {/* Right Column: High-Res Interactive Gallery */}
        <div className="hero-gallery-col">
          <ProductGallery
            images={product?.images || []}
            productName={product?.name || 'Mirror Aqua 10-Inch 5-Micron PP Spun Filter'}
          />
        </div>
      </div>
    </section>
  );
}

