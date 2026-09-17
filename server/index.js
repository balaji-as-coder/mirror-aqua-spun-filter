import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import crypto from 'crypto';
import Razorpay from 'razorpay';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*' }));
app.use(express.json());

// ==============================================================================
// 1. CONFIGURATION & CLIENT INITIALIZATION
// ==============================================================================
const WC_STORE_URL = process.env.WC_STORE_URL || 'https://mock.mirrorcraft.local';
const WC_CONSUMER_KEY = process.env.WC_CONSUMER_KEY || '';
const WC_CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET || '';

const RAZORPAY_KEY_ID = process.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';

const SHIPROCKET_EMAIL = process.env.SHIPROCKET_EMAIL || '';
const SHIPROCKET_PASSWORD = process.env.SHIPROCKET_PASSWORD || '';
const SHIPROCKET_PICKUP_PIN = process.env.SHIPROCKET_PICKUP_PINCODE || '370001';

let shiprocketToken = null;
let shiprocketTokenExpiry = null;

// Initialize Razorpay SDK if secret is configured
const razorpay = RAZORPAY_KEY_SECRET
  ? new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET })
  : null;

// Helper: Basic Auth header for WooCommerce
const getWcAuthHeader = () => {
  if (!WC_CONSUMER_KEY || !WC_CONSUMER_SECRET) return null;
  const token = Buffer.from(`${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`).toString('base64');
  return `Basic ${token}`;
};

// Helper: Shiprocket Token Manager
async function getShiprocketToken() {
  if (shiprocketToken && shiprocketTokenExpiry && Date.now() < shiprocketTokenExpiry) {
    return shiprocketToken;
  }
  if (!SHIPROCKET_EMAIL || !SHIPROCKET_PASSWORD) {
    return null;
  }
  try {
    const res = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: SHIPROCKET_EMAIL, password: SHIPROCKET_PASSWORD })
    });
    if (!res.ok) return null;
    const data = await res.json();
    shiprocketToken = data.token;
    shiprocketTokenExpiry = Date.now() + 8 * 24 * 60 * 60 * 1000; // 8 days validity
    return shiprocketToken;
  } catch (err) {
    console.error('Shiprocket Auth Error:', err.message);
    return null;
  }
}

// ==============================================================================
// 2. WOOCOMMERCE PRODUCT & CART ENDPOINTS
// ==============================================================================

