import React from 'react';
import { cuisines, categories } from '../../data/cuisines';
import { diets } from '../../data/diets';
import { FilterSection } from './FilterSection';
import './FilterSidebar.css';

interface Props {
  cuisine: string | null; protein: string | null; dietId: string | null;
  onCuisine: (v: string) => void; onProtein: (v: string) => void; onDiet: (v: string) => void;
}

const proteins = categories.filter(c => !['Miscellaneous', 'Side', 'Starter'].includes(c));

export const FilterSidebar: React.FC<Props> = ({ cuisine, protein, dietId, onCuisine, onProtein, onDiet }) => (
  <aside className="filter-sidebar">
    <FilterSection title="Protein" items={proteins.map(p => ({ id: p, label: p }))} active={protein} onSelect={onProtein} />
    <FilterSection title="Diet" items={diets.map(d => ({ id: d.id, label: d.label }))} active={dietId} onSelect={onDiet} />
    <FilterSection title="Cuisine" items={cuisines.map(c => ({ id: c, label: c }))} active={cuisine} onSelect={onCuisine} defaultOpen={false} />
  </aside>
);
