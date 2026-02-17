import React, { useState } from 'react';
import { cuisines, categories } from '../../data/cuisines';
import { diets } from '../../data/diets';
import { FilterRow } from './FilterRow';
import './FilterChips.css';

interface Props {
  cuisine: string | null; protein: string | null; dietId: string | null;
  onCuisine: (v: string) => void; onProtein: (v: string) => void; onDiet: (v: string) => void;
}

const proteins = categories.filter(c => !['Miscellaneous', 'Side', 'Starter'].includes(c));

export const FilterChips: React.FC<Props> = ({ cuisine, protein, dietId, onCuisine, onProtein, onDiet }) => {
  const [exp, setExp] = useState<string | null>('cuisine');

  return (
    <div className="filter-chips">
      <FilterRow label="Cuisine" expanded={exp === 'cuisine'} active={cuisine}
        onToggle={() => setExp(exp === 'cuisine' ? null : 'cuisine')}
        items={cuisines.map(c => ({ id: c, label: c }))} onSelect={onCuisine} />
      <FilterRow label="Protein" expanded={exp === 'protein'} active={protein}
        onToggle={() => setExp(exp === 'protein' ? null : 'protein')}
        items={proteins.map(p => ({ id: p, label: p }))} onSelect={onProtein} />
      <FilterRow label="Diet" expanded={exp === 'diet'} active={dietId}
        onToggle={() => setExp(exp === 'diet' ? null : 'diet')}
        items={diets.map(d => ({ id: d.id, label: d.label }))} onSelect={onDiet} />
    </div>
  );
};
