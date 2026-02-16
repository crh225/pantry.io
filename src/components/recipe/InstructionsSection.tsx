import React from 'react';
import './InstructionsSection.css';

interface Props { paragraphs: string[]; }

export const InstructionsSection: React.FC<Props> = ({ paragraphs }) => (
  <section className="detail-section">
    <h2>Instructions</h2>
    <ol className="steps-list">
      {paragraphs.map((p, i) => {
        const text = p.trim().replace(/^(STEP\s*\d+[:.]\s*|\d+[.)]\s*)/i, '');
        if (!text) return null;
        return (
          <li key={i} className="step">
            <span className="step-num">{i + 1}</span>
            <p className="step-text">{text}</p>
          </li>
        );
      })}
    </ol>
  </section>
);
