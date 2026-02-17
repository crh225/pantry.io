import React from 'react';
import './SortBar.css';

export type SortMode = 'match' | 'least-to-buy';

interface Props { mode: SortMode; onChange: (m: SortMode) => void; }

export const SortBar: React.FC<Props> = ({ mode, onChange }) => (
  <div className="sort-bar">
    <span className="sort-label">Sort:</span>
    <button className={`sort-opt ${mode === 'match' ? 'active' : ''}`} onClick={() => onChange('match')}>
      Best Match
    </button>
    <button className={`sort-opt ${mode === 'least-to-buy' ? 'active' : ''}`} onClick={() => onChange('least-to-buy')}>
      Least to Buy
    </button>
  </div>
);
