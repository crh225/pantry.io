import React from 'react';
import { cuisines, categories } from '../../data/cuisines';
import './CuisinePicker.css';

interface CuisinePickerProps {
  type: 'cuisine' | 'protein';
  onSelect: (value: string) => void;
}

const cuisineEmojis: Record<string, string> = {
  American: '🇺🇸', British: '🇬🇧', Chinese: '🇨🇳', French: '🇫🇷',
  Greek: '🇬🇷', Indian: '🇮🇳', Italian: '🇮🇹', Japanese: '🇯🇵',
  Mexican: '🇲🇽', Thai: '🇹🇭', Spanish: '🇪🇸', Vietnamese: '🇻🇳',
  Turkish: '🇹🇷', Korean: '🇰🇷', Moroccan: '🇲🇦', Irish: '🇮🇪',
};

const proteinEmojis: Record<string, string> = {
  Beef: '🥩', Chicken: '🍗', Pork: '🥓', Seafood: '🐟',
  Lamb: '🍖', Vegan: '🥬', Vegetarian: '🥗', Pasta: '🍝',
  Dessert: '🍰', Breakfast: '🥞', Starter: '🥗', Side: '🥗',
};

export const CuisinePicker: React.FC<CuisinePickerProps> = ({ type, onSelect }) => {
  const items = type === 'cuisine' ? cuisines : categories;
  const emojis = type === 'cuisine' ? cuisineEmojis : proteinEmojis;

  return (
    <div className="cuisine-grid">
      {items.map(item => (
        <button key={item} className="cuisine-btn" onClick={() => onSelect(item)}>
          <span className="cuisine-emoji">{emojis[item] || '🍽️'}</span>
          <span className="cuisine-label">{item}</span>
        </button>
      ))}
    </div>
  );
};
