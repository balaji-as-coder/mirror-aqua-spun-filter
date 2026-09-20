import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { PRODUCTS } from '../src/data/products.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*' }));
app.use(express.json());

// ==============================================================================
// 1. CONFIGURATION & STATE
// ==============================================================================
const WC_STORE_URL = process.env.WC_STORE_URL || '';
const WC_CONSUMER_KEY = process.env.WC_CONSUMER_KEY || '';
const WC_CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET || '';

const RAZORPAY_MODE = process.env.RAZORPAY_MODE || 'test'; // 'test' | 'live'
const RAZORPAY_KEY_ID = process.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';

const SHIPROCKET_EMAIL = process.env.SHIPROCKET_EMAIL || '';
const SHIPROCKET_PASSWORD = process.env.SHIPROCKET_PASSWORD || '';
const SHIPROCKET_PICKUP_PIN = process.env.SHIPROCKET_PICKUP_PINCODE || '370001';

// In-Memory idempotency cache & stores for leads/orders
const processedPayments = new Map(); // order_id -> verificationResult
const leadsDatabase = [];
const ordersDatabase = [];
const inventoryStore = new Map();

// Initialize in-memory stock from master products catalogue
PRODUCTS.forEach(p => {
  inventoryStore.set(p.sku, p.stock || 100);
});

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
    shiprocketTokenExpiry = Date.now() + 8 * 24 * 60 * 60 * 1000;
    return shiprocketToken;
  } catch (err) {
    console.error('Shiprocket Auth Error:', err.message);
    return null;
  }
}

// ==============================================================================
// 2. PRODUCT & INVENTORY ENDPOINTS
// ==============================================================================

// GET /api/products - Product catalogue
app.get('/api/products', async (req, res) => {
  const authHeader = getWcAuthHeader();

  if (authHeader && WC_STORE_URL && !WC_STORE_URL.includes('mock.')) {
    try {
      const url = `${WC_STORE_URL}/wp-json/wc/v3/products?status=publish&per_page=24`;
      const response = await fetch(url, { headers: { Authorization: authHeader } });
      if (response.ok) {
        const products = await response.json();
        return res.json({ success: true, products, source: 'woocommerce' });
      }
    } catch (error) {
      console.warn('WooCommerce fetch error, using local catalogue fallback:', error.message);
    }
  }

  // Authoritative Fallback
  res.json({
    success: true,
    products: PRODUCTS.map(p => ({
      ...p,
      stock: inventoryStore.get(p.sku) ?? p.stock
    })),
    source: 'authoritative_local'
  });
});

// GET /api/products/:slug - Single Product Details
app.get('/api/products/:slug', (req, res) => {
  const { slug } = req.params;
  const product = PRODUCTS.find(p => p.slug === slug || p.id === slug || p.sku === slug);

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  const liveStock = inventoryStore.get(product.sku) ?? product.stock;
  res.json({
    success: true,
    product: {
      ...product,
      stock: liveStock,
      stockStatus: liveStock > 0 ? 'instock' : 'outofstock'
    }
  });
});

// POST /api/inventory/check - Real-Time Stock Validation
app.post('/api/inventory/check', (req, res) => {
  const { items } = req.body; // Array of { sku, quantity }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: 'Invalid items payload' });
  }

  const stockReport = [];
  let allAvailable = true;

  for (const item of items) {
    const available = inventoryStore.get(item.sku) ?? 100;
    const requested = item.quantity || 1;
    const isSufficient = available >= requested;

    if (!isSufficient) {
      allAvailable = false;
    }

    stockReport.push({
      sku: item.sku,
      requested,
      available,
      status: available === 0 ? 'OUT_OF_STOCK' : isSufficient ? 'IN_STOCK' : 'LOW_STOCK'
    });
  }

  res.json({
    success: true,
    allAvailable,
    items: stockReport
  });
});

