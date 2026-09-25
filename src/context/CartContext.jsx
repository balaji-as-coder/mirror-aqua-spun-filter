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
    const pId = product.id || 'ma-prod-001';
    const pSku = product.sku || 'MA-PP-10-05M';
    const pPrice = Number(product.price) || 199;
    const pPack = (product.selectedPack || '').replace(/\s+/g, '-');
    const itemKey = `${pId}_${pSku}_${pPrice}_${pPack}`;

    setItems(prev => {
      const existingIdx = prev.findIndex(item => item.itemKey === itemKey || (item.productId === pId && item.unitPrice === pPrice));
      if (existingIdx >= 0) {
        return prev.map((item, idx) =>
          idx === existingIdx
            ? { ...item, quantity: item.quantity + quantity, product: { ...item.product, ...product } }
            : item
        );
      }
      return [...prev, {
        itemKey,
        productId: pId,
        quantity,
        unitPrice: pPrice,
        product
      }];
    });

    analytics.trackAddToCart(product, quantity);
    setIsCartOpen(true);
  };

  const addItem = (product, quantity = 1) => {
    addToCart(product, quantity);
  };

  const updateQuantity = (identifier, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(identifier);
      return;
    }

    setItems(prev =>
      prev.map(item => {
        const isMatch = item.itemKey === identifier || item.productId === identifier || item.product?.id === identifier;
        return isMatch ? { ...item, quantity: newQuantity } : item;
      })
    );

    // Optimistically update cartState for immediate UI feedback
    setCartState(prev => ({
      ...prev,
      items: (prev.items || []).map(item => {
        const isMatch = item.itemKey === identifier || item.productId === identifier || item.product?.id === identifier;
        if (isMatch) {
          const uPrice = item.unitPrice || item.product?.price || 199;
          return { ...item, quantity: newQuantity, lineTotal: uPrice * newQuantity };
        }
        return item;
      })
    }));
  };

  const removeFromCart = (identifier) => {
    const itemToRemove = items.find(item =>
      item.itemKey === identifier || item.productId === identifier || item.product?.id === identifier || item.product?.sku === identifier
    );

    if (itemToRemove && itemToRemove.product) {
      analytics.trackRemoveFromCart(itemToRemove.product, itemToRemove.quantity);
    }

    // Immediately remove from items
    setItems(prev => prev.filter(item => {
      const isMatch = item.itemKey === identifier || item.productId === identifier || item.product?.id === identifier || item.product?.sku === identifier;
      return !isMatch;
    }));

    // Optimistically remove from cartState so drawer & page update instantly
    setCartState(prev => {
      const remainingItems = (prev.items || []).filter(item => {
        const isMatch = item.itemKey === identifier || item.productId === identifier || item.product?.id === identifier || item.product?.sku === identifier;
        return !isMatch;
      });
      const newSubtotal = remainingItems.reduce((acc, it) => acc + (it.lineTotal || (it.unitPrice * it.quantity)), 0);
      const discount = prev.appliedCoupon ? Math.min(newSubtotal, prev.discountAmount || 0) : 0;
      const shipping = newSubtotal === 0 ? 0 : (newSubtotal >= 2500 ? 0 : (prev.shippingFee || 150));
      return {
        ...prev,
        items: remainingItems,
        subtotal: newSubtotal,
        discountAmount: discount,
        shippingFee: shipping,
        grandTotal: Math.max(0, newSubtotal - discount + shipping)
      };
    });
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
        addItem,
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
