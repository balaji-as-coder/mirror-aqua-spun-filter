import React from 'react';
import { ShieldCheck, Truck, RefreshCw, Mail, MessageCircle, CheckCircle2 } from 'lucide-react';

export function AboutPage({ onNavigate }) {
  return (
    <div className="container container-narrow" style={{ paddingTop: 'var(--space-3xl)', paddingBottom: 'var(--space-4xl)' }}>
      <div className="section-header">
        <span className="section-eyebrow">About Mirror Aqua</span>
        <h1 className="section-title">ENGINEERED PRE-FILTRATION RELIABILITY</h1>
      </div>
      <div style={{ fontSize: '1.125rem', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
        <p style={{ marginBottom: 'var(--space-lg)' }}>
          Mirror Aqua is dedicated to manufacturing and supplying high-performance water purifier pre-filtration elements and replacement cartridges across India.
        </p>
        <p style={{ marginBottom: 'var(--space-lg)' }}>
          Our flagship 10-Inch 5-Micron Polypropylene Spun Filters are fabricated using 100% virgin melt-blown microfibers with progressive depth-gradient density. By trapping raw sand, silt, mud, and pipe rust before water enters internal purification units, we safeguard delicate booster pumps and internal filtration stages.
        </p>
        <p>
          We provide retail direct-to-consumer delivery and wholesale master carton dispatch for service technicians, shops, and distributors.
        </p>
      </div>
    </div>
  );
}

export function FAQPage() {
  const faqs = [
    {
      q: 'What is a 10-inch 5-micron PP spun filter?',
      a: 'A Polypropylene (PP) spun filter is a thermal-bonded depth cartridge designed to fit standard 10-inch pre-filter bowls. It physically captures suspended sediments such as silt, sand, mud, and pipe rust down to 5 microns.'
    },
    {
      q: 'Will this fit my water purifier bowl?',
      a: 'Yes, this filter is universally sized (nominal 10 inches / 254 mm length) to fit standard 10-inch drop-in pre-filter bowls across domestic and commercial purifiers.'
    },
    {
      q: 'How frequently should I replace the spun filter?',
      a: 'Replacement typically occurs every 1 to 3 months depending on raw water sediment levels, visible dark discoloration, or pressure drops.'
    },
    {
      q: 'Do you offer bulk trade pricing for service technicians?',
      a: 'Yes, we offer master cartons of 50+ pieces with wholesale trade rates. Use the Bulk Enquiry section on our landing page.'
    }
  ];

  return (
    <div className="container container-narrow" style={{ paddingTop: 'var(--space-3xl)', paddingBottom: 'var(--space-4xl)' }}>
      <div className="section-header">
        <span className="section-eyebrow">Technical Assistance</span>
        <h1 className="section-title">FREQUENTLY ASKED QUESTIONS</h1>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        {faqs.map((faq, idx) => (
          <div key={idx} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: 'var(--space-xl)', borderRadius: 'var(--radius-xs)' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.125rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)' }}>{faq.q}</h3>
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
        <span className="section-eyebrow">Logistics & Shipping</span>
        <h1 className="section-title">SHIPPING & DELIVERY POLICY</h1>
      </div>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: 'var(--space-2xl)', borderRadius: 'var(--radius-xs)', fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
        <p style={{ marginBottom: 'var(--space-md)' }}>
          <strong>Dispatch Timeline:</strong> Orders are verified, packed in moisture-resistant protective wrap, and dispatched within 24 hours via Pan-India couriers (Shiprocket, Delhivery, Blue Dart, Express Surface).
        </p>
        <p style={{ marginBottom: 'var(--space-md)' }}>
          <strong>Delivery Timelines:</strong> Metro & Tier-1 cities typically deliver within 2 to 4 business days. Regional and interior pincodes deliver within 4 to 6 business days.
        </p>
        <p>
          <strong>Order Tracking:</strong> Live milestone tracking is available at <a href="/track" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>/track</a> immediately upon parcel booking.
        </p>
      </div>
    </div>
  );
}

export function LegalPage({ title, content }) {
  return (
    <div className="container container-narrow" style={{ paddingTop: 'var(--space-3xl)', paddingBottom: 'var(--space-4xl)' }}>
      <div className="section-header">
        <span className="section-eyebrow">Official Policy</span>
        <h1 className="section-title">{title}</h1>
      </div>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: 'var(--space-2xl)', borderRadius: 'var(--radius-xs)', fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
        {content}
      </div>
    </div>
  );
}
