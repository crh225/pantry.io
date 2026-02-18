import React from 'react';
import { cuisines, categories } from '../../data/cuisines';
import { diets } from '../../data/diets';
import { FilterRow } from './FilterRow';
import './FilterChips.css';

interface Props {
  cuisine: string | null; protein: string | null; dietId: string | null;
  onCuisine: (v: string) => void; onProtein: (v: string) => void; onDiet: (v: string) => void;
}

const proteins = categories.filter(c => !['Miscellaneous', 'Side', 'Starter'].includes(c));

export const FilterChips: React.FC<Props> = ({ cuisine, protein, dietId, onCuisine, onProtein, onDiet }) => (
  <div className="filter-chips">
    <FilterRow label="Cuisine" items={cuisines.map(c => ({ id: c, label: c }))}
      active={cuisine} onSelect={onCuisine} />
    <FilterRow label="Protein" items={proteins.map(p => ({ id: p, label: p }))}
      active={protein} onSelect={onProtein} />
    <FilterRow label="Diet" items={diets.map(d => ({ id: d.id, label: d.label }))}
      active={dietId} onSelect={onDiet} />
  </div>
);
