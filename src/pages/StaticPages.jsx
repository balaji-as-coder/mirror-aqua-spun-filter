import React from 'react';
import { ShieldCheck, Truck, RefreshCw, Mail, MessageCircle } from 'lucide-react';

export function AboutPage({ onNavigate }) {
  return (
    <div className="container container-narrow" style={{ paddingTop: 'var(--space-3xl)', paddingBottom: 'var(--space-4xl)' }}>
      <div className="section-header">
        <span className="section-eyebrow">Our Philosophy</span>
        <h1 className="section-title">NOT JUST PRODUCTS. STORIES WORTH BRINGING HOME.</h1>
      </div>
      <div style={{ fontSize: '1.125rem', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
        <p style={{ marginBottom: 'var(--space-lg)' }}>
          Kala & Craft was established with a singular conviction: that handmade heritage objects possess a warmth, human resonance, and character that mass industrial manufacturing simply cannot duplicate.
        </p>
        <p style={{ marginBottom: 'var(--space-lg)' }}>
          We travel directly to artisan clusters across India — from the potter courtyards of Kutch to the tribal lost-wax hearths of Bastar. We collaborate directly with 4th and 5th-generation guilds, guaranteeing fair compensation, plastic-free transit, and complete provenance transparency.
        </p>
        <p>
          Every piece in our store is designed to be kept, cherished, and passed down.
        </p>
      </div>
    </div>
  );
}

export function FAQPage() {
  const faqs = [
    {
      q: 'Are all products genuinely handmade in India?',
      a: 'Yes. 100% of our catalogue is crafted by verified artisan guilds and master craftsmen using indigenous materials and traditional techniques.'
    },
    {
      q: 'How are fragile items protected during shipping?',
      a: 'We use custom double-walled recycled Kraft boxes and shock-absorbing paper honeycomb cushioning with zero single-use plastics.'
    },
    {
      q: 'What is your return or replacement policy?',
      a: 'We provide a 7-day doorstep replacement guarantee if any piece arrives damaged or fails to match its honest description.'
    },
    {
      q: 'Do you offer Cash on Delivery (COD)?',
      a: 'Yes, COD is available across serviceable pin codes in India alongside secure UPI, NetBanking, and Card payments.'
    }
  ];

  return (
    <div className="container container-narrow" style={{ paddingTop: 'var(--space-3xl)', paddingBottom: 'var(--space-4xl)' }}>
      <div className="section-header">
        <span className="section-eyebrow">Assistance</span>
        <h1 className="section-title">FREQUENTLY ASKED QUESTIONS</h1>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        {faqs.map((faq, idx) => (
          <div key={idx} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: 'var(--space-xl)', borderRadius: 'var(--radius-xs)' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '8px', color: 'var(--text-primary)' }}>{faq.q}</h3>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ShippingInfoPage() {
  return (
    <div className="container container-narrow" style={{ paddingTop: 'var(--space-3xl)', paddingBottom: 'var(--space-4xl)' }}>
      <div className="section-header">
        <span className="section-eyebrow">Logistics</span>
        <h1 className="section-title">SHIPPING & DELIVERY POLICY</h1>
      </div>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: 'var(--space-2xl)', borderRadius: 'var(--radius-xs)', fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
        <p style={{ marginBottom: 'var(--space-md)' }}>
          <strong>Dispatch Timeline:</strong> Orders are carefully inspected, hand-packed, and dispatched from our artisan hubs within 24 to 48 hours.
        </p>
        <p style={{ marginBottom: 'var(--space-md)' }}>
          <strong>Delivery Timelines:</strong> Standard delivery arrives within 3 to 5 business days across Indian metro and tier-1/2 cities. Express air shipping delivers within 1 to 2 business days.
        </p>
        <p>
          <strong>Free Shipping Threshold:</strong> All orders over ₹2,500 qualify for complimentary Express shipping across India.
        </p>
      </div>
    </div>
  );
}

export function LegalPage({ title, content }) {
  return (
    <div className="container container-narrow" style={{ paddingTop: 'var(--space-3xl)', paddingBottom: 'var(--space-4xl)' }}>
      <div className="section-header">
        <span className="section-eyebrow">Legal Notice</span>
        <h1 className="section-title">{title}</h1>
      </div>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: 'var(--space-2xl)', borderRadius: 'var(--radius-xs)', fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
        {content}
      </div>
    </div>
  );
}
