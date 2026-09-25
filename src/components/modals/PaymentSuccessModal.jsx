import React from 'react';
import {
  CheckCircle2,
  X,
  Truck,
  ExternalLink,
  MessageSquare,
  Package,
  ArrowRight,
  ShieldCheck,
  Printer,
  Copy
} from 'lucide-react';
import { Button } from '../ui/Primitives.jsx';
import './PaymentSuccessModal.css';

export function PaymentSuccessModal({ isOpen, onClose, orderData, onNavigate }) {
  if (!isOpen || !orderData) return null;

  const payment = orderData.payment || {};
  const shipment = payment.shipment || {};
  const customer = orderData.customer || {};
  const items = orderData.items || [];
  const WHATSAPP_NUM = import.meta.env.VITE_WHATSAPP_BUSINESS_NUMBER || '919876543210';

  const handleCopyOrderId = () => {
    if (orderData.orderId) {
      navigator.clipboard.writeText(orderData.orderId);
      alert('Order ID copied to clipboard!');
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleWhatsAppUpdate = () => {
    const text = `Hello Mirror Aqua Support,\n\nI placed an order on your store:\n• Order ID: #${orderData.orderId}\n• Razorpay Txn: ${payment.transactionId || 'N/A'}\n• Amount Paid: ₹${(orderData.total || orderData.amount || 0).toLocaleString('en-IN')}\n• Customer: ${customer.fullName || ''} (${customer.phone || ''})\n\nPlease share live courier dispatch updates.`;
    window.open(`https://wa.me/${WHATSAPP_NUM}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="payment-success-modal-overlay" role="dialog" aria-modal="true">
      <div className="payment-success-modal-card">
        {/* Confetti Background Accents */}
        <div className="confetti-bubble bubble-1" />
        <div className="confetti-bubble bubble-2" />
        <div className="confetti-bubble bubble-3" />

        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose} aria-label="Close Modal">
          <X size={20} />
        </button>

        {/* Header Icon */}
        <div className="modal-success-header">
          <div className="success-pulse-ring">
            <CheckCircle2 size={48} className="success-check-icon" />
          </div>
          <span className="success-pill-tag">
            <ShieldCheck size={13} /> Razorpay Verified 100% Secure
          </span>
          <h2 className="modal-success-title">Payment Successful!</h2>
          <p className="modal-success-subtitle">
            Thank you, <strong>{customer.fullName || 'Valued Customer'}</strong>. Your order has been placed and confirmed.
          </p>
        </div>

        {/* Main Payment & Order Badge */}
        <div className="payment-receipt-badge">
          <div className="receipt-meta-row">
            <div>
              <span className="receipt-meta-label">Order Reference</span>
              <div className="receipt-id-row">
                <strong className="receipt-order-id">#{orderData.orderId}</strong>
                <button className="copy-icon-btn" onClick={handleCopyOrderId} title="Copy Order ID">
                  <Copy size={13} />
                </button>
              </div>
            </div>
            <div className="receipt-right-meta">
              <span className="receipt-meta-label">Amount Paid</span>
              <strong className="receipt-amount-val">
                ₹{(orderData.total || orderData.amount || 0).toLocaleString('en-IN')}
              </strong>
            </div>
          </div>

          {payment.transactionId && (
            <div className="receipt-txn-row">
              <span className="txn-label">Razorpay Payment ID:</span>
              <code className="txn-code">{payment.transactionId}</code>
            </div>
          )}
        </div>

        {/* Shiprocket Logistics Dispatch Status */}
        <div className="shiprocket-dispatch-box">
          <div className="dispatch-header-row">
            <div className="dispatch-icon-wrap">
              <Truck size={20} />
            </div>
            <div>
              <h4 className="dispatch-title">Shiprocket Express Logistics</h4>
              <p className="dispatch-desc">
                {shipment.courierName ? (
                  <>Courier: <strong>{shipment.courierName}</strong> • Status: <span className="status-badge-active">{shipment.status || 'Ready for Dispatch'}</span></>
                ) : (
                  <>Express courier assigned automatically for PIN <strong>{customer.pincode || 'your area'}</strong>.</>
                )}
              </p>
            </div>
          </div>

          {shipment.shipmentId && (
            <div className="shipment-id-badge">
              <span>AWB / Shipment ID: <strong>{shipment.shipmentId}</strong></span>
            </div>
          )}

          {shipment.trackingUrl && (
            <a
              href={shipment.trackingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shiprocket-track-link"
            >
              <span>Track Live on Shiprocket</span>
              <ExternalLink size={14} />
            </a>
          )}
        </div>

        {/* Items Summary Preview */}
        {items.length > 0 && (
          <div className="modal-items-summary">
            <h5 className="items-summary-title">
              <Package size={14} /> Ordered Items ({items.length})
            </h5>
            <div className="items-summary-list">
              {items.map((item, idx) => (
                <div key={idx} className="items-summary-row">
                  <span className="item-name-qty">
                    {item.name || item.product?.name || 'Mirror Aqua 10" 5-Micron PP Spun Filter'} × {item.quantity || 1}
                  </span>
                  <span className="item-row-price">
                    ₹{((item.price || item.unitPrice || 199) * (item.quantity || 1)).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="modal-actions-container">
          <Button
            variant="primary"
            className="action-track-btn"
            onClick={() => {
              onClose();
              if (onNavigate) {
                onNavigate(`/track?orderId=${encodeURIComponent(orderData.orderId)}`);
              }
            }}
          >
            <span>Track Order Status</span>
            <ArrowRight size={16} />
          </Button>

          <button
            className="action-print-btn"
            onClick={handlePrintReceipt}
          >
            <Printer size={15} />
            <span>Print / Save Receipt</span>
          </button>
        </div>
      </div>
    </div>
  );
}