// ==============================================================================
// 3. WOOCOMMERCE COUPON ENGINE
// ==============================================================================
app.post('/api/wc/cart/coupon', async (req, res) => {
  const { code, subtotal } = req.body;
  const authHeader = getWcAuthHeader();

  if (!code) {
    return res.status(400).json({ valid: false, message: 'Please provide a coupon code.' });
  }

  const normalizedCode = code.trim().toUpperCase();

  // Test Coupon for dev environments
  if (normalizedCode === 'AQUA10') {
    const discountAmount = Math.round(subtotal * 0.10);
    return res.json({
      valid: true,
      code: 'AQUA10',
      discountType: 'percent',
      discountAmount,
      description: '10% Mirror Aqua Welcome Discount'
    });
  }

  if (normalizedCode === 'BULK50' && subtotal >= 2000) {
    return res.json({
      valid: true,
      code: 'BULK50',
      discountType: 'fixed_cart',
      discountAmount: 200,
      description: '₹200 Flat Off on High Volume RO Spares'
    });
  }

  if (!authHeader || !WC_STORE_URL || WC_STORE_URL.includes('mock.')) {
    return res.status(400).json({
      valid: false,
      message: `Coupon "${code}" is invalid or expired.`
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

// ==============================================================================
// 4. SECURE RAZORPAY SERVER-SIDE WORKFLOW (IDEMPOTENT)
// ==============================================================================

// POST /api/payment/razorpay/create-order
app.post('/api/payment/razorpay/create-order', async (req, res) => {
  const { amount, currency = 'INR', receipt, items } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ success: false, message: 'Invalid order amount' });
  }

  // Validate stock prior to generating Razorpay order
  if (Array.isArray(items)) {
    for (const item of items) {
      const currentStock = inventoryStore.get(item.sku) ?? 100;
      if (currentStock < (item.quantity || 1)) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product ${item.sku}. Available: ${currentStock}`
        });
      }
    }
  }

  if (!razorpay) {
    // Return sandbox mock order id if live secret key not yet configured in env
    return res.json({
      success: true,
      mode: 'sandbox_test',
      orderId: `order_test_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      amount: Math.round(amount * 100),
      currency,
      keyId: RAZORPAY_KEY_ID
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
      mode: RAZORPAY_MODE,
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

// POST /api/payment/razorpay/verify - Cryptographic HMAC SHA256 Verification (Idempotent)
app.post('/api/payment/razorpay/verify', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderData } = req.body;

  if (!razorpay_order_id) {
    return res.status(400).json({ success: false, message: 'Missing razorpay_order_id' });
  }

  // Idempotency check: if this order was already processed, return existing verified confirmation
  if (processedPayments.has(razorpay_order_id)) {
    return res.json({
      success: true,
      idempotent: true,
      ...processedPayments.get(razorpay_order_id)
    });
  }

  let isValid = false;

  if (!RAZORPAY_KEY_SECRET || razorpay_order_id.startsWith('order_test_')) {
    // Sandbox test mode verification
    isValid = true;
  } else {
    try {
      const generatedSignature = crypto
        .createHmac('sha256', RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      isValid = generatedSignature === razorpay_signature;
    } catch (e) {
      isValid = false;
    }
  }

  if (isValid) {
    // Deduct stock atomically
    if (orderData?.items && Array.isArray(orderData.items)) {
      orderData.items.forEach(item => {
        const sku = item.product?.sku || item.sku;
        const qty = item.quantity || 1;
        if (sku && inventoryStore.has(sku)) {
          const current = inventoryStore.get(sku);
          inventoryStore.set(sku, Math.max(0, current - qty));
        }
      });
    }

    const confirmationPayload = {
      success: true,
      transactionId: razorpay_payment_id || `pay_${Date.now()}`,
      orderId: razorpay_order_id,
      paymentMethod: RAZORPAY_KEY_SECRET ? 'Razorpay Verified' : 'Razorpay (Test Sandbox)',
      confirmedAt: new Date().toISOString()
    };

    processedPayments.set(razorpay_order_id, confirmationPayload);
    ordersDatabase.push({ ...orderData, ...confirmationPayload });

    return res.json(confirmationPayload);
  } else {
    return res.status(400).json({
      success: false,
      message: 'Invalid Razorpay payment signature. Possible tampering detected.'
    });
  }
});

// ==============================================================================
// 5. SHIPROCKET SERVICEABILITY
// ==============================================================================
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
    // Development local estimate when credentials are not configured
    return res.json({
      serviceable: true,
      courierName: 'Delhivery / Bluedart / Express',
      estimatedDays: '3-5 business days',
      rate: 0
    });
  }

  try {
    const url = `https://apiv2.shiprocket.in/v1/external/courier/serviceability?pickup_postcode=${SHIPROCKET_PICKUP_PIN}&delivery_postcode=${pincode}&cod=0&weight=0.5`;
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();

    if (data.status === 200 && data.data?.available_courier_companies?.length > 0) {
      const bestCourier = data.data.available_courier_companies[0];
      res.json({
        serviceable: true,
        courierName: bestCourier.courier_name,
        estimatedDays: `${bestCourier.estimated_delivery_days || '3-5'} business days`,
        rate: bestCourier.rate
      });
    } else {
      res.json({
        serviceable: false,
        message: `PIN code ${pincode} is currently unserviceable for courier dispatch.`
      });
    }
  } catch (err) {
    res.status(500).json({ serviceable: false, error: err.message });
  }
});

// ==============================================================================
// 6. CRM LEAD INGESTION & B2B INQUIRIES
// ==============================================================================
app.post('/api/crm/lead', (req, res) => {
  const {
    name,
    businessName,
    mobile,
    email,
    city,
    district,
    state,
    productId,
    productName,
    requiredQuantity,
    message,
    leadType = 'BULK_ENQUIRY',
    attribution = {}
  } = req.body;

  if (!name || !mobile) {
    return res.status(400).json({ success: false, message: 'Name and mobile number are required.' });
  }

  const leadRecord = {
    leadId: `LEAD-MA-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
    leadType, // 'BULK_ENQUIRY' | 'DEALER_ENQUIRY' | 'COMPATIBILITY_ENQUIRY' | 'PRODUCT_ENQUIRY'
    name: name.trim(),
    businessName: businessName?.trim() || 'Individual',
    mobile: mobile.trim(),
    email: email?.trim() || null,
    city: city?.trim() || '',
    district: district?.trim() || '',
    state: state?.trim() || '',
    productId: productId || 'MA-PP-10-05M',
    productName: productName || 'Mirror Aqua 10-Inch 5-Micron PP Spun Filter',
    requiredQuantity: requiredQuantity || '20+',
    message: message?.trim() || '',
    attribution: {
      utm_source: attribution.utm_source || 'direct',
      utm_medium: attribution.utm_medium || 'web',
      utm_campaign: attribution.utm_campaign || 'pp_filter_campaign',
      utm_content: attribution.utm_content || '',
      utm_term: attribution.utm_term || '',
      landingPage: attribution.landingPage || '/product/10-inch-5-micron-pp-spun-filter',
      capturedAt: new Date().toISOString()
    },
    tags: ['MIRROR_AQUA', 'PP_SPUN_FILTER', leadType],
    status: 'NEW',
    createdAt: new Date().toISOString()
  };

  leadsDatabase.unshift(leadRecord);

  console.log(`📥 [CRM Ingestion] New ${leadType}:`, leadRecord.name, `(${leadRecord.mobile})`);

  res.json({
    success: true,
    leadId: leadRecord.leadId,
    message: 'Thank you! Your enquiry has been received. Mirror Aqua technical team will connect shortly.'
  });
});

// GET /api/crm/leads - Retrieve recorded leads (Internal/Admin)
app.get('/api/crm/leads', (req, res) => {
  res.json({ success: true, count: leadsDatabase.length, leads: leadsDatabase });
});

// ==============================================================================
// START SERVER
// ==============================================================================
app.listen(PORT, () => {
  console.log(`🚀 MIRROR AQUA Secure Backend Integration Server running on http://localhost:${PORT}`);
});
