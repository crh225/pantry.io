import React from 'react';
import { MealNight } from '../../types';
import './NightPicker.css';

interface NightPickerProps {
  nights: MealNight[];
  onPick: (nightId: string) => void;
}

export const NightPicker: React.FC<NightPickerProps> = ({ nights, onPick }) => (
  <div className="night-picker">
    <p className="picker-label">Add to which night?</p>
    <div className="picker-buttons">
      {nights.map(n => (
        <button
          key={n.id}
          className={`picker-btn ${n.recipe ? 'has-recipe' : ''}`}
          onClick={() => onPick(n.id)}
        >
          {n.label}
          {n.recipe && <span className="picker-swap">↻ swap</span>}
        </button>
      ))}
    </div>
  </div>
);
