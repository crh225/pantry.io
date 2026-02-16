import React, { useState } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { searchRecipes, searchByCategory, searchByArea } from '../../store/slices/recipeThunks';
import { CuisinePicker } from './CuisinePicker';
import { sanitizeInput } from '../../utils/validation';
import './RecipeSearch.css';

type Tab = 'cuisine' | 'protein' | 'search';

export const RecipeSearch: React.FC = () => {
  const [tab, setTab] = useState<Tab>('cuisine');
  const [searchText, setSearchText] = useState('');
  const dispatch = useAppDispatch();

  const handleCuisineClick = (cuisine: string) => {
    dispatch(searchByArea(cuisine));
  };

  const handleCategoryClick = (category: string) => {
    dispatch(searchByCategory(category));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchText.trim().length < 2) return;
    dispatch(searchRecipes(sanitizeInput(searchText)));
  };

  return (
    <div className="recipe-search">
      <div className="search-tabs">
        <button className={`tab ${tab === 'cuisine' ? 'active' : ''}`} onClick={() => setTab('cuisine')}>
          🌍 By Cuisine
        </button>
        <button className={`tab ${tab === 'protein' ? 'active' : ''}`} onClick={() => setTab('protein')}>
          🥩 By Protein
        </button>
        <button className={`tab ${tab === 'search' ? 'active' : ''}`} onClick={() => setTab('search')}>
          🔍 Search
        </button>
      </div>
      {tab === 'cuisine' && <CuisinePicker type="cuisine" onSelect={handleCuisineClick} />}
      {tab === 'protein' && <CuisinePicker type="protein" onSelect={handleCategoryClick} />}
      {tab === 'search' && (
        <form className="text-search" onSubmit={handleSearch}>
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search recipes by name..."
            className="search-input"
            maxLength={100}
          />
          <button type="submit" className="search-btn">Search</button>
        </form>
      )}
    </div>
  );
};
