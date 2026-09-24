import React from 'react';
import { AlertCircle, ShieldAlert, CheckCircle2, Droplets } from 'lucide-react';
import './ProductLanding.css';

export function ProblemSection() {
  const suspendedParticles = [
    { name: 'Pipe Rust & Oxidation Flakes', desc: 'Iron particles from aging plumbing pipelines' },
    { name: 'Sand & Coarse Grit', desc: 'Abrasive mineral grains from borewell & municipal tanks' },
    { name: 'Silt & Clay Sediments', desc: 'Fine colloidal mud that clouds incoming tap water' },
    { name: 'Visible Suspended Matter', desc: 'Organic particles and overhead tank sediments' }
  ];

  return (
    <section className="problem-section">
      <div className="container">
        <div className="section-header text-center">
          <span className="section-eyebrow">PRE-FILTRATION ESSENTIALS</span>
          <h2 className="section-title">
            Your purification system starts with clean pre-filtration.
          </h2>
          <p className="section-subtitle">
            Raw incoming water carries suspended physical particles that can prematurely clog delicate internal filters and wear down booster pump impellers.
          </p>
        </div>

        <div className="problem-grid">
          {/* Left: What Sediment Filters Target */}
          <div className="problem-card problem-card-threats">
            <h3 className="problem-card-title">
              <AlertCircle size={20} className="icon-warning" />
              Incoming Suspended Impurities
            </h3>
            <ul className="particles-list">
              {suspendedParticles.map((item, idx) => (
                <li key={idx} className="particle-item">
                  <span className="particle-bullet" />
                  <div>
                    <strong>{item.name}</strong>
                    <p>{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: The Solution & Technical Scope */}
          <div className="problem-card problem-card-solution">
            <h3 className="problem-card-title">
              <CheckCircle2 size={20} className="icon-success" />
              The Role of the 5-Micron PP Spun Filter
            </h3>
            <p className="solution-text">
              The Mirror Aqua 10-Inch PP Spun Filter acts as the front-line physical barrier in your water purifier. Its thermal-bonded gradient microfibers trap suspended particles from outer surface to inner core, delivering clarified water to subsequent purification stages.
            </p>

            {/* Authentic Visual Proof */}
            <div className="real-proof-card">
              <img
                src="/images/product/001.jpeg"
                alt="Mirror Aqua Fresh Filter vs Trapped Dirt Filter"
                className="proof-img"
              />
              <div className="proof-caption">
                <strong>Real Pre-Filtration Action:</strong>
                <span>Fresh Virgin Polypropylene Cartridge (Left) vs Trapped Physical Mud & Rust (Right)</span>
              </div>
            </div>

            {/* Strict Factual Disclaimer Banner */}
            <div className="factual-disclaimer-banner">
              <ShieldAlert size={18} className="disclaimer-icon" />
              <div>
                <strong>Important Technical Clarity:</strong>
                <p>
                  PP spun filters are mechanical sediment filters designed exclusively for physical suspended-particle reduction (sand, silt, mud, and pipe rust). They protect internal purification equipment by capturing coarse particulates at the primary pre-filtration stage.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
