import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { wooCommerceService } from '../services/woocommerce.js';
import { isFreeShippingRegion } from '../services/shipping.js';
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

  const [deliveryRegion, setDeliveryRegionState] = useState(() => {
    try {
      const saved = localStorage.getItem('kc_delivery_region');
      return saved ? JSON.parse(saved) : { pincode: '', state: '' };
    } catch {
      return { pincode: '', state: '' };
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
    freeShippingRemaining: 2500,
    isAPTS: false
  });
  const [isValidating, setIsValidating] = useState(false);

  // Authoritative validation with WooCommerce
  const refreshCart = useCallback(async (currentItems, currentCoupon, currentShipping, currentRegion) => {
    setIsValidating(true);
    try {
      const region = currentRegion || deliveryRegion;
      const validated = await wooCommerceService.validateCart(
        currentItems,
        currentCoupon,
        currentShipping,
        region
      );
      setCartState(validated);
    } catch (err) {
      console.error('Cart validation error:', err);
    } finally {
      setIsValidating(false);
    }
  }, [deliveryRegion]);

  const setDeliveryRegion = (region) => {
    const updated = typeof region === 'function' ? region(deliveryRegion) : region;
    setDeliveryRegionState(updated);
    try {
      localStorage.setItem('kc_delivery_region', JSON.stringify(updated));
    } catch (e) {}
    refreshCart(items, couponCode, shippingMethod, updated);
  };

  useEffect(() => {
    try {
      localStorage.setItem('kc_cart_items', JSON.stringify(items));
    } catch (e) {}
    refreshCart(items, couponCode, shippingMethod, deliveryRegion);
  }, [items, couponCode, shippingMethod, deliveryRegion, refreshCart]);

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

  const updateQuantity = (identifier, newQuantity, index = -1) => {
    if (newQuantity <= 0) {
      removeFromCart(identifier, index);
      return;
    }

    setItems(prev =>
      prev.map((item, idx) => {
        const isMatch =
          (typeof index === 'number' && index >= 0 && idx === index) ||
          item.itemKey === identifier ||
          item.productId === identifier ||
          item.product?.id === identifier ||
          String(item.itemKey) === String(identifier) ||
          String(item.productId) === String(identifier);
        return isMatch ? { ...item, quantity: newQuantity } : item;
      })
    );

    // Optimistically update cartState for immediate UI feedback
    setCartState(prev => ({
      ...prev,
      items: (prev.items || []).map((item, idx) => {
        const isMatch =
          (typeof index === 'number' && index >= 0 && idx === index) ||
          item.itemKey === identifier ||
          item.productId === identifier ||
          item.product?.id === identifier ||
          String(item.itemKey) === String(identifier) ||
          String(item.productId) === String(identifier);
        if (isMatch) {
          const uPrice = item.unitPrice || item.product?.price || 199;
          return { ...item, quantity: newQuantity, lineTotal: uPrice * newQuantity };
        }
        return item;
      })
    }));
  };

  const removeFromCart = (identifier, index = -1) => {
    // 1. Identify and track analytics
    let itemToRemove = null;
    if (typeof index === 'number' && index >= 0 && index < items.length) {
      itemToRemove = items[index];
    } else {
      itemToRemove = items.find(item =>
        item.itemKey === identifier ||
        item.productId === identifier ||
        item.product?.id === identifier ||
        item.product?.sku === identifier ||
        String(item.itemKey) === String(identifier) ||
        String(item.productId) === String(identifier)
      );
    }

    if (itemToRemove && itemToRemove.product) {
      analytics.trackRemoveFromCart(itemToRemove.product, itemToRemove.quantity);
    }

    // 2. Compute updated items array
    let newItems = [];
    setItems(prev => {
      // Direct single item case
      if (prev.length <= 1) {
        newItems = [];
        try { localStorage.setItem('kc_cart_items', JSON.stringify([])); } catch (e) {}
        return [];
      }

      // Check if index match is valid
      if (typeof index === 'number' && index >= 0 && index < prev.length) {
        newItems = prev.filter((_, idx) => idx !== index);
        try { localStorage.setItem('kc_cart_items', JSON.stringify(newItems)); } catch (e) {}
        return newItems;
      }

      // Identifier filter
      newItems = prev.filter(item => {
        const isMatch =
          item.itemKey === identifier ||
          item.productId === identifier ||
          item.product?.id === identifier ||
          item.product?.sku === identifier ||
          String(item.itemKey) === String(identifier) ||
          String(item.productId) === String(identifier) ||
          String(item.product?.id) === String(identifier);
        return !isMatch;
      });

      // Fallback: If nothing was filtered but user clicked remove on a single/last remaining element
      if (newItems.length === prev.length && prev.length > 0) {
        newItems = prev.slice(0, prev.length - 1);
      }

      try { localStorage.setItem('kc_cart_items', JSON.stringify(newItems)); } catch (e) {}
      return newItems;
    });

    // 3. Optimistically update cartState for immediate rendering
    setCartState(prev => {
      let remainingItems = [];
      if (typeof index === 'number' && index >= 0 && index < (prev.items || []).length) {
        remainingItems = (prev.items || []).filter((_, idx) => idx !== index);
      } else {
        remainingItems = (prev.items || []).filter(item => {
          const isMatch =
            item.itemKey === identifier ||
            item.productId === identifier ||
            item.product?.id === identifier ||
            item.product?.sku === identifier ||
            String(item.itemKey) === String(identifier) ||
            String(item.productId) === String(identifier) ||
            String(item.product?.id) === String(identifier);
          return !isMatch;
        });
      }

      if (remainingItems.length === (prev.items || []).length && (prev.items || []).length <= 1) {
        remainingItems = [];
      }

      const isAPTS = isFreeShippingRegion(deliveryRegion?.pincode, deliveryRegion?.state);
      const newSubtotal = remainingItems.reduce((acc, it) => acc + (it.lineTotal || (it.unitPrice * it.quantity)), 0);
      const discount = prev.appliedCoupon ? Math.min(newSubtotal, prev.discountAmount || 0) : 0;
      const shipping = newSubtotal === 0 ? 0 : (isAPTS || newSubtotal >= 2500 ? 0 : (prev.shippingFee || 150));
      const grandTotal = Math.max(0, newSubtotal - discount + shipping);

      return {
        ...prev,
        items: remainingItems,
        subtotal: newSubtotal,
        discountAmount: discount,
        shippingFee: shipping,
        grandTotal,
        isAPTS,
        freeShippingRemaining: (isAPTS || newSubtotal >= 2500) ? 0 : Math.max(0, 2500 - newSubtotal)
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
    try {
      localStorage.setItem('kc_cart_items', JSON.stringify([]));
    } catch (e) {}
    setCartState({
      isValid: true,
      errors: [],
      items: [],
      subtotal: 0,
      discountAmount: 0,
      appliedCoupon: null,
      shippingFee: 0,
      taxAmount: 0,
      grandTotal: 0,
      freeShippingRemaining: 2500,
      isAPTS: isFreeShippingRegion(deliveryRegion?.pincode, deliveryRegion?.state)
    });
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
        totalItemCount,
        deliveryRegion,
        setDeliveryRegion
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);

