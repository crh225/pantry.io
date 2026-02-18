import React, { useState } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { searchRecipes } from '../../store/slices/recipeThunks';
import { sanitizeInput } from '../../utils/validation';
import './RecipeSearch.css';

export const RecipeSearch: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const dispatch = useAppDispatch();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchText.trim().length < 2) return;
    dispatch(searchRecipes(sanitizeInput(searchText)));
  };

  return (
    <div className="recipe-search">
      <form className="text-search" onSubmit={handleSearch}>
        <input type="text" value={searchText} onChange={e => setSearchText(e.target.value)}
          placeholder="Search by name..." className="search-input" maxLength={100} />
        <button type="submit" className="search-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </form>
    </div>
  );
};
