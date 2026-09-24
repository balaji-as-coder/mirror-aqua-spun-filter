import React from 'react';
import { ArrowRight, Droplets, Filter, ShieldCheck } from 'lucide-react';
import './ProductLanding.css';

export function HowItWorks() {
  const steps = [
    {
      number: '1',
      title: 'Incoming Raw Water',
      desc: 'Raw water from municipal supply or borewells enters the pre-filter bowl with suspended dirt, silt, and rust.',
      tag: 'Raw Tap / Borewell Feed'
    },
    {
      number: '2',
      title: '5-Micron PP Spun Media',
      desc: 'Water is forced through gradient melt-blown polypropylene fibers. Larger particles are captured externally, finer grains internally.',
      tag: 'Depth Filtration Stage'
    },
    {
      number: '3',
      title: 'Downstream Protection',
      desc: 'Clarified, sediment-free water passes smoothly into subsequent purification stages and booster pumps without abrasive wear.',
      tag: 'Protected Water System'
    }
  ];

  return (
    <section className="how-it-works-section">
      <div className="container">
        <div className="section-header text-center">
          <span className="section-eyebrow">FILTRATION PROCESS</span>
          <h2 className="section-title">
            How Depth Filtration Works
          </h2>
          <p className="section-subtitle">
            A simple, continuous 3-stage mechanical process to safeguard your purification equipment.
          </p>
        </div>

        <div className="process-timeline-grid">
          {steps.map((step, idx) => (
            <div key={idx} className="process-step-card">
              <div className="step-header-row">
                <span className="step-number-circle">STEP {step.number}</span>
                <span className="step-badge">{step.tag}</span>
              </div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.desc}</p>
              {idx < steps.length - 1 && (
                <div className="step-connector-arrow desktop-only">
                  <ArrowRight size={20} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
