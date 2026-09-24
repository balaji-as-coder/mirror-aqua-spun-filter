import React from 'react';
import { Table, ShieldCheck } from 'lucide-react';
import './ProductLanding.css';

export function Specifications({ specifications = {} }) {
  const specList = [
    { label: 'Product Name', value: 'Mirror Aqua PP Spun Sediment Filter' },
    { label: 'Filter Type', value: specifications.filterType || 'PP Spun Sediment Filter' },
    { label: 'Micron Rating', value: specifications.micronRating || '5 Micron (µm)' },
    { label: 'Nominal Length', value: specifications.nominalLength || '10 Inch (approx. 254 mm)' },
    { label: 'Outer Diameter', value: specifications.outerDiameter || 'Approx. 60 – 63 mm' },
    { label: 'Inner Core Diameter', value: specifications.innerCoreDiameter || 'Approx. 28 – 30 mm' },
    { label: 'Construction Material', value: specifications.material || '100% Pure Polypropylene (Melt-Blown Microfiber)' },
    { label: 'Application', value: specifications.application || 'Standard 10-Inch Pre-Filter Bowls' },
    { label: 'Operating Temperature', value: specifications.recommendedOperatingTemp || '4°C to 45°C' },
    { label: 'Max Working Pressure', value: specifications.maximumPressure || '125 PSI (Bowl Dependent)' },
    { label: 'Brand', value: specifications.brand || 'Mirror Aqua' },
    { label: 'Country of Origin', value: specifications.countryOfOrigin || 'India' }
  ];

  return (
    <section className="specifications-section">
      <div className="container">
        <div className="section-header text-center">
          <span className="section-eyebrow">TECHNICAL DATA</span>
          <h2 className="section-title">
            Product Specifications
          </h2>
          <p className="section-subtitle">
            Engineered to standard industrial dimensions for universal compatibility across Indian water purifiers.
          </p>
        </div>

        <div className="spec-table-container">
          <table className="technical-spec-table">
            <thead>
              <tr>
                <th scope="col">Specification Parameter</th>
                <th scope="col">Technical Value</th>
              </tr>
            </thead>
            <tbody>
              {specList.map((spec, idx) => (
                <tr key={idx}>
                  <td className="spec-label-col">{spec.label}</td>
                  <td className="spec-value-col">{spec.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
