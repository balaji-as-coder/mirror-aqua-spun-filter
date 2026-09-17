import React, { useState, useMemo, useEffect } from 'react';
import { Filter, SlidersHorizontal, ArrowUpDown, Sparkles, Check, X } from 'lucide-react';
import { PRODUCTS, CATEGORIES } from '../data/products.js';
import { ProductCard } from '../components/product/ProductCard.jsx';
import { Button } from '../components/ui/Primitives.jsx';
import { analytics } from '../services/analytics.js';
import './ShopPage.css';

export function ShopPage({ initialFilter = null, onNavigate }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filterType, setFilterType] = useState(initialFilter || 'all'); // 'all' | 'handmade' | 'editors-pick' | 'new' | 'limited'
  const [sortBy, setSortBy] = useState('featured'); // 'featured' | 'price-low' | 'price-high' | 'name'
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  useEffect(() => {
    if (initialFilter) setFilterType(initialFilter);
  }, [initialFilter]);

  useEffect(() => {
    analytics.trackViewItemList(selectedCategory, PRODUCTS.length);
  }, [selectedCategory]);

  const filteredProducts = useMemo(() => {
    let list = [...PRODUCTS];

    // Category filter
    if (selectedCategory !== 'all') {
      list = list.filter(p => p.category.toLowerCase().replace(/[^a-z0-9]/g, '-') === selectedCategory || p.category.toLowerCase() === selectedCategory);
    }

    // Special merchandising filters
    if (filterType === 'handmade') {
      list = list.filter(p => p.handmade);
    } else if (filterType === 'editors-pick') {
      list = list.filter(p => p.isEditorsPick);
    } else if (filterType === 'limited') {
      list = list.filter(p => p.limitedEdition);
    }

    // Sorting
    if (sortBy === 'price-low') {
      list.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
    } else if (sortBy === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [selectedCategory, filterType, sortBy]);

  return (
    <div className="shop-page-wrapper">
      {/* Shop Header Banner */}
      <div className="shop-header-banner">
        <div className="container">
          <span className="section-eyebrow">Discovery Collection</span>
          <h1 className="shop-title">OUR COMPLETE CATALOGUE</h1>
          <p className="shop-subtitle">
            Every piece is chosen with attention to natural materials, human craftsmanship, and authentic Indian provenance.
          </p>
        </div>
      </div>

      <div className="container shop-main-container">
        {/* Curated Collection Filter Pills */}
        <div className="discovery-pills-bar">
          <button
            className={`pill-btn ${filterType === 'all' && selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => { setFilterType('all'); setSelectedCategory('all'); }}
          >
            All Finds
          </button>
          <button
            className={`pill-btn ${filterType === 'editors-pick' ? 'active' : ''}`}
            onClick={() => setFilterType('editors-pick')}
          >
            ✨ Editor's Picks
          </button>
          <button
            className={`pill-btn ${filterType === 'handmade' ? 'active' : ''}`}
            onClick={() => setFilterType('handmade')}
          >
            Handmade Crafts
          </button>
          <button
            className={`pill-btn ${filterType === 'limited' ? 'active' : ''}`}
            onClick={() => setFilterType('limited')}
          >
            Limited Editions
          </button>
        </div>

        {/* Toolbar: Category dropdown, Sort, Count & Filter Toggle */}
        <div className="shop-toolbar">
          <div className="toolbar-left">
            <span className="product-count-text">
              Showing <strong>{filteredProducts.length}</strong> unique finds
            </span>
          </div>

          <div className="toolbar-right">
            {/* Category Filter */}
            <div className="select-wrap">
              <label htmlFor="category-select" className="sr-only">Category</label>
              <select
                id="category-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="shop-select"
              >
                <option value="all">All Categories</option>
                <option value="home-living">Home & Living</option>
                <option value="textiles-rugs">Textiles & Rugs</option>
                <option value="kitchen-dining">Kitchen & Dining</option>
              </select>
            </div>

            {/* Sort Select */}
            <div className="select-wrap">
              <label htmlFor="sort-select" className="sr-only">Sort By</label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="shop-select"
              >
                <option value="featured">Featured First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Alphabetical</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid / Empty State */}
        {filteredProducts.length > 0 ? (
          <div className="shop-product-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Sparkles size={48} className="empty-state-icon" />
            <h3 className="empty-state-title">Nothing here yet</h3>
            <p className="empty-state-text">
              We couldn't find items matching your current filter selection. Discover our latest finds.
            </p>
            <Button
              variant="primary"
              onClick={() => {
                setSelectedCategory('all');
                setFilterType('all');
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
