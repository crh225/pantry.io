import React from 'react';

interface Props {
  paragraphs: string[];
}

export const InstructionsSection: React.FC<Props> = ({ paragraphs }) => (
  <section className="detail-section">
    <h2>Instructions</h2>
    <div className="instructions-text">
      {paragraphs.map((p, i) => (
        <p key={i}>{p.trim()}</p>
      ))}
    </div>
  </section>
);
