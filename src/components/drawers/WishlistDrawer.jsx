import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { Button, Price } from '../ui/Primitives.jsx';
import './WishlistDrawer.css';

export function WishlistDrawer({ onNavigate }) {
  const { wishlist, removeFromWishlist, isWishlistOpen, setIsWishlistOpen } = useWishlist();
  const { addToCart } = useCart();

  if (!isWishlistOpen) return null;

  const handleMoveToCart = (product) => {
    addToCart(product, 1);
    removeFromWishlist(product.id);
  };

  return (
    <>
      <div
        className={`drawer-backdrop ${isWishlistOpen ? 'active' : ''}`}
        onClick={() => setIsWishlistOpen(false)}
        aria-hidden="true"
      />

      <div className={`drawer-panel wishlist-drawer ${isWishlistOpen ? 'active' : ''}`} role="dialog" aria-label="Saved Wishlist">
        <div className="cart-drawer-header">
          <div className="cart-header-title-wrap">
            <h3 className="cart-header-title">Saved Finds</h3>
            <span className="cart-item-count">({wishlist.length} saved)</span>
          </div>
          <button
            className="drawer-close-btn"
            onClick={() => setIsWishlistOpen(false)}
            aria-label="Close Wishlist"
          >
            <X size={20} />
          </button>
        </div>

        <div className="cart-drawer-body">
          {wishlist.length > 0 ? (
            <div className="cart-items-list">
              {wishlist.map((product) => (
                <div key={product.id} className="cart-item-row">
                  <img
                    src={product.images?.[0]?.url}
                    alt={product.name}
                    className="cart-item-thumb"
                  />
                  <div className="cart-item-details">
                    <span className="cart-item-craft">{product.craft}</span>
                    <h4
                      className="cart-item-name"
                      onClick={() => {
                        setIsWishlistOpen(false);
                        onNavigate(`/product/${product.slug}`);
                      }}
                    >
                      {product.name}
                    </h4>
                    <div className="cart-item-price-wrap">
                      <Price price={product.price} salePrice={product.salePrice} />
                    </div>

                    <div className="wishlist-item-actions">
                      <button
                        className="move-to-cart-btn"
                        onClick={() => handleMoveToCart(product)}
                      >
                        <ShoppingBag size={14} />
                        <span>Move to Cart</span>
                      </button>
                      <button
                        className="cart-item-remove-btn"
                        onClick={() => removeFromWishlist(product.id)}
                        aria-label="Remove from wishlist"
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
              <Heart size={48} className="empty-state-icon" />
              <h3 className="empty-state-title">Save something special for later</h3>
              <p className="empty-state-text">
                Tap the heart on any handmade find to curate your personal discovery list.
              </p>
              <Button
                variant="primary"
                onClick={() => {
                  setIsWishlistOpen(false);
                  onNavigate('/shop');
                }}
              >
                Explore Collection
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
