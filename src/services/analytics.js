/**
 * ANALYTICS & UTM ATTRIBUTION PIPELINE
 * Preserves UTM campaign parameters and dispatches standard GA4 / Meta Pixel e-commerce events.
 */

class AnalyticsService {
  constructor() {
    this.utmParams = this.captureUTMParams();
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

    // Persist in session storage if found
    if (Object.keys(utm).length > 0) {
      try {
        sessionStorage.setItem('kc_utm_attribution', JSON.stringify(utm));
      } catch (e) {
        // Storage unavailable
      }
    } else {
      try {
        const stored = sessionStorage.getItem('kc_utm_attribution');
        if (stored) return JSON.parse(stored);
      } catch (e) {}
    }

    return utm;
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
    if (process.env.NODE_ENV !== 'production') {
      console.log(`📊 [Analytics Event] ${eventName}:`, enrichedPayload);
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
    }
  }

  trackViewItemList(category, itemCount) {
    this.trackEvent('view_item_list', { item_list_name: category, item_count: itemCount });
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
        craft: product.craft,
        region: product.region
      }]
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

  trackRemoveFromCart(product, quantity = 1) {
    this.trackEvent('remove_from_cart', {
      currency: 'INR',
      value: product.price * quantity,
      items: [{ item_id: product.sku || product.id, item_name: product.name, quantity }]
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

  trackStoryView(story) {
    this.trackEvent('story_view', { story_id: story.id, story_title: story.title });
  }
}

export const analytics = new AnalyticsService();
