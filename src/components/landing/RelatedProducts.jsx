import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
import { analytics } from '../../services/analytics.js';
import './ProductLanding.css';

export function RelatedProducts({ onNavigate, currentSlug = '' }) {
  const { addItem, setIsCartOpen } = useCart();

  const relatedList = [
    {
      id: 'ma-prod-002',
      sku: 'MA-ROM-75G',
      slug: '75-gpd-ro-membrane',
      name: 'Mirror Aqua 75 GPD RO Membrane',
      category: 'RO Membrane',
      price: 899,
      mrp: 1499,
      image: '/images/pp_filter_closeup.jpg',
      shortDesc: 'High-rejection thin-film composite membrane for domestic RO housings.'
    },
    {
      id: 'ma-prod-003',
      sku: 'MA-CTO-10',
      slug: '10-inch-cto-carbon-block-filter',
      name: 'Mirror Aqua 10-Inch CTO Carbon Block',
      category: 'Carbon Filter',
      price: 249,
      mrp: 450,
      image: '/images/pp_filter_main.jpg',
      shortDesc: 'High-iodine activated carbon block for chlorine and odor reduction.'
    },
    {
      id: 'ma-prod-004',
      sku: 'MA-HSG-10',
      slug: '10-inch-pre-filter-housing',
      name: 'Mirror Aqua 10-Inch Heavy-Duty Housing Bowl',
      category: 'Spare Parts',
      price: 399,
      mrp: 750,
      image: '/images/pp_filter_housing.jpg',
      shortDesc: 'Virgin polypropylene housing bowl with brass threaded ports and double O-ring.'
    }
  ].filter(p => p.slug !== currentSlug);

  const handleQuickAdd = (p, e) => {
    e.stopPropagation();
    addItem(p, 1);
    analytics.trackAddToCart(p, 1);
    setIsCartOpen(true);
  };

  return (
    <section className="related-products-section">
      <div className="container">
        <div className="section-header text-center">
          <span className="section-eyebrow">COMPATIBLE SPARE PARTS</span>
          <h2 className="section-title">
            Complete Your Water Purifier Maintenance
          </h2>
          <p className="section-subtitle">
            Pair your sediment filter with genuine Mirror Aqua replacement elements.
          </p>
        </div>

        <div className="related-products-grid">
          {relatedList.map((item) => (
            <div
              key={item.id}
              className="related-product-card"
              onClick={() => onNavigate(`/product/${item.slug}`)}
            >
              <div className="related-img-box">
                <img src={item.image} alt={item.name} loading="lazy" />
                <span className="related-category-tag">{item.category}</span>
              </div>
              <div className="related-body">
                <h3 className="related-title">{item.name}</h3>
                <p className="related-desc">{item.shortDesc}</p>
                <div className="related-price-row">
                  <div className="price-stack">
                    <span className="related-price">₹{item.price}</span>
                    {item.mrp > item.price && (
                      <span className="related-mrp">MRP ₹{item.mrp}</span>
                    )}
                  </div>
                  <button
                    type="button"
                    className="related-add-btn"
                    onClick={(e) => handleQuickAdd(item, e)}
                    aria-label={`Add ${item.name} to cart`}
                  >
                    <ShoppingBag size={16} />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
