/**
 * SHIPPING SERVICE
 * Connects to the backend Shiprocket serviceability endpoint (/api/shipping/check-pincode)
 * Provides real courier estimates and free shipping logic (100% Free Shipping for AP & TS).
 */

const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) || '/api';

/**
 * Helper to identify if delivery address is in Andhra Pradesh or Telangana
 * AP PIN codes start with: 51, 52, 53
 * TS PIN codes start with: 50
 * Range: 500000 to 539999
 */
export function isFreeShippingRegion(pincode, state) {
  if (pincode) {
    const cleanPin = String(pincode).trim();
    // 50xxxx = Telangana, 51xxxx/52xxxx/53xxxx = Andhra Pradesh
    if (/^(50|51|52|53)\d{4}$/.test(cleanPin)) {
      return true;
    }
  }
  if (state) {
    const cleanState = String(state).trim().toLowerCase();
    if (
      cleanState === 'andhra pradesh' ||
      cleanState === 'ap' ||
      cleanState === 'andhra' ||
      cleanState === 'telangana' ||
      cleanState === 'ts' ||
      cleanState === 'tg' ||
      cleanState.includes('andhra') ||
      cleanState.includes('telangana')
    ) {
      return true;
    }
  }
  return false;
}

export class ShippingService {
  constructor() {
    this.freeShippingThreshold = 2500; // INR for rest of India
    this.standardShippingFee = 60; // INR for other states (₹60)
    this.expressShippingFee = 350; // INR
  }

  async checkPincode(pincode) {
    if (!pincode || !/^[1-9][0-9]{5}$/.test(pincode)) {
      return {
        serviceable: false,
        message: 'Please enter a valid 6-digit Indian PIN code.'
      };
    }

    const isAPTS = isFreeShippingRegion(pincode);

    try {
      const res = await fetch(`${API_BASE}/shipping/check-pincode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pincode })
      });

      const data = await res.json();

      if (res.ok && data.serviceable) {
        return {
          serviceable: true,
          courierName: data.courierName || 'Standard Courier',
          estimatedDays: data.estimatedDays || '3 to 5 business days',
          isFreeShipping: isAPTS,
          regionName: isAPTS ? 'Andhra Pradesh & Telangana' : null,
          source: 'shiprocket_api'
        };
      }

      if (res.status === 503 && !data.configured) {
        // Development mode fallback when Shiprocket credentials are not yet added
        return {
          serviceable: true,
          courierName: 'Standard Partner',
          estimatedDays: '3 to 5 business days (Standard)',
          isFreeShipping: isAPTS,
          regionName: isAPTS ? 'Andhra Pradesh & Telangana' : null,
          source: 'local_estimate'
        };
      }

      return {
        serviceable: false,
        message: data.message || `PIN code ${pincode} is currently unserviceable.`
      };
    } catch (err) {
      return {
        serviceable: true,
        courierName: 'Standard Partner',
        estimatedDays: '3 to 5 business days (Estimated)',
        isFreeShipping: isAPTS,
        regionName: isAPTS ? 'Andhra Pradesh & Telangana' : null,
        source: 'local_estimate'
      };
    }
  }

  calculateShipping({ subtotal, method = 'standard', pincode = '', state = '' }) {
    if (method === 'express') {
      return this.expressShippingFee;
    }
    // 100% Free Standard Shipping for Andhra Pradesh & Telangana
    if (isFreeShippingRegion(pincode, state)) {
      return 0;
    }
    // Pan-India Free Shipping above threshold
    if (subtotal >= this.freeShippingThreshold) {
      return 0; // Free Standard Shipping
    }
    return this.standardShippingFee;
  }
}

export const shippingService = new ShippingService();
