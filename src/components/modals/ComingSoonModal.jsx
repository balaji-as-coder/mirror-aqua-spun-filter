import React, { useState } from 'react';
import { X, CheckCircle, Mail, MapPin } from 'lucide-react';
import { useUI } from '../../context/UIContext.jsx';
import { Button } from '../ui/Primitives.jsx';
import './ComingSoonModal.css';

export function ComingSoonModal() {
  const { isComingSoonModalOpen, closeComingSoonModal, comingSoonRegion } = useUI();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isComingSoonModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    // In production, syncs with newsletter/CRM API
  };

  return (
    <div
      className="modal-backdrop active"
      onClick={closeComingSoonModal}
      role="dialog"
      aria-modal="true"
      aria-label="Join Regional Discovery Waitlist"
    >
      <div className="modal-content coming-soon-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={closeComingSoonModal} aria-label="Close modal">
          <X size={20} />
        </button>

        {!submitted ? (
          <div className="coming-soon-form-wrap">
            <span className="section-eyebrow">
              {comingSoonRegion ? `Upcoming Region • ${comingSoonRegion.name}` : 'Regional Discovery'}
            </span>
            <h3 className="coming-soon-modal-title">
              Be The First To Know
            </h3>
            <p className="coming-soon-modal-desc">
              {comingSoonRegion
                ? `We are currently documenting master craftsmen and authentic heritage workshops in ${comingSoonRegion.name}. Leave your email to receive early access when this regional collection launches.`
                : "We're travelling beyond the familiar to discover unique products, traditional craftsmanship, and remarkable stories from different parts of India. Stay updated on upcoming regional releases."
              }
            </p>

            <form onSubmit={handleSubmit} className="coming-soon-form">
              <div className="input-group">
                <Mail size={16} className="input-icon" />
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-text with-icon"
                  required
                />
              </div>
              <Button type="submit" variant="accent" className="waitlist-submit-btn">
                Notify Me on Launch
              </Button>
            </form>

            <p className="waitlist-privacy-note">
              No spam, ever. Only occasional invitations when authentic craft stories and small batches go live.
            </p>
          </div>
        ) : (
          <div className="coming-soon-success">
            <CheckCircle size={48} className="success-icon" />
            <h3 className="coming-soon-modal-title">You're On The List</h3>
            <p className="coming-soon-modal-desc">
              Thank you. You'll receive early access and provenance notes before our {comingSoonRegion ? comingSoonRegion.name : 'regional'} collections open to the public.
            </p>
            <Button variant="primary" onClick={closeComingSoonModal}>
              Continue Exploring
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
