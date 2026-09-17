import React, { useState } from 'react';
import { X, Heart, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { useUI } from '../../context/UIContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { Button, Badge, Price, Rating } from '../ui/Primitives.jsx';
import { WhyWePickedIt } from '../ui/WhyWePickedIt.jsx';
import './QuickViewModal.css';

export function QuickViewModal({ onNavigate }) {
  const { quickViewProduct, closeQuickView } = useUI();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!quickViewProduct) return null;

  const isFavorited = isInWishlist(quickViewProduct.id);
  const currentImage = quickViewProduct.images?.[selectedImgIndex]?.url || quickViewProduct.images?.[0]?.url;

  const handleAddToCart = () => {
    addToCart(quickViewProduct, quantity);
    closeQuickView();
  };

  const handleViewFullProduct = () => {
    closeQuickView();
    onNavigate(`/product/${quickViewProduct.slug}`);
  };

  return (
    <div
      className="modal-backdrop active"
      onClick={closeQuickView}
      role="dialog"
      aria-modal="true"
      aria-label={quickViewProduct.name}
    >
      <div className="modal-content quick-view-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={closeQuickView} aria-label="Close Preview">
          <X size={20} />
        </button>

        <div className="quick-view-grid">
          {/* Gallery Side */}
          <div className="quick-view-gallery">
            <div className="quick-view-main-image-wrap">
              <img
                src={currentImage}
                alt={quickViewProduct.name}
                className="quick-view-main-img"
              />
              <div className="quick-view-badges">
                {quickViewProduct.isEditorsPick && <Badge type="editors-pick" text="Editor's Pick" />}
                {quickViewProduct.handmade && !quickViewProduct.isEditorsPick && <Badge type="handmade" text="Handmade" />}
              </div>
            </div>

            {quickViewProduct.images && quickViewProduct.images.length > 1 && (
              <div className="quick-view-thumbnails">
                {quickViewProduct.images.map((img, idx) => (
                  <button
                    key={idx}
                    className={`qv-thumb-btn ${selectedImgIndex === idx ? 'active' : ''}`}
                    onClick={() => setSelectedImgIndex(idx)}
                  >
                    <img src={img.url} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Side */}
          <div className="quick-view-details">
            <div className="quick-view-origin-tag">
              {quickViewProduct.craft} • {quickViewProduct.placeOfOrigin}
            </div>

            <h2 className="quick-view-title">{quickViewProduct.name}</h2>

            <div className="quick-view-meta-row">
              <Price price={quickViewProduct.price} salePrice={quickViewProduct.salePrice} />
              <Rating score={5} count={16} />
            </div>

            <p className="quick-view-desc">{quickViewProduct.description}</p>

            {/* Why We Picked It Component */}
            {quickViewProduct.whyWePickedIt && (
              <WhyWePickedIt points={quickViewProduct.whyWePickedIt} />
            )}

            <div className="quick-view-specs-snippet">
              <div className="spec-snippet-item">
                <span className="spec-snippet-label">Materials:</span>
                <span className="spec-snippet-val">{quickViewProduct.materials?.join(', ')}</span>
              </div>
              <div className="spec-snippet-item">
                <span className="spec-snippet-label">Dimensions:</span>
                <span className="spec-snippet-val">{quickViewProduct.dimensions}</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="quick-view-actions">
              <div className="quick-view-qty-control">
                <button
                  className="qv-qty-btn"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="qv-qty-num">{quantity}</span>
                <button
                  className="qv-qty-btn"
                  onClick={() => setQuantity(Math.min(quickViewProduct.stock, quantity + 1))}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <Button variant="accent" className="qv-add-to-cart-btn" onClick={handleAddToCart}>
                <ShoppingBag size={16} />
                <span>Add to Cart</span>
              </Button>

              <button
                className={`qv-wishlist-toggle ${isFavorited ? 'active' : ''}`}
                onClick={() => toggleWishlist(quickViewProduct)}
                aria-label="Wishlist"
              >
                <Heart size={18} fill={isFavorited ? 'var(--accent-terracotta)' : 'none'} color={isFavorited ? 'var(--accent-terracotta)' : 'var(--text-primary)'} />
              </button>
            </div>

            <button className="qv-full-details-link" onClick={handleViewFullProduct}>
              <span>Read Full Provenance & Crafting Story</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
