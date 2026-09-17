import React, { useState, useMemo } from 'react';
import { X, Search, ArrowRight } from 'lucide-react';
import { useUI } from '../../context/UIContext.jsx';
import { PRODUCTS } from '../../data/products.js';
import { Price } from '../ui/Primitives.jsx';
import './SearchDrawer.css';

export function SearchDrawer({ onNavigate }) {
  const { isSearchOpen, setIsSearchOpen } = useUI();
  const [searchTerm, setSearchTerm] = useState('');

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const q = searchTerm.toLowerCase();
    return PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.craft.toLowerCase().includes(q) ||
      p.region.toLowerCase().includes(q) ||
      p.placeOfOrigin.toLowerCase().includes(q) ||
      p.materials.some(m => m.toLowerCase().includes(q)) ||
      p.category.toLowerCase().includes(q)
    );
  }, [searchTerm]);

  if (!isSearchOpen) return null;

  const quickTags = ['Terracotta Lamp', 'Dhokra Brass', 'Kala Cotton', 'Blue Pottery', 'Sheesham Box', 'Handmade'];

  return (
    <>
      <div
        className={`drawer-backdrop ${isSearchOpen ? 'active' : ''}`}
        onClick={() => setIsSearchOpen(false)}
        aria-hidden="true"
      />

      <div className={`drawer-panel search-drawer ${isSearchOpen ? 'active' : ''}`} role="dialog" aria-label="Search Collection">
        <div className="search-drawer-header">
          <div className="search-input-wrap">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search by craft, material, region, or product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              autoFocus
            />
            {searchTerm && (
              <button className="clear-search-btn" onClick={() => setSearchTerm('')}>
                <X size={16} />
              </button>
            )}
          </div>
          <button
            className="drawer-close-btn"
            onClick={() => setIsSearchOpen(false)}
            aria-label="Close Search"
          >
            <X size={20} />
          </button>
        </div>

        {/* Quick Suggestions */}
        {!searchTerm && (
          <div className="search-suggestions-wrap">
            <span className="suggestions-title">Popular Searches</span>
            <div className="suggestion-tags">
              {quickTags.map((tag) => (
                <button
                  key={tag}
                  className="suggestion-tag-btn"
                  onClick={() => setSearchTerm(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Results / Empty State */}
        <div className="search-drawer-body">
          {searchTerm && searchResults.length > 0 && (
            <div className="search-results-list">
              <span className="results-count-label">
                Found {searchResults.length} {searchResults.length === 1 ? 'find' : 'finds'}
              </span>
              {searchResults.map((product) => (
                <div
                  key={product.id}
                  className="search-result-item"
                  onClick={() => {
                    setIsSearchOpen(false);
                    onNavigate(`/product/${product.slug}`);
                  }}
                >
                  <img
                    src={product.images?.[0]?.url}
                    alt={product.name}
                    className="search-result-thumb"
                  />
                  <div className="search-result-info">
                    <span className="search-result-craft">{product.craft} • {product.placeOfOrigin}</span>
                    <h4 className="search-result-title">{product.name}</h4>
                    <Price price={product.price} salePrice={product.salePrice} />
                  </div>
                  <ArrowRight size={16} className="search-result-arrow" />
                </div>
              ))}
            </div>
          )}

          {searchTerm && searchResults.length === 0 && (
            <div className="empty-state">
              <Search size={44} className="empty-state-icon" />
              <h3 className="empty-state-title">No products found</h3>
              <p className="empty-state-text">
                Perhaps try searching for handmade textiles, brassware, or terracotta.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
