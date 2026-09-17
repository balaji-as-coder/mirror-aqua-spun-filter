import React, { useState, useEffect } from 'react';
import {
  Heart,
  ShoppingBag,
  Zap,
  MessageCircle,
  ShieldCheck,
  Truck,
  RefreshCw,
  ChevronRight,
  CheckCircle2,
  Check,
  Package
} from 'lucide-react';
import { PRODUCTS } from '../data/products.js';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { Button, Badge, Price, Rating } from '../components/ui/Primitives.jsx';
import { WhyWePickedIt } from '../components/ui/WhyWePickedIt.jsx';
import { ProductCard } from '../components/product/ProductCard.jsx';
import { analytics } from '../services/analytics.js';
import { wooCommerceService } from '../services/woocommerce.js';
import './ProductDetailPage.css';

export function ProductDetailPage({ slug, onNavigate }) {
  const product = PRODUCTS.find(p => p.slug === slug) || PRODUCTS[0];
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('story'); // 'story' | 'process' | 'specs' | 'shipping' | 'reviews'
  const [liveReviews, setLiveReviews] = useState([]);

  const { addToCart, setIsCartOpen } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const isFavorited = isInWishlist(product.id);
  const relatedProducts = PRODUCTS.filter(p => p.id !== product.id).slice(0, 3);

  useEffect(() => {
    window.scrollTo(0, 0);
    analytics.trackViewItem(product);
    wooCommerceService.getProductReviews(product.id).then(res => setLiveReviews(res));
  }, [product]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    setIsCartOpen(false);
    onNavigate('/checkout');
  };

  const whatsappInquiryUrl = `https://wa.me/${import.meta.env.VITE_WHATSAPP_BUSINESS_NUMBER || '919876543210'}?text=${encodeURIComponent(
    `Hello Mirror Craft! I am inquiring about "${product.name}" (SKU: ${product.sku}). Is this piece in stock? ${window.location.href}`
  )}`;

  return (
    <div className="product-detail-wrapper">
      {/* Breadcrumb Navigation */}
      <div className="container breadcrumb-container">
        <nav className="breadcrumbs" aria-label="Breadcrumbs">
          <a href="/" onClick={(e) => { e.preventDefault(); onNavigate('/'); }}>Home</a>
          <ChevronRight size={14} className="breadcrumb-separator" />
          <a href="/shop" onClick={(e) => { e.preventDefault(); onNavigate('/shop'); }}>Shop</a>
          <ChevronRight size={14} className="breadcrumb-separator" />
          <a href="/shop" onClick={(e) => { e.preventDefault(); onNavigate('/shop'); }}>{product.category}</a>
          <ChevronRight size={14} className="breadcrumb-separator" />
          <span className="breadcrumb-current">{product.name}</span>
        </nav>
      </div>

      <div className="container product-main-grid">
        {/* Gallery Column */}
        <div className="product-gallery-col">
          <div className="gallery-main-image-wrap">
            <img
              src={product.images[selectedImageIndex]?.url || product.images[0]?.url}
              alt={product.images[selectedImageIndex]?.altText || product.name}
              className="gallery-main-image"
            />
            <div className="gallery-badges">
              {product.isEditorsPick && <Badge type="editors-pick" text="Editor's Pick" />}
              {product.handmade && !product.isEditorsPick && <Badge type="handmade" text="Handmade" />}
              {product.verificationStatus === 'verified' && <Badge type="verified" text="VERIFIED" />}
            </div>
          </div>

          {product.images.length > 1 && (
            <div className="gallery-thumbnail-strip">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  className={`gallery-thumb-btn ${selectedImageIndex === idx ? 'active' : ''}`}
                  onClick={() => setSelectedImageIndex(idx)}
                  aria-label={`View image ${idx + 1}`}
                >
                  <img src={img.url} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Information Column */}
        <div className="product-info-col">
          <div className="product-provenance-tag">
            <span>{product.craft}</span> • <span>{product.placeOfOrigin}</span>
          </div>

          <h1 className="product-page-title">{product.name}</h1>

          <div className="product-price-rating-row">
            <div className="price-tag-wrap">
              <Price price={product.price} salePrice={product.salePrice} />
              <span className="tax-inclusive-note">(Inclusive of all taxes)</span>
            </div>
            <Rating score={5} count={liveReviews.length} />
          </div>

          <p className="product-short-desc">{product.shortDescription}</p>

          {/* Granular Authenticity Verification Checklist */}
          <div className="verification-flags-box">
            {product.sourceVerified && (
              <span className="verification-flag-item">
                <Check size={13} className="flag-icon" /> Source Verified
              </span>
            )}
            {product.originVerified && (
              <span className="verification-flag-item">
                <Check size={13} className="flag-icon" /> Origin Verified
              </span>
            )}
            {product.handmadeVerified && (
              <span className="verification-flag-item">
                <Check size={13} className="flag-icon" /> Handmade Verified
              </span>
            )}
            {product.qualityVerified && (
              <span className="verification-flag-item">
                <Check size={13} className="flag-icon" /> Quality Checked
              </span>
            )}
          </div>

          {/* Signature UI: WHY WE PICKED IT */}
          {product.whyWePickedIt && (
            <WhyWePickedIt points={product.whyWePickedIt} />
          )}

          {/* Quantity & CTA Purchase Group */}
          <div className="purchase-controls-wrap">
            <div className="qty-picker">
              <button
                className="qty-picker-btn"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="qty-picker-num">{quantity}</span>
              <button
                className="qty-picker-btn"
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <Button
              variant="accent"
              className="pdp-add-btn"
              onClick={handleAddToCart}
            >
              <ShoppingBag size={18} />
              <span>ADD TO CART</span>
            </Button>

            <Button
              variant="primary"
              className="pdp-buy-now-btn"
              onClick={handleBuyNow}
            >
              <Zap size={18} />
              <span>BUY NOW</span>
            </Button>

            <button
              className={`pdp-wishlist-toggle ${isFavorited ? 'active' : ''}`}
              onClick={() => toggleWishlist(product)}
              aria-label={isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
              <Heart
                size={20}
                fill={isFavorited ? 'var(--accent-terracotta)' : 'none'}
                color={isFavorited ? 'var(--accent-terracotta)' : 'var(--text-primary)'}
              />
            </button>
          </div>

          {/* WhatsApp Direct Product Inquiry (Clean SKU & URL without PII) */}
          <a
            href={whatsappInquiryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-pdp-inquiry"
          >
            <MessageCircle size={18} />
            <span>Ask about this piece or request custom gift packaging on WhatsApp</span>
          </a>

          {/* Quick Assurance Badges */}
          <div className="assurance-badges-grid">
            <div className="assurance-item">
              <ShieldCheck size={18} className="assurance-icon" />
              <span>Direct Fair-Wage Artisan Sourced</span>
            </div>
            <div className="assurance-item">
              <Truck size={18} className="assurance-icon" />
              <span>Protective Cushioning for Safe Transit</span>
            </div>
            <div className="assurance-item">
              <RefreshCw size={18} className="assurance-icon" />
              <span>7-Day Doorstep Replacement Guarantee</span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          EDITORIAL STORY & SPECIFICATIONS TABS
          ========================================================================= */}
      <div className="container editorial-tabs-section">
        <div className="tabs-nav-bar">
          <button
            className={`tab-btn ${activeTab === 'story' ? 'active' : ''}`}
            onClick={() => setActiveTab('story')}
          >
            The Story & Provenance
          </button>
          <button
            className={`tab-btn ${activeTab === 'process' ? 'active' : ''}`}
            onClick={() => setActiveTab('process')}
          >
            How It’s Made
          </button>
          <button
            className={`tab-btn ${activeTab === 'specs' ? 'active' : ''}`}
            onClick={() => setActiveTab('specs')}
          >
            Specifications & Care
          </button>
          <button
            className={`tab-btn ${activeTab === 'shipping' ? 'active' : ''}`}
            onClick={() => setActiveTab('shipping')}
          >
            Shipping & Packaging
          </button>
          <button
            className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Customer Reviews ({liveReviews.length})
          </button>
        </div>

        <div className="tab-content-panel">
          {/* TAB 1: THE STORY & WHY IT'S SPECIAL */}
          {activeTab === 'story' && (
            <div className="story-tab-body">
              <div className="why-its-special-callout">
                <span className="callout-eyebrow">Why It's Special</span>
                <p className="callout-text">{product.whyItsSpecial}</p>
              </div>

              <div className="artisan-story-narrative">
                <h3 className="tab-section-title">The Heritage of {product.craft}</h3>
                <p className="story-paragraph">{product.description}</p>
                {product.makerStory && (
                  <div className="maker-bio-box">
                    <strong>Artisan Guild: {product.artisan}</strong>
                    <p>{product.makerStory}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: HOW IT'S MADE */}
          {activeTab === 'process' && (
            <div className="process-tab-body">
              <h3 className="tab-section-title">Crafting Steps</h3>
              <p className="process-intro">
                Every piece is shaped by hand through multi-day artisanal steps passed down through generations.
              </p>
              <div className="process-steps-grid">
                {product.makingProcess?.map((step) => (
                  <div key={step.step} className="step-card">
                    <div className="step-number-badge">Step {step.step}</div>
                    <h4 className="step-card-title">{step.title}</h4>
                    <p className="step-card-desc">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SPECIFICATIONS */}
          {activeTab === 'specs' && (
            <div className="specs-tab-body">
              <table className="specs-table">
                <tbody>
                  <tr>
                    <th>Materials</th>
                    <td>{product.materials?.join(', ')}</td>
                  </tr>
                  <tr>
                    <th>Dimensions</th>
                    <td>{product.dimensions}</td>
                  </tr>
                  <tr>
                    <th>Weight</th>
                    <td>{product.weight}</td>
                  </tr>
                  <tr>
                    <th>Place of Origin</th>
                    <td>{product.placeOfOrigin}, {product.region}</td>
                  </tr>
                  <tr>
                    <th>Care Instructions</th>
                    <td>{product.careInstructions}</td>
                  </tr>
                  <tr>
                    <th>Quality Check</th>
                    <td>{product.qualityInformation}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 4: SHIPPING & PACKAGING */}
          {activeTab === 'shipping' && (
            <div className="shipping-tab-body">
              <div className="shipping-info-grid">
                <div className="shipping-info-card">
                  <Package size={28} className="info-card-icon" />
                  <h4>Protective Packaging</h4>
                  <p>Carefully cushioned in protective Kraft packaging designed to protect your purchase in transit.</p>
                </div>
                <div className="shipping-info-card">
                  <Truck size={28} className="info-card-icon" />
                  <h4>Transit Timelines</h4>
                  <p>{product.shippingInformation}</p>
                </div>
                <div className="shipping-info-card">
                  <RefreshCw size={28} className="info-card-icon" />
                  <h4>Return & Replacement</h4>
                  <p>{product.returnInformation}</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CUSTOMER REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="reviews-tab-body">
              {liveReviews.length > 0 ? (
                <div className="pdp-reviews-list">
                  {liveReviews.map((rev) => (
                    <div key={rev.id} className="pdp-review-item">
                      <div className="review-top-meta">
                        <strong>{rev.reviewer}</strong>
                        {rev.verified && (
                          <span className="verified-pill">
                            <CheckCircle2 size={12} color="var(--color-success)" /> Verified Purchase
                          </span>
                        )}
                      </div>
                      <div className="pdp-review-stars">{'★'.repeat(rev.rating || 5)}</div>
                      <div className="pdp-review-text" dangerouslySetInnerHTML={{ __html: rev.review }} />
                      <span className="review-date">{new Date(rev.date_created).toLocaleDateString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: 'var(--space-2xl)', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xs)' }}>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-sm)' }}>
                    No reviews yet for this handmade piece.
                  </p>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    Be the first patron to share your experience after receiving your order.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          YOU MAY ALSO LIKE (RECOMMENDATIONS)
          ========================================================================= */}
      <div className="container related-products-section">
        <div className="section-header">
          <span className="section-eyebrow">Complementary Discoveries</span>
          <h2 className="section-title">YOU MAY ALSO LIKE</h2>
        </div>
        <div className="products-grid-3">
          {relatedProducts.map((rel) => (
            <ProductCard key={rel.id} product={rel} onNavigate={onNavigate} />
          ))}
        </div>
      </div>

      {/* =========================================================================
          MOBILE STICKY ADD TO CART BAR
          ========================================================================= */}
      <div className="mobile-sticky-buy-bar">
        <div className="sticky-bar-left">
          <span className="sticky-product-name">{product.name}</span>
          <Price price={product.price} salePrice={product.salePrice} />
        </div>
        <Button variant="accent" size="sm" onClick={handleAddToCart}>
          <ShoppingBag size={14} />
          <span>Add to Cart</span>
        </Button>
      </div>
    </div>
  );
}
