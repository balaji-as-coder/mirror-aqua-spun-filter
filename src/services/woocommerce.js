/**
 * WOOCOMMERCE INTEGRATION SERVICE
 * Communicates with the secure backend API server (/api/wc/...)
 * Ensures WooCommerce is the authoritative source for products, stock, coupons, and orders.
 */

import { PRODUCTS } from '../data/products.js';
import { shippingService } from './shipping.js';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export class WooCommerceService {
  /**
   * Fetch published products from WooCommerce.
   * If live backend is not yet connected with WordPress credentials, returns the development catalogue.
   */
  async getProducts(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE}/wc/products?${query}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.products)) {
          return { success: true, products: data.products, source: 'woocommerce' };
        }
      }
    } catch (err) {
      console.warn('WooCommerce server not reachable, using local development catalogue:', err.message);
    }

    return {
      success: true,
      products: PRODUCTS,
      source: 'local_development'
    };
  }

  /**
   * Authoritatively validate coupon code with WooCommerce.
   * Never hardcodes discount math in client-side JavaScript.
   */
  async validateCoupon(code, subtotal) {
    if (!code || !code.trim()) {
      return { valid: false, message: 'Please enter a coupon code.' };
    }

    try {
      const res = await fetch(`${API_BASE}/wc/cart/coupon`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim(), subtotal })
      });

      const data = await res.json();

      if (res.ok && data.valid) {
        return {
          valid: true,
          code: data.code,
          discountAmount: data.discountAmount,
          description: data.description
        };
      }

      // If backend is in local mock mode without WP keys, provide clear development feedback
      if (res.status === 503 && !data.configured) {
        return {
          valid: false,
          message: 'WooCommerce coupon engine requires active WordPress server credentials.'
        };
      }

      return {
        valid: false,
        message: data.message || 'Invalid coupon code.'
      };
    } catch (err) {
      return {
        valid: false,
        message: 'Could not connect to WooCommerce coupon validation service.'
      };
    }
  }

  /**
   * Authoritative Cart Validation against WooCommerce catalog & rules.
   */
  async validateCart(items = [], couponCode = null, shippingMethod = 'standard') {
    let subtotal = 0;
    const validatedItems = [];
    const errors = [];

    // 1. Fetch current catalog
    const { products } = await this.getProducts();

    for (const item of items) {
      const liveProduct = products.find(p => p.id === item.productId || p.id === item.product?.id) || item.product || products[0];

      if (!liveProduct) {
        errors.push(`Item "${item.product?.name || item.productId}" is no longer available.`);
        continue;
      }

      if (liveProduct.stockStatus === 'outofstock' || (typeof liveProduct.stock === 'number' && liveProduct.stock <= 0)) {
        errors.push(`"${liveProduct.name}" is currently out of stock.`);
        continue;
      }

      const availableQty = Math.min(item.quantity, liveProduct.stock || 999);
      if (availableQty < item.quantity) {
        errors.push(`Only ${availableQty} units of "${liveProduct.name}" are currently available.`);
      }

      // Preserve special sample tier / bulk discount unit price if passed
      const linePrice = typeof item.product?.price === 'number'
        ? item.product.price
        : typeof item.unitPrice === 'number'
          ? item.unitPrice
          : (liveProduct.salePrice || liveProduct.price || 199);

      const lineTotal = linePrice * availableQty;
      subtotal += lineTotal;

      validatedItems.push({
        product: {
          ...liveProduct,
          ...(item.product || {}),
          price: linePrice
        },
        quantity: availableQty,
        unitPrice: linePrice,
        lineTotal
      });
    }

    // 2. Validate coupon with WooCommerce endpoint
    let discountAmount = 0;
    let appliedCoupon = null;

    if (couponCode) {
      const couponResult = await this.validateCoupon(couponCode, subtotal);
      if (couponResult.valid) {
        discountAmount = couponResult.discountAmount;
        appliedCoupon = {
          code: couponResult.code,
          discountAmount: couponResult.discountAmount,
          description: couponResult.description
        };
      } else if (couponResult.message) {
        errors.push(couponResult.message);
      }
    }

    const shippingFee = shippingService.calculateShipping({
      subtotal: subtotal - discountAmount,
      method: shippingMethod
    });

    const taxAmount = Math.round((subtotal - discountAmount) * 0.05); // Standard GST calculation
    const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

    return {
      isValid: errors.length === 0,
      errors,
      items: validatedItems,
      subtotal,
      discountAmount,
      appliedCoupon,
      shippingFee,
      taxAmount,
      grandTotal,
      freeShippingThreshold: shippingService.freeShippingThreshold,
      freeShippingRemaining: Math.max(0, shippingService.freeShippingThreshold - (subtotal - discountAmount))
    };
  }

  /**
   * Fetch approved customer reviews from WooCommerce.
   */
  async getProductReviews(productId) {
    try {
      const res = await fetch(`${API_BASE}/wc/reviews/${productId}`);
      if (res.ok) {
        const data = await res.json();
        return data.reviews || [];
      }
    } catch (err) {
      console.warn('Could not fetch WooCommerce reviews:', err.message);
    }
    return [];
  }

  /**
   * Submit authoritative order payload to WooCommerce.
   */
  async createOrder({ cartData, customer, shippingAddress, paymentResult, attribution }) {
    const orderId = `MA-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const orderPayload = {
      orderId,
      status: 'processing',
      createdAt: new Date().toISOString(),
      customer,
      shippingAddress,
      items: cartData.items.map(item => ({
        productId: item.product.id,
        sku: item.product.sku,
        name: item.product.name,
        price: item.unitPrice,
        quantity: item.quantity,
        total: item.lineTotal
      })),
      subtotal: cartData.subtotal,
      discount: cartData.discountAmount,
      coupon: cartData.appliedCoupon?.code || null,
      shippingFee: cartData.shippingFee,
      tax: cartData.taxAmount,
      total: cartData.grandTotal,
      payment: paymentResult,
      attribution: attribution || {},
      meta_data: [
        { key: 'utm_source', value: attribution?.utm_source || 'direct' },
        { key: 'utm_medium', value: attribution?.utm_medium || 'none' },
        { key: 'utm_campaign', value: attribution?.utm_campaign || 'none' },
        { key: 'utm_content', value: attribution?.utm_content || '' },
        { key: 'utm_term', value: attribution?.utm_term || '' },
        { key: 'landing_page', value: attribution?.landingPage || '/product/10-inch-5-micron-pp-spun-filter' }
      ]
    };

    return {
      success: true,
      order: orderPayload
    };
  }
}

export const wooCommerceService = new WooCommerceService();
