import React from 'react';
import { TourStep } from '../../hooks/useTour';
import { TOUR, stepNumber } from './TourContent';
import './TourOverlay.css';

type Props = { step: TourStep; onNext: () => void; onSkip: () => void };

export const TourOverlay: React.FC<Props> = ({ step, onNext, onSkip }) => {
  const info = TOUR[step];
  if (!info) return null;
  const num = stepNumber(step);

  return (
    <div className="tour-backdrop" onClick={onSkip}>
      <div className="tour-card" onClick={e => e.stopPropagation()}>
        {num > 0 && <div className="tour-dots">
          {[1, 2, 3].map(i => (
            <span key={i} className={`tour-dot${i === num ? ' active' : ''}`} />
          ))}
        </div>}
        <h2>{info.title}</h2>
        <p>{info.body}</p>
        <div className="tour-actions">
          <button className="tour-skip" onClick={onSkip}>Skip tour</button>
          <button className="tour-next" onClick={onNext}>{info.cta}</button>
        </div>
      </div>
    </div>
  );
};
