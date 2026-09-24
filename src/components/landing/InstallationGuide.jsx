import React from 'react';
import { Play, CheckCircle2, RefreshCw, ExternalLink, ShieldCheck } from 'lucide-react';
import './ProductLanding.css';

export function InstallationGuide() {
  const steps = [
    { num: 1, title: 'Shut Off Water', desc: 'Turn off the inlet water valve and relieve pre-filter bowl pressure.' },
    { num: 2, title: 'Unscrew Bowl', desc: 'Use spanner wrench counter-clockwise to detach the 10" bowl.' },
    { num: 3, title: 'Insert New Filter', desc: 'Place genuine Mirror Aqua PP spun cartridge onto the center guide.' },
    { num: 4, title: 'Tighten & Check', desc: 'Seat O-ring seal, hand-tighten bowl, and open water valve to inspect.' }
  ];

  const handleSubscribe = () => {
    window.open('https://www.youtube.com/watch?v=dVYGK9Zk95g?sub_confirmation=1', '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="installation-section" id="how-to-change">
      <div className="container">
        <div className="section-header text-center">
          <span className="section-eyebrow eyebrow-cyan">🎥 OFFICIAL VIDEO TUTORIAL</span>
          <h2 className="section-title">
            How to Change the Spun Filter
          </h2>
          <p className="section-subtitle">
            Watch the 2-minute masterclass on replacing your 10-inch PP spun pre-filter cartridge.
          </p>
        </div>

        {/* Official Video Player Embed */}
        <div className="installation-video-wrap">
          <div className="video-frame-wrapper">
            <iframe
              src="https://www.youtube-nocookie.com/embed/dVYGK9Zk95g?rel=0"
              title="How to Change the Spun Filter - Mirror Aqua Video Guide"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="youtube-iframe"
            />
          </div>

          {/* YouTube Subscribe Card */}
          <div className="yt-subscribe-card" onClick={handleSubscribe}>
            <div className="yt-card-left">
              <div className="yt-logo-emblem">
                <RefreshCw size={22} className="yt-logo-icon" />
              </div>
              <div>
                <h3 className="yt-card-title">Subscribe to Mirror Aqua on YouTube</h3>
                <p className="yt-card-sub">
                  Learn RO maintenance, cartridge swap hacks, and filter lifespan tips.
                </p>
              </div>
            </div>
            <button
              type="button"
              className="yt-subscribe-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleSubscribe();
              }}
            >
              <span>🔴 SUBSCRIBE ON YOUTUBE</span>
            </button>
          </div>
        </div>

        {/* 4 Punchy Visual Steps */}
        <div className="installation-steps-grid-4">
          {steps.map((step) => (
            <div key={step.num} className="install-step-card-modern">
              <div className="install-step-badge-modern">0{step.num}</div>
              <h3 className="install-step-title-modern">{step.title}</h3>
              <p className="install-step-desc-modern">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

