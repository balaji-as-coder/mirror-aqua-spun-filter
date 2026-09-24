import React, { useState } from 'react';
import { ZoomIn, ShieldCheck, Check } from 'lucide-react';
import './ProductLanding.css';

export function ProductGallery({ images = [], productName = 'Mirror Aqua PP Spun Filter' }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const activeImage = images[activeIndex] || {
    url: '/images/product/008.jpeg',
    altText: productName
  };

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div className="product-gallery-container">
      {/* Main Image Display */}
      <div
        className="gallery-main-viewport"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <img
          src={activeImage.url}
          alt={activeImage.altText || productName}
          className="gallery-main-img"
          loading="eager"
        />

        {/* Feature Overlay Badges */}
        <div className="gallery-floating-badges">
          <span className="gallery-pill-badge">
            <ShieldCheck size={14} /> 100% Polypropylene
          </span>
          <span className="gallery-pill-badge cyan">
            10-Inch Standard Fit
          </span>
        </div>

        {/* Zoom Hint / Preview */}
        <div className="gallery-zoom-hint desktop-only">
          <ZoomIn size={15} />
          <span>Hover to zoom</span>
        </div>

        {/* Magnified Overlay on Hover */}
        {isZoomed && (
          <div
            className="gallery-zoom-overlay desktop-only"
            style={{
              backgroundImage: `url(${activeImage.url})`,
              backgroundPosition: `${mousePos.x}% ${mousePos.y}%`
            }}
          />
        )}
      </div>

      {/* Thumbnails Strip */}
      {images.length > 1 && (
        <div className="gallery-thumbnails-strip">
          {images.map((img, idx) => (
            <button
              key={idx}
              className={`gallery-thumb-btn ${activeIndex === idx ? 'active' : ''}`}
              onClick={() => setActiveIndex(idx)}
              aria-label={`View image ${idx + 1}: ${img.caption || img.altText}`}
            >
              <img src={img.url} alt={img.altText || `Thumbnail ${idx + 1}`} />
              {activeIndex === idx && <div className="thumb-active-indicator" />}
            </button>
          ))}
        </div>
      )}

      {/* Image Caption */}
      {activeImage.caption && (
        <p className="gallery-caption-text">
          <Check size={14} className="caption-icon" />
          <span>{activeImage.caption}</span>
        </p>
      )}
    </div>
  );
}
