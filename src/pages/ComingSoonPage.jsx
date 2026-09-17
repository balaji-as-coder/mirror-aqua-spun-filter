import React from 'react';
import { MapPin, Sparkles, ArrowRight } from 'lucide-react';
import { REGIONS } from '../data/regions.js';
import { Button } from '../components/ui/Primitives.jsx';
import { useUI } from '../context/UIContext.jsx';
import './ComingSoonPage.css';

export function ComingSoonPage() {
  const { openComingSoonModal } = useUI();

  return (
    <div className="coming-soon-page-wrapper">
      <div className="shop-header-banner">
        <div className="container">
          <span className="coming-soon-pill">FUTURE PROVENANCE</span>
          <h1 className="shop-title">DISCOVER WHERE BEAUTY COMES FROM</h1>
          <p className="shop-subtitle">
            We are currently documenting traditional handicraft guilds across India. Each regional release will bring genuine provenance, craftsman stories, and carefully selected pieces.
          </p>
        </div>
      </div>

      <div className="container coming-soon-grid-container">
        <div className="regions-full-grid">
          {REGIONS.map((region) => (
            <div
              key={region.id}
              className="region-full-card"
              onClick={() => openComingSoonModal(region)}
            >
              <div className="region-img-wrap">
                <img src={region.coverImage} alt={region.name} className="region-img" />
                <span className="region-card-badge">Coming {region.launchEstimate}</span>
              </div>
              <div className="region-content">
                <div className="region-location-tag">
                  <MapPin size={13} color="var(--accent-terracotta)" />
                  <span>{region.artisanClusters}</span>
                </div>
                <h2 className="region-name">{region.name}</h2>
                <p className="region-desc">{region.description}</p>
                
                <div className="region-crafts-box">
                  <span className="crafts-label">Featured Crafts in Discovery:</span>
                  <div className="craft-tags-list">
                    {region.featuredCrafts.map((craft) => (
                      <span key={craft} className="craft-tag-item">{craft}</span>
                    ))}
                  </div>
                </div>

                <div className="region-notify-row">
                  <Button variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); openComingSoonModal(region); }}>
                    <span>Be The First To Know</span>
                    <ArrowRight size={13} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
