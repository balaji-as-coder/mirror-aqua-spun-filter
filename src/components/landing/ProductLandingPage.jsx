import React, { useState, useEffect } from 'react';
import { ProductHero } from './ProductHero.jsx';
import { TrustStrip } from './TrustStrip.jsx';
import { ProblemSection } from './ProblemSection.jsx';
import { BenefitsSection } from './BenefitsSection.jsx';
import { HowItWorks } from './HowItWorks.jsx';
import { Specifications } from './Specifications.jsx';
import { InstallationGuide } from './InstallationGuide.jsx';
import { BulkEnquiry } from './BulkEnquiry.jsx';
import { FAQAccordion } from './FAQAccordion.jsx';
import { ReviewsSection } from './ReviewsSection.jsx';
import { StickyMobileCTA } from './StickyMobileCTA.jsx';
import { PRODUCTS } from '../../data/products.js';
import { analytics } from '../../services/analytics.js';
import './ProductLanding.css';

export function ProductLandingPage({ slug = '10-inch-5-micron-pp-spun-filter', onNavigate }) {
  const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

  const [product, setProduct] = useState(() => {
    return PRODUCTS.find(p => p.slug === slug) || PRODUCTS[0];
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadProduct() {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_BASE}/products/${slug}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.product && isMounted) {
            setProduct(data.product);
          }
        }
      } catch (err) {
        console.warn('Using local fallback product dataset:', err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  // Analytics View Item Event & SEO Dynamic Structured Data
  useEffect(() => {
    if (!product) return;

    analytics.trackPageView(`/product/${product.slug}`);
    analytics.trackViewItem(product);

    // Update document title & meta description
    if (product.seo?.title) {
      document.title = product.seo.title;
    }
    if (product.seo?.description) {
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', product.seo.description);
    }

    // Inject JSON-LD Structured Data Schema
    const structuredData = {
      "@context": "https://schema.org/",
      "@graph": [
        {
          "@type": "Product",
          "name": product.name,
          "image": product.images?.map(i => i.url) || [],
          "description": product.shortDescription,
          "sku": product.sku,
          "brand": {
            "@type": "Brand",
            "name": "Mirror Aqua"
          },
          "offers": {
            "@type": "Offer",
            "url": `https://spunfilter.mirrorsolarvision.com/`,
            "priceCurrency": "INR",
            "price": product.price,
            "priceValidUntil": "2027-12-31",
            "itemCondition": "https://schema.org/NewCondition",
            "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
          }
        },
        {
          "@type": "FAQPage",
          "mainEntity": (product.faqs || []).map(f => ({
            "@type": "Question",
            "name": f.q,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": f.a
            }
          }))
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Mirror Aqua",
              "item": "https://spunfilter.mirrorsolarvision.com/"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": product.category || "Sediment Filter",
              "item": "https://spunfilter.mirrorsolarvision.com/"
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": product.name,
              "item": `https://spunfilter.mirrorsolarvision.com/`
            }
          ]
        }
      ]
    };

    let scriptTag = document.getElementById('product-schema-jsonld');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'product-schema-jsonld';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.text = JSON.stringify(structuredData);

    return () => {
      const tag = document.getElementById('product-schema-jsonld');
      if (tag) tag.remove();
    };
  }, [product]);

  return (
    <div className="product-landing-page-root">
      {/* 1. High-Conversion Hero */}
      <ProductHero product={product} onNavigate={onNavigate} />

      {/* 2. Trust Strip Badges */}
      <TrustStrip />

      {/* 3. How to Change Spun Filter (Video Tutorial & Step-by-Step Guide) */}
      <InstallationGuide />

      {/* 4. Visual Pre-Filtration & Trapped Sediment Proof */}
      <ProblemSection />

      {/* 5. 6 Core Technical Benefits */}
      <BenefitsSection benefits={product.benefits || []} />

      {/* 6. Technical Specifications Table */}
      <Specifications specifications={product.specifications || {}} />

      {/* 7. B2B Bulk Order & Wholesale Pricing (CRM) */}
      <BulkEnquiry />

      {/* 9. Technical FAQ Accordion */}
      <FAQAccordion faqs={product.faqs || []} />

      {/* 8. Verified Technician & Customer Reviews */}
      <ReviewsSection />

      {/* 9. Mobile Sticky Bottom Action Bar */}
      <StickyMobileCTA product={product} onNavigate={onNavigate} />
    </div>
  );
}
