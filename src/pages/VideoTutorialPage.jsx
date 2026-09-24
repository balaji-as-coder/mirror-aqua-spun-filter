import React from 'react';
import { ExternalLink, Wrench, CheckCircle2, ArrowRight, ShieldCheck, RefreshCw, ShoppingBag, Play } from 'lucide-react';
import { analytics } from '../services/analytics.js';
import './VideoTutorialPage.css';

function YouTubeIcon({ size = 20, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

export function VideoTutorialPage({ onNavigate }) {
  const YOUTUBE_VIDEO_ID = 'dVYGK9Zk95g';
  const YOUTUBE_EMBED_URL = `https://www.youtube-nocookie.com/embed/${YOUTUBE_VIDEO_ID}?rel=0&autoplay=0`;
  const YOUTUBE_SUBSCRIBE_URL = `https://www.youtube.com/watch?v=${YOUTUBE_VIDEO_ID}?sub_confirmation=1`;

  const handleSubscribeClick = () => {
    analytics.trackEvent('youtube_subscribe_click', {
      video_id: YOUTUBE_VIDEO_ID,
      source: 'how_to_change_spun_filter_page'
    });
    window.open(YOUTUBE_SUBSCRIBE_URL, '_blank', 'noopener,noreferrer');
  };

  const steps = [
    { num: 1, title: 'Shut Off Raw Water Feed', desc: 'Turn off the inlet water diverter valve feeding raw water into your 10-inch pre-filter bowl.' },
    { num: 2, title: 'Relieve Pressure', desc: 'Open a downstream tap or press the pressure release red button on the bowl head to depressurize the pre-filter bowl.' },
    { num: 3, title: 'Unscrew Pre-Filter Bowl', desc: 'Fit the spanner wrench over the bowl ribs and turn counter-clockwise (left) to loosen and detach.' },
    { num: 4, title: 'Remove Old Sediment Cartridge', desc: 'Take out the dirty brown sediment filter. Rinse and wipe the inside of the pre-filter bowl clean.' },
    { num: 5, title: 'Insert New 5-Micron PP Filter', desc: 'Unwrap the genuine Mirror Aqua 10-Inch PP Spun filter and seat it vertically onto the center bottom guide.' },
    { num: 6, title: 'Check O-Ring & Tighten', desc: 'Ensure the rubber O-ring seal is seated evenly in its groove. Hand-tighten the bowl firmly onto the head.' },
    { num: 7, title: 'Reopen Water & Inspect Leaks', desc: 'Slowly reopen the inlet water valve to let the bowl fill. Inspect all threads and tube push-fittings for leaks.' }
  ];

  return (
    <div className="video-tutorial-page">
      {/* Page Header */}
      <section className="video-hero-section">
        <div className="container text-center">
          <div className="video-eyebrow-badge">
            <YouTubeIcon size={16} className="yt-icon-red" />
            <span>OFFICIAL VIDEO TUTORIAL</span>
          </div>
          <h1 className="video-page-title">
            How to Change the Spun Filter
          </h1>
          <p className="video-page-subtitle">
            Watch our step-by-step masterclass on how to safely replace a 10-inch PP spun sediment filter in your water purifier pre-filter bowl.
          </p>
        </div>
      </section>

      {/* Main Video Player Container */}
      <section className="video-player-section">
        <div className="container container-video">
          <div className="video-frame-wrapper">
            <iframe
              src={YOUTUBE_EMBED_URL}
              title="How to Change the Spun Filter - Mirror Aqua Tutorial"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="youtube-iframe"
            />
          </div>

          {/* YouTube Subscribe Call-to-Action Card */}
          <div className="yt-subscribe-card" onClick={handleSubscribeClick}>
            <div className="yt-card-left">
              <div className="yt-logo-emblem">
                <YouTubeIcon size={28} className="yt-logo-icon" />
              </div>
              <div>
                <h3 className="yt-card-title">Subscribe to Mirror Aqua on YouTube</h3>
                <p className="yt-card-sub">
                  Get instant notifications for water purifier maintenance guides, pre-filter bowl compatibility tips, and filter replacement demos.
                </p>
              </div>
            </div>
            <button
              type="button"
              className="yt-subscribe-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleSubscribeClick();
              }}
            >
              <YouTubeIcon size={18} />
              <span>SUBSCRIBE ON YOUTUBE</span>
              <ExternalLink size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* Step by Step Breakdown */}
      <section className="video-steps-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-eyebrow">PRACTICAL CHECKLIST</span>
            <h2 className="section-title">Step-by-Step Changeover Procedure</h2>
            <p className="section-subtitle">
              Follow these simple steps demonstrated in the video tutorial above.
            </p>
          </div>

          <div className="video-steps-grid">
            {steps.map((step) => (
              <div key={step.num} className="vstep-card">
                <div className="vstep-num">Step {step.num}</div>
                <h3 className="vstep-title">{step.title}</h3>
                <p className="vstep-desc">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Replacement Product CTA Card */}
          <div className="video-product-cta-card">
            <div className="vp-cta-content">
              <span className="vp-cta-badge">GENUINE REPLACEMENT SPARE</span>
              <h3 className="vp-cta-title">Mirror Aqua 10-Inch 5-Micron PP Spun Filter</h3>
              <p className="vp-cta-desc">
                100% pure melt-blown polypropylene with genuine embossed brand stamp. Traps mud, rust, silt, and sand particles before they reach delicate internal purifier components.
              </p>
              <div className="vp-pricing-row">
                <span className="vp-price">₹199</span>
                <span className="vp-mrp">MRP ₹399</span>
                <span className="vp-savings">50% OFF • 10-Pack @ ₹1,800</span>
              </div>
              <div className="vp-btn-group">
                <button
                  type="button"
                  className="vp-order-btn"
                  onClick={() => onNavigate('/product/10-inch-5-micron-pp-spun-filter')}
                >
                  <ShoppingBag size={18} />
                  <span>Order Replacement Filter (₹199)</span>
                </button>
              </div>
            </div>
            <div className="vp-cta-img-wrap">
              <img
                src="/images/product/008.jpeg"
                alt="Mirror Aqua PP Spun Filter"
                className="vp-cta-img"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
