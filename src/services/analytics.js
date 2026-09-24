/**
 * MIRROR AQUA ANALYTICS & UTM ATTRIBUTION PIPELINE
 * Preserves UTM campaign parameters across the entire funnel and dispatches standard GA4 / Meta Pixel e-commerce events.
 */

class AnalyticsService {
  constructor() {
    this.utmParams = this.captureUTMParams();
    this.trackedScrollDepths = new Set();
    this.initScrollListener();
  }

  captureUTMParams() {
    if (typeof window === 'undefined') return {};
    const urlParams = new URLSearchParams(window.location.search);
    const utm = {};
    const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
    
    keys.forEach(key => {
      const val = urlParams.get(key);
      if (val) utm[key] = val;
    });

    // Persist in session storage and localStorage for complete acquisition journey retention
    if (Object.keys(utm).length > 0) {
      try {
        sessionStorage.setItem('ma_utm_attribution', JSON.stringify(utm));
        localStorage.setItem('ma_first_touch_utm', JSON.stringify({ ...utm, capturedAt: new Date().toISOString() }));
      } catch (e) {}
    } else {
      try {
        const stored = sessionStorage.getItem('ma_utm_attribution') || localStorage.getItem('ma_first_touch_utm');
        if (stored) return JSON.parse(stored);
      } catch (e) {}
    }

    return utm;
  }

  initScrollListener() {
    if (typeof window === 'undefined') return;
    
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
          if (scrollHeight <= 0) return;
          
          const scrollPercent = Math.round((window.scrollY / scrollHeight) * 100);

          if (scrollPercent >= 25 && !this.trackedScrollDepths.has(25)) {
            this.trackedScrollDepths.add(25);
            this.trackEvent('scroll_25', { depth: '25%' });
          }
          if (scrollPercent >= 50 && !this.trackedScrollDepths.has(50)) {
            this.trackedScrollDepths.add(50);
            this.trackEvent('scroll_50', { depth: '50%' });
          }
          if (scrollPercent >= 75 && !this.trackedScrollDepths.has(75)) {
            this.trackedScrollDepths.add(75);
            this.trackEvent('scroll_75', { depth: '75%' });
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  getAttribution() {
    return this.utmParams;
  }

  trackEvent(eventName, payload = {}) {
    const enrichedPayload = {
      ...payload,
      timestamp: new Date().toISOString(),
      attribution: this.utmParams
    };

    // Console debug for local verification
    if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production') {
      console.log(`📊 [Mirror Aqua Analytics] ${eventName}:`, enrichedPayload);
    }

    // GA4 Integration Bridge (window.gtag)
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, enrichedPayload);
    }

    // Meta Pixel Bridge (window.fbq)
    if (typeof window !== 'undefined' && window.fbq) {
      if (eventName === 'view_item') window.fbq('track', 'ViewContent', enrichedPayload);
      if (eventName === 'add_to_cart') window.fbq('track', 'AddToCart', enrichedPayload);
      if (eventName === 'begin_checkout') window.fbq('track', 'InitiateCheckout', enrichedPayload);
      if (eventName === 'purchase') window.fbq('track', 'Purchase', enrichedPayload);
      if (eventName === 'bulk_enquiry' || eventName === 'dealer_enquiry') window.fbq('track', 'Lead', enrichedPayload);
    }
  }

  trackPageView(pagePath) {
    this.trackEvent('page_view', { page_path: pagePath || window.location.pathname });
  }

  trackViewItem(product) {
    this.trackEvent('view_item', {
      currency: 'INR',
      value: product.price,
      items: [{
        item_id: product.sku || product.id,
        item_name: product.name,
        item_category: product.category,
        price: product.price,
        micron: product.specifications?.micron || '5 Micron',
        size: product.specifications?.size || '10 Inch'
      }]
    });
  }

  trackQuantitySelect(product, quantity, tierLabel) {
    this.trackEvent('quantity_select', {
      product_id: product.id || product.sku,
      product_name: product.name,
      quantity,
      tier_label: tierLabel,
      total_value: product.price * quantity
    });
  }

  trackAddToCart(product, quantity = 1) {
    this.trackEvent('add_to_cart', {
      currency: 'INR',
      value: product.price * quantity,
      items: [{
        item_id: product.sku || product.id,
        item_name: product.name,
        price: product.price,
        quantity: quantity
      }]
    });
  }

  trackBuyNow(product, quantity = 1) {
    this.trackEvent('buy_now', {
      currency: 'INR',
      value: product.price * quantity,
      product_id: product.sku || product.id,
      quantity
    });
  }

  trackBeginCheckout(cartItems, totalValue) {
    this.trackEvent('begin_checkout', {
      currency: 'INR',
      value: totalValue,
      items: cartItems.map(item => ({
        item_id: item.product.sku || item.product.id,
        item_name: item.product.name,
        price: item.product.price,
        quantity: item.quantity
      }))
    });
  }

  trackPaymentStart(orderId, amount, method) {
    this.trackEvent('payment_start', {
      order_id: orderId,
      value: amount,
      currency: 'INR',
      method
    });
  }

  trackPaymentFailure(orderId, error) {
    this.trackEvent('payment_failure', {
      order_id: orderId,
      error_message: typeof error === 'string' ? error : error?.message || 'Payment failed'
    });
  }

  trackPurchase(orderData) {
    this.trackEvent('purchase', {
      transaction_id: orderData.orderId,
      value: orderData.total,
      currency: 'INR',
      shipping: orderData.shippingFee,
      items: orderData.items,
      attribution: this.utmParams
    });
  }

  trackCouponApply(couponCode, success, discountAmount = 0) {
    this.trackEvent('coupon_apply', {
      coupon_code: couponCode,
      success,
      discount_amount: discountAmount
    });
  }

  trackWhatsAppClick(context, product, quantity = 1) {
    this.trackEvent('whatsapp_click', {
      context, // 'hero_order' | 'compatibility_help' | 'floating_cta' | 'bulk_chat'
      product_id: product?.id || 'general',
      product_name: product?.name || 'Mirror Aqua Inquiry',
      quantity
    });
  }

  trackCompatibilityEnquiry(purifierModel, bowlType) {
    this.trackEvent('compatibility_enquiry', {
      purifier_model: purifierModel,
      bowl_type: bowlType
    });
  }

  trackBulkEnquiry(leadData) {
    this.trackEvent('bulk_enquiry', {
      product_id: leadData.productId,
      quantity: leadData.requiredQuantity,
      city: leadData.city,
      business_name: leadData.businessName
    });
  }

  trackDealerEnquiry(leadData) {
    this.trackEvent('dealer_enquiry', {
      city: leadData.city,
      district: leadData.district,
      business_name: leadData.businessName
    });
  }
}

export const analytics = new AnalyticsService();
