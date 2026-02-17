import React, { useState } from 'react';
import { Ingredient } from '../../types';
import './IngredientFilter.css';

interface Props {
  ingredients: Ingredient[];
  onFilter: (filtered: Ingredient[]) => void;
}

export const IngredientFilter: React.FC<Props> = ({ ingredients, onFilter }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = ingredients.filter(i => i.name.toLowerCase().includes(term));
    onFilter(filtered);
  };

  return (
    <div className="ingredient-filter">
      <input
        type="text"
        placeholder="Search ingredients"
        value={searchTerm}
        onChange={handleSearch}
        className="filter-input"
      />
    </div>
  );
};