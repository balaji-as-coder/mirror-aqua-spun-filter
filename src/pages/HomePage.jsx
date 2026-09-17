import React, { useState } from 'react';
import { ArrowRight, Sparkles, CheckCircle2, Shield, Eye, Package, ChevronLeft, ChevronRight, Mail } from 'lucide-react';
import { PRODUCTS } from '../data/products.js';
import { REGIONS } from '../data/regions.js';
import { ProductCard } from '../components/product/ProductCard.jsx';
import { Button } from '../components/ui/Primitives.jsx';
import { useUI } from '../context/UIContext.jsx';
import { analytics } from '../services/analytics.js';
import './HomePage.css';

export function HomePage({ onNavigate }) {
  const { openComingSoonModal } = useUI();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const featuredProducts = PRODUCTS.slice(0, 4);
  const carouselProducts = PRODUCTS;

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSubscribed(true);
    analytics.trackEvent('newsletter_signup', { email: newsletterEmail });
  };

  const handlePrevSlide = () => {
    setCarouselIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNextSlide = () => {
    setCarouselIndex((prev) => Math.min(carouselProducts.length - 1, prev + 1));
  };

  return (
    <div className="homepage-wrapper">
      {/* =========================================================================
          SECTION 1 — HERO
          ========================================================================= */}
      <section className="hero-section">
        <div className="hero-image-backdrop">
          <img
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2000&q=85"
            alt="Handmade Indian Heritage Craftsmanship"
            className="hero-bg-img"
          />
          <div className="hero-overlay" />
        </div>

        <div className="container hero-content-container">
          <div className="hero-content">
            <span className="hero-eyebrow">A Curated Heritage Store</span>
            <h1 className="hero-title">
              DISCOVER SOMETHING SPECIAL
            </h1>
            <p className="hero-subheading">
              Handmade and carefully selected products created with quality, character and a story worth knowing.
            </p>
            <div className="hero-cta-group">
              <Button
                variant="accent"
                onClick={() => onNavigate('/shop')}
              >
                <span>EXPLORE COLLECTION</span>
                <ArrowRight size={16} />
              </Button>
              <Button
                variant="outline-light"
                onClick={() => onNavigate('/stories')}
              >
                <span>OUR STORIES</span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2 — BRAND EMOTION
          ========================================================================= */}
      <section className="brand-emotion-section">
        <div className="container container-narrow text-center">
          <span className="section-eyebrow">Our Philosophy</span>
          <h2 className="emotion-statement">
            NOT JUST PRODUCTS.<br />
            STORIES WORTH BRINGING HOME.
          </h2>
          <div className="emotion-divider" />
          <p className="emotion-paragraph">
            We look beyond the ordinary to discover products made with care, character and purpose. Every piece in our collection is selected because there is something about it worth sharing — an unbroken metallurgical lineage, organic rain-fed fibers, or the patient hands of master potters.
          </p>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3 — FEATURED PRODUCTS (OUR LATEST FINDS)
          ========================================================================= */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header-flex">
            <div>
              <span className="section-eyebrow">Curated Collection</span>
              <h2 className="section-title">OUR LATEST FINDS</h2>
            </div>
            <a
              href="/shop"
              className="view-all-link"
              onClick={(e) => { e.preventDefault(); onNavigate('/shop'); }}
            >
              <span>View All Finds</span>
              <ArrowRight size={16} />
            </a>
          </div>

          <div className="products-grid-4">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4 — HANDMADE STORY SECTION (DARK CONTRAST)
          ========================================================================= */}
      <section className="handmade-story-section">
        <div className="container">
          <div className="handmade-grid">
            <div className="handmade-text-col">
              <span className="handmade-eyebrow">Human Craftsmanship</span>
              <h2 className="handmade-title">
                MADE BY HAND.<br />
                MADE WITH PATIENCE.
              </h2>
              <p className="handmade-desc">
                In an era of mass-replicated plastic and automated stamping, we champion the slow arts. From hand-burnished alluvial river clay to 4,000-year-old lost-wax tribal castings, our objects carry the soul of the craftspeople who shaped them.
              </p>

              <div className="craft-pillars-list">
                <div className="craft-pillar">
                  <strong>Master Artisans</strong>
                  <span>Generational guilds across India</span>
                </div>
                <div className="craft-pillar">
                  <strong>Honest Materials</strong>
                  <span>Pure brass, natural clay, raw cotton</span>
                </div>
                <div className="craft-pillar">
                  <strong>Zero Rush</strong>
                  <span>Sun-cured, kiln-fired, hand-loomed</span>
                </div>
              </div>

              <Button
                variant="accent"
                onClick={() => onNavigate('/category/handmade')}
              >
                <span>EXPLORE HANDMADE</span>
                <ArrowRight size={16} />
              </Button>
            </div>

            <div className="handmade-media-col">
              <div className="handmade-image-wrapper">
                <img
                  src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80"
                  alt="Artisan hands shaping pottery"
                  className="handmade-main-img"
                />
                <div className="handmade-badge-overlay">
                  <Sparkles size={16} color="var(--accent-terracotta)" />
                  <span>Verified Handmade Provenance</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5 — STORY FEATURE (EDITORIAL SPLIT)
          ========================================================================= */}
      <section className="story-feature-section">
        <div className="container">
          <div className="editorial-story-card">
            <div className="story-card-image-col">
              <img
                src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80"
                alt="The Story Behind The Product"
                className="story-feature-img"
              />
            </div>
            <div className="story-card-text-col">
              <span className="section-eyebrow">Provenance Journal</span>
              <h2 className="story-feature-title">THE STORY BEHIND THE PRODUCT</h2>
              <div className="story-quote-block">
                <p className="story-lead-quote">
                  "Some products are made in minutes. Others take patience. We believe the difference matters."
                </p>
              </div>
              <p className="story-feature-text">
                That's why we want you to know more than what a product is. We want you to know where it comes from, how it was made, who shaped it, and what makes it irreplaceable in your home.
              </p>
              <Button
                variant="primary"
                onClick={() => onNavigate('/stories/the-patience-of-clay-kutch-terracotta')}
              >
                <span>READ OUR STORIES</span>
                <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6 — QUALITY PROMISE
          ========================================================================= */}
      <section className="quality-promise-section">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Our Standards</span>
            <h2 className="section-title">QUALITY YOU CAN FEEL</h2>
            <p className="section-subtitle">
              We uphold transparent craftsmanship standards to ensure every arrival brings lasting joy.
            </p>
          </div>

          <div className="quality-cards-grid">
            <div className="quality-card">
              <div className="quality-icon-wrap">
                <Sparkles size={24} className="quality-icon" />
              </div>
              <h3 className="quality-card-title">Carefully Selected</h3>
              <p className="quality-card-desc">
                Every product is chosen with attention to natural materials, tactile finish, and distinctive character.
              </p>
            </div>

            <div className="quality-card">
              <div className="quality-icon-wrap">
                <Shield size={24} className="quality-icon" />
              </div>
              <h3 className="quality-card-title">Quality Checked</h3>
              <p className="quality-card-desc">
                Each batch is individually evaluated for balance, structural durability, and flawless craft details.
              </p>
            </div>

            <div className="quality-card">
              <div className="quality-icon-wrap">
                <Eye size={24} className="quality-icon" />
              </div>
              <h3 className="quality-card-title">Honest Details</h3>
              <p className="quality-card-desc">
                Clear, factual descriptions of materials, exact dimensions, weight, and artisan provenance.
              </p>
            </div>

            <div className="quality-card">
              <div className="quality-icon-wrap">
                <Package size={24} className="quality-icon" />
              </div>
              <h3 className="quality-card-title">Securely Packed</h3>
              <p className="quality-card-desc">
                Protective cushioning designed to protect fragile artisanal pieces throughout transit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7 — COMING SOON REGIONAL SHOWCASE
          ========================================================================= */}
      <section className="coming-soon-section">
        <div className="container">
          <div className="coming-soon-banner">
            <div className="coming-soon-header-wrap">
              <span className="coming-soon-pill">COMING SOON</span>
              <h2 className="coming-soon-main-title">
                DISCOVER WHERE BEAUTY COMES FROM
              </h2>
              <p className="coming-soon-subtext">
                We're travelling beyond the familiar to discover unique products, traditional craftsmanship, and remarkable stories from different parts of India.
              </p>
            </div>

            {/* Region Cards Grid */}
            <div className="regions-preview-grid">
              {REGIONS.map((region) => (
                <div
                  key={region.id}
                  className="region-preview-card"
                  onClick={() => openComingSoonModal(region)}
                >
                  <img src={region.coverImage} alt={region.name} className="region-card-img" />
                  <div className="region-card-overlay">
                    <span className="region-badge">Coming Soon</span>
                    <h3 className="region-card-name">{region.name}</h3>
                    <p className="region-card-crafts">{region.featuredCrafts.slice(0, 2).join(' • ')}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="coming-soon-footer-action">
              <Button
                variant="accent"
                onClick={() => openComingSoonModal(null)}
              >
                <span>BE THE FIRST TO KNOW</span>
                <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 8 — NEW ARRIVALS CAROUSEL (JUST DISCOVERED)
          ========================================================================= */}
      <section className="just-discovered-section">
        <div className="container">
          <div className="section-header-flex">
            <div>
              <span className="section-eyebrow">Fresh Arrivals</span>
              <h2 className="section-title">JUST DISCOVERED</h2>
            </div>
            <div className="carousel-nav-controls">
              <button
                className="carousel-btn"
                onClick={handlePrevSlide}
                disabled={carouselIndex === 0}
                aria-label="Previous items"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                className="carousel-btn"
                onClick={handleNextSlide}
                disabled={carouselIndex >= carouselProducts.length - 2}
                aria-label="Next items"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="carousel-track-container">
            <div
              className="carousel-track"
              style={{
                transform: `translateX(-${carouselIndex * 310}px)`
              }}
            >
              {carouselProducts.map((product) => (
                <div key={product.id} className="carousel-slide-item">
                  <ProductCard product={product} onNavigate={onNavigate} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 9 — CUSTOMER TRUST & REVIEWS (HONEST STATUS)
          ========================================================================= */}
      <section className="customer-reviews-section">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Customer Voices</span>
            <h2 className="section-title">LOVED FOR THE DETAILS</h2>
            <p className="section-subtitle">
              Authentic reviews from verified patrons who welcomed our handmade pieces into their daily rituals.
            </p>
          </div>

          <div className="reviews-grid">
            <div className="review-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 'var(--space-2xl)' }}>
              <p style={{ fontStyle: 'normal', color: 'var(--text-secondary)' }}>
                No public reviews submitted yet. Reviews will be dynamically displayed here directly from verified WooCommerce customer purchases once active.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 10 — NEWSLETTER
          ========================================================================= */}
      <section className="newsletter-section">
        <div className="container container-narrow">
          <div className="newsletter-card">
            <span className="section-eyebrow">Stay Connected</span>
            <h2 className="newsletter-title">DISCOVER SOMETHING NEW</h2>
            <p className="newsletter-desc">
              New products, stories and special finds — delivered occasionally to your inbox.
            </p>

            {!newsletterSubscribed ? (
              <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
                <div className="newsletter-input-wrap">
                  <Mail size={16} className="newsletter-icon" />
                  <input
                    type="email"
                    placeholder="Your email address"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="newsletter-input"
                    required
                  />
                </div>
                <Button type="submit" variant="accent" className="newsletter-btn">
                  JOIN US
                </Button>
              </form>
            ) : (
              <div className="newsletter-success-state">
                <CheckCircle2 size={24} color="var(--color-success)" />
                <span>Thank you for joining our community of craft patrons.</span>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
