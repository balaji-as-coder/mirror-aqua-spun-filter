import React from 'react';
import { Check } from 'lucide-react';
import './WhyWePickedIt.css';

export function WhyWePickedIt({ points = [], title = "WHY WE PICKED IT" }) {
  if (!points || points.length === 0) return null;

  return (
    <div className="why-we-picked-it-card">
      <div className="why-we-picked-it-header">
        <span className="curator-tag">Curator’s Eye</span>
        <h4 className="why-we-picked-it-title">{title}</h4>
      </div>
      <ul className="why-we-picked-it-list">
        {points.map((point, index) => (
          <li key={index} className="why-we-picked-it-item">
            <span className="check-icon-wrap">
              <Check size={14} className="check-icon" />
            </span>
            <span className="point-text">{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
