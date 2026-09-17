import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { wooCommerceService } from '../services/woocommerce.js';
import { analytics } from '../services/analytics.js';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('kc_cart_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [couponCode, setCouponCode] = useState('');
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartState, setCartState] = useState({
    isValid: true,
    errors: [],
    items: [],
    subtotal: 0,
    discountAmount: 0,
    appliedCoupon: null,
    shippingFee: 0,
    taxAmount: 0,
    grandTotal: 0,
    freeShippingRemaining: 2500
  });
  const [isValidating, setIsValidating] = useState(false);

  // Authoritative validation with WooCommerce
  const refreshCart = useCallback(async (currentItems, currentCoupon, currentShipping) => {
    setIsValidating(true);
    try {
      const validated = await wooCommerceService.validateCart(currentItems, currentCoupon, currentShipping);
      setCartState(validated);
    } catch (err) {
      console.error('Cart validation error:', err);
    } finally {
      setIsValidating(false);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('kc_cart_items', JSON.stringify(items));
    } catch (e) {}
    refreshCart(items, couponCode, shippingMethod);
  }, [items, couponCode, shippingMethod, refreshCart]);

  const addToCart = (product, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        return prev.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { productId: product.id, quantity, product }];
    });

    analytics.trackAddToCart(product, quantity);
    setIsCartOpen(true);
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    const itemToRemove = items.find(item => item.productId === productId);
    if (itemToRemove && itemToRemove.product) {
      analytics.trackRemoveFromCart(itemToRemove.product, itemToRemove.quantity);
    }
    setItems(prev => prev.filter(item => item.productId !== productId));
  };

  const applyCoupon = (code) => {
    setCouponCode(code);
  };

  const removeCoupon = () => {
    setCouponCode('');
  };

  const clearCart = () => {
    setItems([]);
    setCouponCode('');
  };

  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        cartState,
        isValidating,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        applyCoupon,
        removeCoupon,
        couponCode,
        shippingMethod,
        setShippingMethod,
        clearCart,
        totalItemCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
