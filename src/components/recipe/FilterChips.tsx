import React, { useState } from 'react';
import { cuisines, categories } from '../../data/cuisines';
import { diets } from '../../data/diets';
import { FilterRow } from './FilterRow';
import './FilterChips.css';

interface Props {
  cuisine: string | null; protein: string | null; dietId: string | null;
  onCuisine: (v: string) => void; onProtein: (v: string) => void; onDiet: (v: string) => void;
}

const cuisineEmojis: Record<string, string> = {
  American: '🇺🇸', British: '🇬🇧', Chinese: '🇨🇳', French: '🇫🇷', Greek: '🇬🇷',
  Indian: '🇮🇳', Italian: '🇮🇹', Japanese: '🇯🇵', Mexican: '🇲🇽', Thai: '🇹🇭',
  Spanish: '🇪🇸', Vietnamese: '🇻🇳', Turkish: '🇹🇷', Korean: '🇰🇷', Moroccan: '🇲🇦',
};
const proteinEmojis: Record<string, string> = {
  Beef: '🥩', Chicken: '🍗', Pork: '🥓', Seafood: '🐟', Lamb: '🍖',
  Vegan: '🥬', Vegetarian: '🥗', Pasta: '🍝', Dessert: '🍰', Breakfast: '🥞',
};

const proteins = categories.filter(c => !['Miscellaneous', 'Side', 'Starter'].includes(c));

export const FilterChips: React.FC<Props> = ({ cuisine, protein, dietId, onCuisine, onProtein, onDiet }) => {
  const [expanded, setExpanded] = useState<string | null>('cuisine');

  return (
    <div className="filter-chips">
      <FilterRow label="🌍 Cuisine" expanded={expanded === 'cuisine'} active={cuisine}
        onToggle={() => setExpanded(expanded === 'cuisine' ? null : 'cuisine')}
        items={cuisines.map(c => ({ id: c, label: c, emoji: cuisineEmojis[c] }))}
        onSelect={onCuisine} />
      <FilterRow label="🥩 Protein" expanded={expanded === 'protein'} active={protein}
        onToggle={() => setExpanded(expanded === 'protein' ? null : 'protein')}
        items={proteins.map(p => ({ id: p, label: p, emoji: proteinEmojis[p] }))}
        onSelect={onProtein} />
      <FilterRow label="🥗 Diet" expanded={expanded === 'diet'} active={dietId}
        onToggle={() => setExpanded(expanded === 'diet' ? null : 'diet')}
        items={diets.map(d => ({ id: d.id, label: d.label, emoji: d.emoji }))}
        onSelect={onDiet} />
    </div>
  );
};
