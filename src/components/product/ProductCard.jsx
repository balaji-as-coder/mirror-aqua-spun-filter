import React, { useState } from 'react';
import { Heart, Eye, ShoppingBag } from 'lucide-react';
import { Badge, Price, Rating } from '../ui/Primitives.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { useUI } from '../../context/UIContext.jsx';
import './ProductCard.css';

export function ProductCard({ product, onNavigate }) {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { openQuickView } = useUI();

  const isFavorited = isInWishlist(product.id);
  const primaryImg = product.images?.[0]?.url;
  const secondaryImg = product.images?.[1]?.url || primaryImg;

  const handleCardClick = (e) => {
    // Avoid triggering navigation if clicked on interactive buttons
    if (e.target.closest('button')) return;
    if (onNavigate) {
      onNavigate(`/product/${product.slug}`);
    }
  };

  return (
    <div
      className="product-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <div className="product-card-image-wrap">
        <img
          src={isHovered ? secondaryImg : primaryImg}
          alt={product.images?.[0]?.altText || product.name}
          className="product-card-image"
          loading="lazy"
        />

        {/* Badges Container */}
        <div className="product-card-badges">
          {product.isEditorsPick && (
            <Badge type="editors-pick" text="Editor's Pick" />
          )}
          {product.handmade && !product.isEditorsPick && (
            <Badge type="handmade" text="Handmade" />
          )}
          {product.limitedEdition && (
            <Badge type="limited" text="Limited" />
          )}
        </div>

        {/* Wishlist Button */}
        <button
          className={`product-card-wishlist-btn ${isFavorited ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          aria-label={isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart size={16} fill={isFavorited ? 'var(--accent-terracotta)' : 'none'} color={isFavorited ? 'var(--accent-terracotta)' : 'var(--text-primary)'} />
        </button>

        {/* Hover Action Bar */}
        <div className="product-card-actions">
          <button
            className="action-btn"
            onClick={(e) => {
              e.stopPropagation();
              openQuickView(product);
            }}
            title="Quick View"
          >
            <Eye size={15} />
            <span>Quick View</span>
          </button>
          <button
            className="action-btn action-btn-primary"
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product, 1);
            }}
            title="Add to Cart"
          >
            <ShoppingBag size={15} />
            <span>Add</span>
          </button>
        </div>
      </div>

      <div className="product-card-info">
        <span className="product-card-origin">
          {product.craft} • {product.placeOfOrigin}
        </span>
        <h3 className="product-card-title">{product.name}</h3>
        <p className="product-card-descriptor">{product.shortDescription}</p>

        <div className="product-card-bottom">
          <Price price={product.price} salePrice={product.salePrice} />
          <Rating score={5} count={product.stock > 10 ? 18 : 9} />
        </div>
      </div>
    </div>
  );
}
