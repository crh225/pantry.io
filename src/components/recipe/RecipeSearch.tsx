import React, { useState } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { searchRecipes, searchByCategory, searchByArea } from '../../store/slices/recipeThunks';
import { sanitizeInput, validateSearch } from '../../utils/validation';
import './RecipeSearch.css';

export const RecipeSearch: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [searchType, setSearchType] = useState<'name' | 'category' | 'area'>('name');
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validateSearch(searchText);
    if (validationError) {
      setError(validationError);
      return;
    }

    const sanitized = sanitizeInput(searchText);
    
    switch (searchType) {
      case 'name':
        dispatch(searchRecipes(sanitized));
        break;
      case 'category':
        dispatch(searchByCategory(sanitized));
        break;
      case 'area':
        dispatch(searchByArea(sanitized));
        break;
    }
  };

  return (
    <form className="search-form" onSubmit={handleSearch}>
      {error && <div className="error-message">{error}</div>}
      <div className="search-controls">
        <select 
          value={searchType} 
          onChange={(e) => setSearchType(e.target.value as any)}
          className="search-select"
        >
          <option value="name">Recipe Name</option>
          <option value="category">Category</option>
          <option value="area">Cuisine</option>
        </select>
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder={`Search by ${searchType}...`}
          className="search-input"
          maxLength={100}
        />
        <button type="submit" className="search-btn">Search</button>
      </div>
    </form>
  );
};
