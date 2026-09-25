import React, { useState, useEffect } from 'react';
import {
  Search,
  Truck,
  Package,
  CheckCircle2,
  Clock,
  MapPin,
  MessageSquare,
  ShieldCheck,
  ExternalLink,
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import { Button } from '../components/ui/Primitives.jsx';
import './TrackOrderPage.css';

export function TrackOrderPage({ onNavigate }) {
  const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';
  const WHATSAPP_NUM = import.meta.env.VITE_WHATSAPP_BUSINESS_NUMBER || '919876543210';

  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [trackResult, setTrackResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Auto-track if orderId parameter is in URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const initialId = params.get('orderId') || params.get('query');
      if (initialId) {
        setQuery(initialId);
        executeTrack(initialId);
      }
    }
  }, []);

  const executeTrack = async (searchVal) => {
    const val = searchVal.trim();
    if (!val) {
      setErrorMsg('Please enter your Order ID (e.g. order_xxx or MA-xxx) or 10-digit phone number.');
      return;
    }

    setErrorMsg('');
    setIsLoading(true);
    setTrackResult(null);

    try {
      const res = await fetch(`${API_BASE}/shipping/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: val, phone: val })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setTrackResult(data);
      } else {
        setErrorMsg(data.message || 'No tracking information found for this reference.');
      }
    } catch (err) {
      setErrorMsg('Unable to connect to logistics tracking server. Please verify your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    executeTrack(query);
  };

  const handleWhatsAppInquiry = () => {
    const text = `Hello Mirror Aqua Support,\n\nI want live courier dispatch updates for my order reference: "${query || trackResult?.order?.orderId || 'PP Spun Filter Order'}". Please confirm current shipment status.`;
    window.open(`https://wa.me/${WHATSAPP_NUM}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="track-page-root">
      <div className="container track-page-container">
        {/* Navigation Breadcrumb / Back */}
        <div className="track-back-bar">
          <button className="back-link-btn" onClick={() => onNavigate('/product/10-inch-5-micron-pp-spun-filter')}>
            <ArrowLeft size={16} />
            <span>Back to Store</span>
          </button>
        </div>

        {/* Header Hero */}
        <div className="track-hero-header">
          <div className="track-pill">
            <Truck size={14} />
            <span>Shiprocket Pan-India Logistics</span>
          </div>
          <h1 className="track-main-title">Track Your Order</h1>
          <p className="track-subtitle">
            Enter your <strong>Order ID</strong> (from SMS / Email) or <strong>10-Digit Mobile Number</strong> to see real-time dispatch and delivery status.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSubmit} className="track-search-form">
            <div className="search-input-wrap">
              <Search size={18} className="search-icon-inside" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. order_TfvnuK54MOZmVj or 9876543210"
                className="track-search-input"
                autoFocus
              />
            </div>
            <Button variant="primary" type="submit" disabled={isLoading} className="track-submit-btn">
              {isLoading ? 'Searching...' : 'Track Package'}
            </Button>
          </form>

          {errorMsg && (
            <div className="track-error-banner">
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Tracking Details Result */}
        {trackResult && (
          <div className="track-results-card">
            {/* Status Header */}
            <div className="result-top-bar">
              <div>
                <span className="result-label">Order Reference</span>
                <h3 className="result-order-id">#{trackResult.order?.orderId}</h3>
                <span className="result-date">
                  Placed on: {new Date(trackResult.order?.confirmedAt || Date.now()).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
              </div>

              <div className="result-status-pill">
                <span className="pulse-dot" />
                <span>{trackResult.order?.shipment?.status || 'In Transit'}</span>
              </div>
            </div>

            {/* Courier & Dispatch Highlights */}
            <div className="courier-meta-grid">
              <div className="courier-card">
                <Truck size={20} className="meta-icon" />
                <div>
                  <span className="meta-title">Courier Partner</span>
                  <strong className="meta-value">{trackResult.order?.shipment?.courierName || 'Delhivery Express'}</strong>
                </div>
              </div>

              <div className="courier-card">
                <Package size={20} className="meta-icon" />
                <div>
                  <span className="meta-title">AWB / Shipment Ref</span>
                  <strong className="meta-value">{trackResult.order?.shipment?.shipmentId || 'SR-DISPATCH-LIVE'}</strong>
                </div>
              </div>

              <div className="courier-card">
                <MapPin size={20} className="meta-icon" />
                <div>
                  <span className="meta-title">Delivery Location</span>
                  <strong className="meta-value">{trackResult.order?.customer?.city || 'India'} ({trackResult.order?.customer?.pincode || 'Verified PIN'})</strong>
                </div>
              </div>
            </div>

            {/* Visual 5-Step Milestone Timeline */}
            <div className="tracking-timeline-section">
              <h4 className="timeline-heading">Shipment Progress</h4>
              <div className="timeline-stepper">
                {(trackResult.timeline || []).map((step, idx) => (
                  <div key={idx} className={`stepper-node ${step.completed ? 'completed' : 'pending'}`}>
                    <div className="stepper-marker">
                      {step.completed ? <CheckCircle2 size={18} /> : <Clock size={16} />}
                    </div>
                    <div className="stepper-content">
                      <strong className="stepper-title">{step.step}</strong>
                      <span className="stepper-date">{step.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* External Tracking Link */}
            {trackResult.order?.shipment?.trackingUrl && (
              <div className="external-tracking-footer">
                <a
                  href={trackResult.order.shipment.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="external-track-btn"
                >
                  <span>Open Full Shiprocket Courier Tracking</span>
                  <ExternalLink size={15} />
                </a>
              </div>
            )}
          </div>
        )}

        {/* Trust Badges */}
        <div className="track-trust-footer">
          <div className="trust-badge-item">
            <ShieldCheck size={18} color="#059669" />
            <span>Pan-India Safe Delivery</span>
          </div>
          <div className="trust-badge-item">
            <Truck size={18} color="#0284c7" />
            <span>Shiprocket Automated Tracking</span>
          </div>
          <div className="trust-badge-item">
            <CheckCircle2 size={18} color="#059669" />
            <span>100% Genuine 10" PP Spun Filters</span>
          </div>
        </div>
      </div>
    </div>
  );
}
