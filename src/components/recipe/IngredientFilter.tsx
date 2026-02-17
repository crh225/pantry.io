import React, { useState } from 'react';
import { Ingredient } from '../../types';
import { FaSearch } from 'react-icons/fa';
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
      <div className="filter-search">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search ingredients"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      {searchTerm && (
        <div className="filter-results">
          {ingredients
            .filter(i => i.name.toLowerCase().includes(searchTerm))
            .map(i => (
              <div key={i.name} className="filter-result">
                {i.name}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};