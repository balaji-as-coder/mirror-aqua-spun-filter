/**
 * SHIPPING SERVICE
 * Connects to the backend Shiprocket serviceability endpoint (/api/shipping/check-pincode)
 * Provides real courier estimates and unserviceable location states.
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export class ShippingService {
  constructor() {
    this.freeShippingThreshold = 2500; // INR
    this.standardShippingFee = 150; // INR
    this.expressShippingFee = 350; // INR
  }

  async checkPincode(pincode) {
    if (!pincode || !/^[1-9][0-9]{5}$/.test(pincode)) {
      return {
        serviceable: false,
        message: 'Please enter a valid 6-digit Indian PIN code.'
      };
    }

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
          source: 'shiprocket_api'
        };
      }

      if (res.status === 503 && !data.configured) {
        // Development mode fallback when Shiprocket credentials are not yet added
        return {
          serviceable: true,
          courierName: 'Standard Partner',
          estimatedDays: '3 to 5 business days (Standard)',
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
        source: 'local_estimate'
      };
    }
  }

  calculateShipping({ subtotal, method = 'standard' }) {
    if (method === 'express') {
      return this.expressShippingFee;
    }
    if (subtotal >= this.freeShippingThreshold) {
      return 0; // Free Standard Shipping
    }
    return this.standardShippingFee;
  }
}

export const shippingService = new ShippingService();
