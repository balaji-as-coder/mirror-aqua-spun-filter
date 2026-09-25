import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';
import { analytics } from '../../services/analytics.js';
import './ProductLanding.css';

export function FAQAccordion({ faqs = [] }) {
  const [openIndex, setOpenIndex] = useState(0); // first open by default
  const WHATSAPP_NUM = import.meta.env.VITE_WHATSAPP_BUSINESS_NUMBER || '919876543210';

  const defaultFaqs = [
    {
      q: 'What is a PP spun filter?',
      a: 'A Polypropylene (PP) spun filter is a depth sediment filter made from thermal-bonded polypropylene microfibers. It is designed to capture physical suspended particles such as silt, sand, rust, and dirt from incoming tap or borewell water.'
    },
    {
      q: 'What does 5 micron mean?',
      a: 'A micron rating of 5 means the filter media is engineered to trap suspended particulate matter down to approximately 5 micrometers (0.005 mm) in size.'
    },
    {
      q: 'Is this compatible with RO purifiers?',
      a: 'Yes, this filter is compatible with standard 10-inch pre-filter bowls commonly installed before domestic and commercial water purifiers.'
    },
    {
      q: 'Does this filter reduce TDS?',
      a: 'No. PP spun sediment filters are intended exclusively for physical suspended-particle filtration. Total Dissolved Solids (TDS) reduction is performed by downstream fine purification stages.'
    },
    {
      q: 'Does this filter remove bacteria or viruses?',
      a: 'No. A sediment filter is not a disinfection stage and should not be relied upon for microbiological purification. Disinfection is handled by technologies like UV lamps or fine purification stages.'
    },
    {
      q: 'How often should I replace it?',
      a: 'Replacement frequency depends on your local water quality, daily usage volume, and sediment load. Typical indicators for replacement include visible dark discoloration, noticeable pressure drop, or your purifier manufacturer’s maintenance schedule.'
    },
    {
      q: 'Is this a 10-inch filter?',
      a: 'Yes, this is a standard 10-inch (nominal length ~254 mm) cartridge designed for standard 10-inch pre-filter bowls.'
    },
    {
      q: 'Can I buy in bulk for service centers or dealerships?',
      a: 'Yes. Mirror Aqua supplies service technicians, dealers, and distributors. You can use the "Bulk Enquiry" or "Dealer Enquiry" section to request wholesale pricing.'
    },
    {
      q: 'How do I know whether it fits my water purifier?',
      a: 'Check your existing pre-filter bowl. If it uses a standard 10-inch drop-in cartridge, this filter will fit. If unsure, use our "Ask Mirror Aqua on WhatsApp" button with your purifier model name.'
    },
    {
      q: 'Does this filter contain any chemical binders?',
      a: 'No. The Mirror Aqua PP Spun Filter is constructed from 100% pure thermal-bonded polypropylene microfiber with zero glues, binders, or wetting agents.'
    }
  ];

  const faqList = faqs.length > 0 ? faqs : defaultFaqs;

  const toggleAccordion = (idx) => {
    setOpenIndex(openIndex === idx ? -1 : idx);
  };

  const handleWhatsAppHelp = () => {
    analytics.trackWhatsAppClick('faq_extra_help_btn', { name: 'FAQ Section Assistance' });
    const text = 'Hello Mirror Aqua, I have a specific question about the 10-Inch 5-Micron PP Spun Filter that was not answered in the FAQ.';
    window.open(`https://wa.me/${WHATSAPP_NUM}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section className="faq-section" id="faq">
      <div className="container container-narrow">
        <div className="section-header text-center">
          <span className="section-eyebrow">FREQUENTLY ASKED QUESTIONS</span>
          <h2 className="section-title">
            Technical & Product FAQs
          </h2>
          <p className="section-subtitle">
            Clear, honest answers about sediment pre-filtration, sizing, compatibility, and maintenance.
          </p>
        </div>

        <div className="faq-accordion-container">
          {faqList.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className={`faq-item-card ${isOpen ? 'open' : ''}`}>
                <button
                  type="button"
                  className="faq-question-btn"
                  onClick={() => toggleAccordion(idx)}
                  aria-expanded={isOpen}
                  id={`faq-btn-${idx}`}
                  aria-controls={`faq-panel-${idx}`}
                >
                  <span className="faq-question-text">{item.q}</span>
                  <ChevronDown size={20} className={`faq-chevron ${isOpen ? 'rotate' : ''}`} />
                </button>
                {isOpen && (
                  <div
                    id={`faq-panel-${idx}`}
                    role="region"
                    aria-labelledby={`faq-btn-${idx}`}
                    className="faq-answer-panel"
                  >
                    <p>{item.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
