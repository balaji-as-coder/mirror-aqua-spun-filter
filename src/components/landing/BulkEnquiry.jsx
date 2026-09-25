import React, { useState } from 'react';
import { Send, CheckCircle2, MessageSquare, Building2, User, Phone, Mail, MapPin, Package } from 'lucide-react';
import { analytics } from '../../services/analytics.js';
import './ProductLanding.css';

export function BulkEnquiry() {
  const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';
  const WHATSAPP_NUM = import.meta.env.VITE_WHATSAPP_BUSINESS_NUMBER || '919876543210';

  const [leadType, setLeadType] = useState('BULK_ENQUIRY'); // 'BULK_ENQUIRY' | 'DEALER_ENQUIRY'
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    mobile: '',
    email: '',
    city: '',
    district: '',
    requiredQuantity: '50+',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim() || !formData.mobile.trim()) {
      setErrorMessage('Please provide your full name and 10-digit mobile number.');
      return;
    }

    if (!/^[6-9]\d{9}$/.test(formData.mobile.replace(/\D/g, '').slice(-10))) {
      setErrorMessage('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    setIsSubmitting(true);
    const attribution = analytics.getAttribution();

    try {
      const payload = {
        ...formData,
        leadType,
        productId: 'MA-PP-10-05M',
        productName: 'Mirror Aqua 10-Inch 5-Micron PP Spun Filter',
        attribution
      };

      const res = await fetch(`${API_BASE}/crm/lead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSubmitSuccess({
          leadId: data.leadId,
          name: formData.name,
          quantity: formData.requiredQuantity
        });

        if (leadType === 'BULK_ENQUIRY') {
          analytics.trackBulkEnquiry(payload);
        } else {
          analytics.trackDealerEnquiry(payload);
        }
      } else {
        setErrorMessage(data.message || 'Unable to submit enquiry at this moment. Please try again or reach us via WhatsApp.');
      }
    } catch (err) {
      setErrorMessage('Network connection error. Please check your internet connection or reach us directly via WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppQuickConnect = () => {
    const text = `Hello Mirror Aqua,\n\nI submitted a ${leadType === 'BULK_ENQUIRY' ? 'Bulk Order' : 'Dealer'} enquiry.\n\n• Name: ${formData.name || 'Trade Customer'}\n• Business: ${formData.businessName || 'RO Spares Dealer'}\n• Required Quantity: ${formData.requiredQuantity}\n• City: ${formData.city || 'India'}\n\nPlease share commercial wholesale pricing.`;
    window.open(`https://wa.me/${WHATSAPP_NUM}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section className="bulk-enquiry-section" id="bulk-enquiry">
      <div className="container">
        <div className="bulk-layout-grid">
          {/* Left Column: B2B Value Proposition */}
          <div className="bulk-info-col">
            <span className="section-eyebrow">B2B & WHOLESALE SUPPLY</span>
            <h2 className="bulk-title">
              Buying in Bulk or Interested in Becoming a Dealer?
            </h2>
            <p className="bulk-desc">
              Mirror Aqua partners directly with RO technicians, water purifier service centers, multi-brand spare dealers, and regional distributors across India for consistent, carton-quantity supply.
            </p>

            <div className="bulk-benefits-list">
              <div className="bulk-benefit-item">
                <CheckCircle2 size={20} className="icon-cyan" />
                <div>
                  <strong>Carton & Master Pack Discounts</strong>
                  <span>Tiered wholesale pricing for 50, 100, and 500+ unit dispatches.</span>
                </div>
              </div>
              <div className="bulk-benefit-item">
                <CheckCircle2 size={20} className="icon-cyan" />
                <div>
                  <strong>Direct GST Invoicing</strong>
                  <span>Full input tax credit eligibility with official GST invoices.</span>
                </div>
              </div>
              <div className="bulk-benefit-item">
                <CheckCircle2 size={20} className="icon-cyan" />
                <div>
                  <strong>Priority Freight Dispatch</strong>
                  <span>Fast surface & express cargo shipment across all pincodes.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Lead Form */}
          <div className="bulk-form-col">
            <div className="bulk-form-card">
              {submitSuccess ? (
                <div className="bulk-success-state">
                  <CheckCircle2 size={48} className="success-icon-big" />
                  <h3 className="success-title">Enquiry Received Successfully!</h3>
                  <p className="success-desc">
                    Thank you <strong>{submitSuccess.name}</strong>. Your enquiry for <strong>{submitSuccess.quantity}</strong> units (Ref: <code>{submitSuccess.leadId}</code>) has been logged in the Mirror Aqua CRM. Our B2B trade executive will contact you shortly.
                  </p>
                  <button
                    type="button"
                    className="btn-reset-enquiry"
                    onClick={() => setSubmitSuccess(null)}
                  >
                    Submit Another Enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="crm-lead-form">
                  {/* Lead Type Tabs */}
                  <div className="lead-type-tabs">
                    <button
                      type="button"
                      className={`type-tab-btn ${leadType === 'BULK_ENQUIRY' ? 'active' : ''}`}
                      onClick={() => setLeadType('BULK_ENQUIRY')}
                    >
                      Bulk Quantity (50+ Units)
                    </button>
                    <button
                      type="button"
                      className={`type-tab-btn ${leadType === 'DEALER_ENQUIRY' ? 'active' : ''}`}
                      onClick={() => setLeadType('DEALER_ENQUIRY')}
                    >
                      Dealer / Dealership Enquiry
                    </button>
                  </div>

                  {errorMessage && (
                    <div className="form-error-alert" role="alert">
                      {errorMessage}
                    </div>
                  )}

                  <div className="form-row-2">
                    <div className="form-field">
                      <label htmlFor="bulk-name">Your Full Name *</label>
                      <div className="input-with-icon">
                        <User size={16} className="field-icon" />
                        <input
                          id="bulk-name"
                          type="text"
                          name="name"
                          required
                          placeholder="e.g. Rajesh Kumar"
                          value={formData.name}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="form-field">
                      <label htmlFor="bulk-biz">Business / Shop Name</label>
                      <div className="input-with-icon">
                        <Building2 size={16} className="field-icon" />
                        <input
                          id="bulk-biz"
                          type="text"
                          name="businessName"
                          placeholder="e.g. AquaCare RO Services"
                          value={formData.businessName}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-row-2">
                    <div className="form-field">
                      <label htmlFor="bulk-phone">Mobile Number (WhatsApp) *</label>
                      <div className="input-with-icon">
                        <Phone size={16} className="field-icon" />
                        <input
                          id="bulk-phone"
                          type="tel"
                          name="mobile"
                          required
                          placeholder="10-digit mobile number"
                          value={formData.mobile}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="form-field">
                      <label htmlFor="bulk-email">Email Address</label>
                      <div className="input-with-icon">
                        <Mail size={16} className="field-icon" />
                        <input
                          id="bulk-email"
                          type="email"
                          name="email"
                          placeholder="name@business.com"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-row-2">
                    <div className="form-field">
                      <label htmlFor="bulk-city">City / District *</label>
                      <div className="input-with-icon">
                        <MapPin size={16} className="field-icon" />
                        <input
                          id="bulk-city"
                          type="text"
                          name="city"
                          required
                          placeholder="e.g. Ahmedabad, Pune, Patna"
                          value={formData.city}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="form-field">
                      <label htmlFor="bulk-qty">Required Quantity</label>
                      <div className="input-with-icon">
                        <Package size={16} className="field-icon" />
                        <select
                          id="bulk-qty"
                          name="requiredQuantity"
                          value={formData.requiredQuantity}
                          onChange={handleChange}
                          className="select-input"
                        >
                          <option value="20-50">20 to 50 Units (Trial Pack)</option>
                          <option value="50-100">50 to 100 Units (Carton)</option>
                          <option value="100-500">100 to 500 Units (Master Pack)</option>
                          <option value="500+">500+ Units (Distributor Supply)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="form-field">
                    <label htmlFor="bulk-msg">Additional Requirements / Notes</label>
                    <textarea
                      id="bulk-msg"
                      name="message"
                      rows={3}
                      placeholder="Specify required pack quantities, delivery preferences, or custom requirements..."
                      value={formData.message}
                      onChange={handleChange}
                    />
                  </div>

                  <button
                    type="submit"
                    className="bulk-submit-btn"
                    disabled={isSubmitting}
                  >
                    <Send size={18} />
                    <span>{isSubmitting ? 'Submitting Enquiry...' : 'Request Wholesale Quote'}</span>
                  </button>

                  <p className="form-privacy-note">
                    🔒 Your details are used solely to prepare your trade quote. Never shared with third-party advertisers.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
