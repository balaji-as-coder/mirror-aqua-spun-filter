import React from 'react';
import { Filter, Layers, Zap, CheckCircle, RefreshCw, ShieldCheck } from 'lucide-react';
import './ProductLanding.css';

export function BenefitsSection({ benefits = [] }) {
  const defaultBenefits = [
    {
      title: '5-Micron Precision Capture',
      description: 'Traps pipe rust, silt, coarse sand, and physical suspended impurities down to 5µm.',
      icon: <Filter size={22} />
    },
    {
      title: '100% Virgin Polypropylene',
      description: 'Zero chemical binders, adhesives, or toxic additives. Pure food-grade media.',
      icon: <Layers size={22} />
    },
    {
      title: 'Multi-Layer Depth Density',
      description: 'Outer fibers catch large grit; progressive dense core captures fine colloidal dust.',
      icon: <Zap size={22} />
    },
    {
      title: 'Universal 10-Inch Drop-In Fit',
      description: 'Engineered to fit all standard 10-inch domestic and light-commercial purifier bowls.',
      icon: <CheckCircle size={22} />
    },
    {
      title: 'Quick 2-Minute Maintenance',
      description: 'Tool-free, straightforward cartridge swap during routine service intervals.',
      icon: <RefreshCw size={22} />
    },
    {
      title: 'Protects Downstream Purifier Stages',
      description: 'Safeguards downstream booster pumps, internal filters, and fine filtration elements from premature clogging.',
      icon: <ShieldCheck size={22} />
    }
  ];

  const displayBenefits = benefits.length === 6 ? benefits.map((b, i) => ({
    ...b,
    icon: defaultBenefits[i].icon
  })) : defaultBenefits;

  return (
    <section className="benefits-section">
      <div className="container">
        <div className="section-header text-center">
          <span className="section-eyebrow">ENGINEERED PERFORMANCE</span>
          <h2 className="section-title">
            6 Factual Technical Benefits
          </h2>
          <p className="section-subtitle">
            Reliable pre-filtration media engineered for consistent flow rates and high dirt-holding capacity.
          </p>
        </div>

        <div className="benefits-cards-grid">
          {displayBenefits.map((item, idx) => (
            <div key={idx} className="benefit-card">
              <div className="benefit-card-number">0{idx + 1}</div>
              <div className="benefit-icon-box">{item.icon}</div>
              <h3 className="benefit-card-title">{item.title}</h3>
              <p className="benefit-card-desc">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
