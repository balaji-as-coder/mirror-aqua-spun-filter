import React from 'react';
import { ArrowRight, Clock, Calendar, User } from 'lucide-react';
import { STORIES } from '../data/stories.js';
import { Button } from '../components/ui/Primitives.jsx';
import './StoriesPage.css';

export function StoriesPage({ onNavigate }) {
  return (
    <div className="stories-page-wrapper">
      <div className="shop-header-banner">
        <div className="container">
          <span className="section-eyebrow">Editorial Journal</span>
          <h1 className="shop-title">OUR STORIES & PROVENANCE</h1>
          <p className="shop-subtitle">
            Behind every piece is an unbroken lineage of master craftspeople, indigenous materials, and patient hours.
          </p>
        </div>
      </div>

      <div className="container stories-container">
        <div className="stories-grid">
          {STORIES.map((story) => (
            <article
              key={story.id}
              className="story-journal-card"
              onClick={() => onNavigate(`/stories/${story.slug}`)}
            >
              <div className="story-img-wrap">
                <img src={story.coverImage} alt={story.title} className="story-cover" />
                <span className="story-category-tag">{story.category}</span>
              </div>
              <div className="story-body">
                <div className="story-meta">
                  <span><Clock size={13} /> {story.readTime}</span>
                  <span><Calendar size={13} /> {story.publishedDate}</span>
                </div>
                <h2 className="story-card-title">{story.title}</h2>
                <p className="story-card-excerpt">{story.excerpt}</p>
                <div className="story-read-link">
                  <span>Read Provenance Note</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

export function StoryDetailPage({ slug, onNavigate }) {
  const story = STORIES.find(s => s.slug === slug) || STORIES[0];

  return (
    <div className="story-detail-wrapper">
      <div className="container container-narrow">
        <div className="story-detail-header">
          <span className="section-eyebrow">{story.category}</span>
          <h1 className="story-detail-title">{story.title}</h1>
          <p className="story-detail-subtitle">{story.subtitle}</p>

          <div className="story-detail-meta">
            <span>By <strong>{story.author}</strong></span>
            <span>•</span>
            <span>{story.publishedDate}</span>
            <span>•</span>
            <span>{story.readTime}</span>
          </div>
        </div>

        <div className="story-hero-media">
          <img src={story.coverImage} alt={story.title} className="story-hero-img" />
        </div>

        <div className="story-article-body">
          {story.content.map((block, idx) => {
            if (block.type === 'quote') {
              return (
                <blockquote key={idx} className="story-blockquote">
                  {block.text}
                </blockquote>
              );
            }
            return (
              <p key={idx} className="story-article-p">
                {block.text}
              </p>
            );
          })}
        </div>

        <div className="story-article-footer">
          <Button variant="accent" onClick={() => onNavigate('/shop')}>
            <span>Discover Related Craft Pieces</span>
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
