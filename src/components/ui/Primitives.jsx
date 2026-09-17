import React from 'react';

export function Button({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'accent' | 'outline-light'
  size = 'md',        // 'sm' | 'md' | 'lg'
  className = '',
  icon: Icon,
  disabled = false,
  onClick,
  type = 'button',
  ...props
}) {
  const variantClass = `btn-${variant}`;
  const sizeClass = size === 'sm' ? 'btn-sm' : '';
  
  return (
    <button
      type={type}
      className={`btn ${variantClass} ${sizeClass} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {Icon && <Icon size={16} />}
      <span>{children}</span>
    </button>
  );
}

export function Badge({ type, text, className = '' }) {
  const getBadgeClass = () => {
    switch (type) {
      case 'editors-pick': return 'badge-editors-pick';
      case 'handmade': return 'badge-handmade';
      case 'new': return 'badge-new';
      case 'limited': return 'badge-limited';
      case 'verified': return 'badge-verified';
      default: return 'badge-handmade';
    }
  };

  return (
    <span className={`badge ${getBadgeClass()} ${className}`}>
      {text || (type === 'verified' ? 'Verified' : '')}
    </span>
  );
}

export function Price({ price, salePrice, currency = '₹' }) {
  const formatNum = (num) => new Intl.NumberFormat('en-IN').format(num);

  if (salePrice && salePrice < price) {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ fontWeight: 600, color: 'var(--color-sale)', fontSize: '1.05em' }}>
          {currency}{formatNum(salePrice)}
        </span>
        <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '0.9em' }}>
          {currency}{formatNum(price)}
        </span>
      </div>
    );
  }

  return (
    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
      {currency}{formatNum(price)}
    </span>
  );
}

export function Rating({ score = 5, count = 12 }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--text-secondary)' }}>
      <span style={{ color: 'var(--color-gold)', letterSpacing: '1px' }}>★★★★★</span>
      {count > 0 && <span>({count})</span>}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div className="skeleton" style={{ width: '100%', aspectRatio: '4/5' }} />
      <div className="skeleton" style={{ width: '40%', height: '14px' }} />
      <div className="skeleton" style={{ width: '80%', height: '20px' }} />
      <div className="skeleton" style={{ width: '30%', height: '18px' }} />
    </div>
  );
}