// GET /api/wc/products - Retrieve products from live WooCommerce
app.get('/api/wc/products', async (req, res) => {
  const authHeader = getWcAuthHeader();
  if (!authHeader || WC_STORE_URL.includes('mock.kalacraft.local')) {
    return res.status(503).json({
      configured: false,
      message: 'WooCommerce credentials not yet configured in server environment. Set WC_STORE_URL, WC_CONSUMER_KEY, and WC_CONSUMER_SECRET.'
    });
  }

  try {
    const category = req.query.category;
    const search = req.query.search;
    let url = `${WC_STORE_URL}/wp-json/wc/v3/products?status=publish&per_page=24`;
    if (category) url += `&category=${encodeURIComponent(category)}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;

    const response = await fetch(url, { headers: { Authorization: authHeader } });
    if (!response.ok) {
      throw new Error(`WooCommerce API returned ${response.status}: ${response.statusText}`);
    }
    const products = await response.json();
    res.json({ success: true, products });
  } catch (error) {
    console.error('Error fetching WooCommerce products:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/wc/cart/coupon - Authoritative WooCommerce Coupon Validation
app.post('/api/wc/cart/coupon', async (req, res) => {
  const { code, subtotal } = req.body;
  const authHeader = getWcAuthHeader();

  if (!code) {
    return res.status(400).json({ valid: false, message: 'Please provide a coupon code.' });
  }

  if (!authHeader || WC_STORE_URL.includes('mock.kalacraft.local')) {
    // Explicit Staging / Dev fallback notice
    return res.status(503).json({
      valid: false,
      configured: false,
      message: 'WooCommerce coupon engine not connected to a live WordPress server.'
    });
  }

  try {
    const url = `${WC_STORE_URL}/wp-json/wc/v3/coupons?code=${encodeURIComponent(code.trim())}`;
    const response = await fetch(url, { headers: { Authorization: authHeader } });
    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      return res.status(404).json({ valid: false, message: `Coupon "${code}" is invalid or does not exist.` });
    }

    const coupon = data[0];
    const now = new Date();

    if (coupon.date_expires && new Date(coupon.date_expires) < now) {
      return res.status(400).json({ valid: false, message: `Coupon "${code}" has expired.` });
    }

    if (coupon.minimum_amount && parseFloat(coupon.minimum_amount) > subtotal) {
      return res.status(400).json({
        valid: false,
        message: `Coupon "${code}" requires a minimum order subtotal of ₹${coupon.minimum_amount}.`
      });
    }

    let discountAmount = 0;
    if (coupon.discount_type === 'percent') {
      discountAmount = Math.round((subtotal * parseFloat(coupon.amount)) / 100);
    } else if (coupon.discount_type === 'fixed_cart') {
      discountAmount = Math.min(subtotal, Math.round(parseFloat(coupon.amount)));
    }

    res.json({
      valid: true,
      code: coupon.code,
      discountType: coupon.discount_type,
      discountAmount,
      description: coupon.description || 'WooCommerce Validated Coupon'
    });
  } catch (err) {
    res.status(500).json({ valid: false, message: err.message });
  }
});

// GET /api/wc/reviews/:productId - Real WooCommerce Reviews
app.get('/api/wc/reviews/:productId', async (req, res) => {
  const { productId } = req.params;
  const authHeader = getWcAuthHeader();

  if (!authHeader || WC_STORE_URL.includes('mock.kalacraft.local')) {
    return res.json({
      success: true,
      reviews: [],
      message: 'No live customer reviews found on WooCommerce server.'
    });
  }

  try {
    const url = `${WC_STORE_URL}/wp-json/wc/v3/products/reviews?product=${productId}&status=approved`;
    const response = await fetch(url, { headers: { Authorization: authHeader } });
    const reviews = await response.json();
    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==============================================================================
// 3. SECURE RAZORPAY SERVER-SIDE WORKFLOW
// ==============================================================================

// POST /api/payment/razorpay/create-order
app.post('/api/payment/razorpay/create-order', async (req, res) => {
  const { amount, currency = 'INR', receipt } = req.body;

  if (!razorpay) {
    return res.status(503).json({
      configured: false,
      message: 'Razorpay Secret Key not configured on server. Set RAZORPAY_KEY_SECRET in server environment.'
    });
  }

  try {
    const options = {
      amount: Math.round(amount * 100), // convert to paise
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
      payment_capture: 1
    };

    const order = await razorpay.orders.create(options);
    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Razorpay Create Order Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/payment/razorpay/verify - Cryptographic HMAC SHA256 Verification
app.post('/api/payment/razorpay/verify', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!RAZORPAY_KEY_SECRET) {
    return res.status(503).json({
      success: false,
      message: 'RAZORPAY_KEY_SECRET is not configured on the server.'
    });
  }

  try {
    const generatedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const isValid = generatedSignature === razorpay_signature;

    if (isValid) {
      res.json({
        success: true,
        message: 'Razorpay signature verified successfully.',
        transactionId: razorpay_payment_id,
        orderId: razorpay_order_id
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid Razorpay payment signature. Possible tampering detected.'
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==============================================================================
// 4. SHIPROCKET SERVICEABILITY & SHIPMENT
// ==============================================================================

// POST /api/shipping/check-pincode - Real Courier Serviceability API
app.post('/api/shipping/check-pincode', async (req, res) => {
  const { pincode } = req.body;

  if (!pincode || !/^[1-9][0-9]{5}$/.test(pincode)) {
    return res.status(400).json({
      serviceable: false,
      message: 'Please provide a valid 6-digit Indian PIN code.'
    });
  }

  const token = await getShiprocketToken();
  if (!token) {
    return res.status(503).json({
      configured: false,
      serviceable: false,
      message: 'Shiprocket API credentials not configured in server environment. Set SHIPROCKET_EMAIL and SHIPROCKET_PASSWORD.'
    });
  }

  try {
    const url = `https://apiv2.shiprocket.in/v1/external/courier/serviceability?pickup_postcode=${SHIPROCKET_PICKUP_PIN}&delivery_postcode=${pincode}&cod=0&weight=1`;
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();

    if (data.status === 200 && data.data?.available_courier_companies?.length > 0) {
      const bestCourier = data.data.available_courier_companies[0];
      res.json({
        serviceable: true,
        courierName: bestCourier.courier_name,
        estimatedDays: bestCourier.estimated_delivery_days || '3-5 business days',
        rate: bestCourier.rate
      });
    } else {
      res.json({
        serviceable: false,
        message: `PIN code ${pincode} is currently unserviceable for delivery by partner couriers.`
      });
    }
  } catch (err) {
    res.status(500).json({ serviceable: false, error: err.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 MIRROR CRAFT Secure Backend Integration Server running on http://localhost:${PORT}`);
});
