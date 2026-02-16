import React, { useEffect, useRef, useCallback } from 'react';
import { cuisines, categories } from '../../data/cuisines';
import './CuisinePicker.css';

declare const twemoji: { parse: (element: HTMLElement, options?: { folder: string; ext: string }) => void } | undefined;

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
  const gridRef = useRef<HTMLDivElement>(null);

  const parseEmojis = useCallback(() => {
    if (gridRef.current && typeof twemoji !== 'undefined' && twemoji) {
      twemoji.parse(gridRef.current, { folder: 'svg', ext: '.svg' });
    }
  }, []);

  useEffect(() => {
    // Try immediately
    parseEmojis();
    // Also try after a short delay in case twemoji loads late
    const timeout = setTimeout(parseEmojis, 100);
    // And on window load as final fallback
    window.addEventListener('load', parseEmojis);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('load', parseEmojis);
    };
  }, [items, parseEmojis]);

  return (
    <div className="cuisine-grid" ref={gridRef}>
      {items.map(item => (
        <button key={item} className="cuisine-btn" onClick={() => onSelect(item)}>
          <span className="cuisine-emoji">{emojis[item] || '🍽️'}</span>
          <span className="cuisine-label">{item}</span>
        </button>
      ))}
    </div>
  );
};
