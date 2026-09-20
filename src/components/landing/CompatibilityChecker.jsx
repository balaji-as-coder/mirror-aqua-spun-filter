import React, { useState } from 'react';
import { HelpCircle, MessageCircle, CheckCircle2, XCircle, ChevronRight, Upload } from 'lucide-react';
import { analytics } from '../../services/analytics.js';
import './ProductLanding.css';

export function CompatibilityChecker() {
  const WHATSAPP_NUM = import.meta.env.VITE_WHATSAPP_BUSINESS_NUMBER || '919876543210';

  const [selectedPurifierType, setSelectedPurifierType] = useState('domestic_ro');
  const [selectedHousingSize, setSelectedHousingSize] = useState('10_inch');
  const [modelNameInput, setModelNameInput] = useState('');

  const isCompatible = selectedHousingSize === '10_inch';

  const handleAskWhatsApp = () => {
    analytics.trackWhatsAppClick('compatibility_checker_btn', {
      name: 'Mirror Aqua Compatibility Assistant',
      purifierType: selectedPurifierType,
      housingSize: selectedHousingSize,
      userModel: modelNameInput
    });

    const text = `Hello Mirror Aqua,\n\nI need help identifying the correct replacement filter for my RO/water purifier.\n\nMy Purifier Details:\n• Purifier Type: ${selectedPurifierType}\n• Housing Size: ${selectedHousingSize}\n• Model/Brand: ${modelNameInput || 'Not specified'}\n\nPlease confirm if the 10-Inch 5-Micron PP Spun Filter is suitable for my setup.`;
    window.open(`https://wa.me/${WHATSAPP_NUM}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section className="compatibility-section" id="compatibility">
      <div className="container">
        <div className="section-header text-center">
          <span className="section-eyebrow">SYSTEM FIT GUIDE</span>
          <h2 className="section-title">
            Will this filter fit my purifier?
          </h2>
          <p className="section-subtitle">
            Most Indian domestic RO and water purifiers use standard 10-inch pre-filter bowls mounted externally. Check compatibility below.
          </p>
        </div>

        <div className="compatibility-grid">
          {/* Left: Quick Compatibility Selector */}
          <div className="checker-card">
            <h3 className="checker-card-title">
              <HelpCircle size={20} className="icon-cyan" />
              Quick Compatibility Check
            </h3>

            <div className="checker-form-group">
              <label className="checker-label">1. Select Your Purification System Type:</label>
              <div className="checker-options-row">
                <button
                  type="button"
                  className={`checker-opt-btn ${selectedPurifierType === 'domestic_ro' ? 'active' : ''}`}
                  onClick={() => setSelectedPurifierType('domestic_ro')}
                >
                  Domestic RO System
                </button>
                <button
                  type="button"
                  className={`checker-opt-btn ${selectedPurifierType === 'uv_uf' ? 'active' : ''}`}
                  onClick={() => setSelectedPurifierType('uv_uf')}
                >
                  UV / UF Purifier
                </button>
                <button
                  type="button"
                  className={`checker-opt-btn ${selectedPurifierType === 'commercial_ro' ? 'active' : ''}`}
                  onClick={() => setSelectedPurifierType('commercial_ro')}
                >
                  Commercial 25/50 LPH
                </button>
              </div>
            </div>

            <div className="checker-form-group">
              <label className="checker-label">2. Select Your Pre-Filter Housing Length:</label>
              <div className="checker-options-row">
                <button
                  type="button"
                  className={`checker-opt-btn ${selectedHousingSize === '10_inch' ? 'active' : ''}`}
                  onClick={() => setSelectedHousingSize('10_inch')}
                >
                  Standard 10-Inch Bowl (approx. 25 cm)
                </button>
                <button
                  type="button"
                  className={`checker-opt-btn ${selectedHousingSize === '20_inch' ? 'active' : ''}`}
                  onClick={() => setSelectedHousingSize('20_inch')}
                >
                  Large 20-Inch Housing
                </button>
                <button
                  type="button"
                  className={`checker-opt-btn ${selectedHousingSize === 'custom' ? 'active' : ''}`}
                  onClick={() => setSelectedHousingSize('custom')}
                >
                  Not Sure / Custom Model
                </button>
              </div>
            </div>

            <div className="checker-form-group">
              <label className="checker-label">3. Enter Purifier Brand / Model (Optional):</label>
              <input
                type="text"
                placeholder="e.g. Kent, Aquaguard, Pureit, Livpure, Local RO..."
                value={modelNameInput}
                onChange={(e) => setModelNameInput(e.target.value)}
                className="checker-text-input"
              />
            </div>

            {/* Live Result State */}
            <div className={`checker-result-box ${isCompatible ? 'result-success' : 'result-warning'}`}>
              {isCompatible ? (
                <>
                  <CheckCircle2 size={24} className="result-icon-success" />
                  <div>
                    <strong>Compatible Fit Confirmed!</strong>
                    <p>
                      This 10-Inch 5-Micron PP Spun filter fits all standard 10-inch pre-filter housings used with domestic RO and UV systems.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <XCircle size={24} className="result-icon-warning" />
                  <div>
                    <strong>Custom Verification Recommended:</strong>
                    <p>
                      If your housing is 20-inch or a proprietary sealed cartridge, contact our technical desk on WhatsApp to get the exact matching cartridge.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right: Direct WhatsApp Help & Photo Identifier */}
          <div className="compatibility-assist-card">
            <h3 className="assist-card-title">Not sure which filter you need?</h3>
            <p className="assist-card-desc">
              Send a photo of your existing filter bowl or purifier model to Mirror Aqua on WhatsApp. Our technical team will verify the size and send you the direct order link.
            </p>

            <div className="assist-action-box">
              <button
                type="button"
                className="assist-whatsapp-btn"
                onClick={handleAskWhatsApp}
              >
                <MessageCircle size={20} />
                <span>Ask Mirror Aqua on WhatsApp</span>
              </button>
              <span className="assist-subtext">⚡ Fast response during business hours (Mon–Sat, 9am–7pm)</span>
            </div>

            <div className="assist-steps-mini">
              <div className="mini-step">
                <span className="mini-step-num">1</span>
                <span>Click WhatsApp button</span>
              </div>
              <ChevronRight size={16} className="mini-step-arrow" />
              <div className="mini-step">
                <span className="mini-step-num">2</span>
                <span>Share purifier model name or photo</span>
              </div>
              <ChevronRight size={16} className="mini-step-arrow" />
              <div className="mini-step">
                <span className="mini-step-num">3</span>
                <span>Get verified filter link</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
