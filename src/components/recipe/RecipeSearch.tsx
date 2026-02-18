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

  const apply = useCallback((c: string | null, p: string | null, d: string | null) => {
    if (!c && !p && !d) return;
    dispatch(searchMultiFilter({ cuisine: c || undefined, protein: p || undefined, dietId: d || undefined }));
    scroll();
  }, [dispatch]);

  const onCuisine = (v: string) => { const next = cuisine === v ? null : v; setCuisine(next); apply(next, protein, dietId); };
  const onProtein = (v: string) => { const next = protein === v ? null : v; setProtein(next); apply(cuisine, next, dietId); };
  const onDiet = (v: string) => { const next = dietId === v ? null : v; setDietId(next); apply(cuisine, protein, next); };

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
        <button type="submit" className="search-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </form>
      <FilterChips cuisine={cuisine} protein={protein} dietId={dietId}
        onCuisine={onCuisine} onProtein={onProtein} onDiet={onDiet} />
      <div ref={ref} />
    </div>
  );
};
