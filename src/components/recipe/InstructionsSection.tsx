import React from 'react';
import './InstructionsSection.css';

interface Props { paragraphs: string[]; }

const isJunkStep = (t: string) => /^step\s*\d+$/i.test(t.trim());

const cleanStep = (text: string) =>
  text.trim().replace(/^(STEP\s*\d+\s*[:.–-]\s*|\d+[.):\s]+\s*)/i, '').trim();

export const InstructionsSection: React.FC<Props> = ({ paragraphs }) => {
  const steps = paragraphs.filter(p => !isJunkStep(p)).map(cleanStep).filter(Boolean);
  return (
    <section className="detail-section">
      <h2>Instructions</h2>
      <ol className="steps-list">
        {steps.map((text, i) => (
          <li key={i} className="step">
            <span className="step-num">{i + 1}</span>
            <p className="step-text">{text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
};
