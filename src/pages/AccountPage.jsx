import React, { useState } from 'react';
import { Package, User, MapPin, Heart, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Primitives.jsx';

export function AccountPage({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('orders');

  return (
    <div className="container" style={{ paddingTop: 'var(--space-3xl)', paddingBottom: 'var(--space-4xl)' }}>
      <div className="section-header" style={{ textAlign: 'left', marginBottom: 'var(--space-2xl)' }}>
        <span className="section-eyebrow">Customer Account</span>
        <h1 className="section-title">MY ORDERS & DISCOVERIES</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) 3fr', gap: 'var(--space-2xl)' }}>
        {/* Account Nav */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-xs)', height: 'fit-content' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <button
              onClick={() => setActiveTab('orders')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                background: activeTab === 'orders' ? 'var(--bg-secondary)' : 'transparent',
                border: 'none',
                borderRadius: 'var(--radius-xs)',
                fontWeight: activeTab === 'orders' ? 600 : 500,
                color: activeTab === 'orders' ? 'var(--accent-terracotta)' : 'var(--text-primary)',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <Package size={16} />
              <span>Order History</span>
            </button>
            <button
              onClick={() => setActiveTab('addresses')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                background: activeTab === 'addresses' ? 'var(--bg-secondary)' : 'transparent',
                border: 'none',
                borderRadius: 'var(--radius-xs)',
                fontWeight: activeTab === 'addresses' ? 600 : 500,
                color: activeTab === 'addresses' ? 'var(--accent-terracotta)' : 'var(--text-primary)',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <MapPin size={16} />
              <span>Saved Addresses</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div>
          {activeTab === 'orders' && (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: 'var(--space-2xl)', borderRadius: 'var(--radius-xs)', textAlign: 'center' }}>
              <Package size={44} style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }} />
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', marginBottom: '6px' }}>No Past Orders Placed Yet</h3>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-lg)' }}>
                When you order Mirror Aqua 10-Inch 5-Micron PP Spun Filter cartridges, your order references, Razorpay receipts, and Shiprocket tracking will appear here.
              </p>
              <Button variant="primary" onClick={() => onNavigate('/product/10-inch-5-micron-pp-spun-filter')}>
                View 10" PP Spun Filter
              </Button>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: 'var(--space-2xl)', borderRadius: 'var(--radius-xs)' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', marginBottom: 'var(--space-md)' }}>Default Shipping Address</h3>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                You can save shipping addresses during checkout for instant 1-click ordering.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
