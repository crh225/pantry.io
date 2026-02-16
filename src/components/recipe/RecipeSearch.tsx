import React, { useState, useRef, useCallback } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { searchRecipes, searchMultiFilter } from '../../store/slices/recipeThunks';
import { FilterChips } from './FilterChips';
import { sanitizeInput } from '../../utils/validation';
import './RecipeSearch.css';

export const RecipeSearch: React.FC = () => {
  const [cuisine, setCuisine] = useState<string | null>(null);
  const [protein, setProtein] = useState<string | null>(null);
  const [dietId, setDietId] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLDivElement>(null);

  const scroll = () => setTimeout(() => ref.current?.scrollIntoView({ behavior: 'smooth' }), 100);

  const applyFilters = useCallback((c: string | null, p: string | null, d: string | null) => {
    if (!c && !p) return;
    dispatch(searchMultiFilter({ cuisine: c || undefined, protein: p || undefined, dietId: d || undefined }));
    scroll();
  }, [dispatch]);

  const toggle = (cur: string | null, val: string, set: (v: string | null) => void, c: string | null, p: string | null, d: string | null) => {
    const next = cur === val ? null : val;
    set(next);
    if (next !== null || c || p) applyFilters(c, p, d);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchText.trim().length < 2) return;
    dispatch(searchRecipes(sanitizeInput(searchText))); scroll();
  };

  return (
    <div className="recipe-search">
      <form className="text-search" onSubmit={handleSearch}>
        <input type="text" value={searchText} onChange={e => setSearchText(e.target.value)}
          placeholder="Search by name..." className="search-input" maxLength={100} />
        <button type="submit" className="search-btn">🔍</button>
      </form>
      <FilterChips cuisine={cuisine} protein={protein} dietId={dietId}
        onCuisine={v => toggle(cuisine, v, setCuisine, v === cuisine ? null : v, protein, dietId)}
        onProtein={v => toggle(protein, v, setProtein, cuisine, v === protein ? null : v, dietId)}
        onDiet={v => toggle(dietId, v, setDietId, cuisine, protein, v === dietId ? null : v)} />
      <div ref={ref} />
    </div>
  );
};
