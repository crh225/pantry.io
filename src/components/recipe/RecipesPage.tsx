import React, { useState, useRef, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchRecipeById } from '../../store/slices/recipeThunks';
import { setSelected } from '../../store/slices/recipeSlice';
import { searchMultiFilter } from '../../store/slices/recipeThunks';
import { RecipeSearch } from './RecipeSearch';
import { FilterSidebar } from './FilterSidebar';
import { RecipeList } from './RecipeList';
import { RecipeDetail } from './RecipeDetail';
import './RecipesPage.css';

export const RecipesPage: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [cuisine, setCuisine] = useState<string | null>(null);
  const [protein, setProtein] = useState<string | null>(null);
  const [dietId, setDietId] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const allRecipes = useAppSelector(s => [...s.recipe.recipes, ...s.recipe.related]);
  const resultsRef = useRef<HTMLDivElement>(null);

  const scroll = () => setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);

  const apply = useCallback((c: string | null, p: string | null, d: string | null) => {
    if (!c && !p && !d) return;
    dispatch(searchMultiFilter({ cuisine: c || undefined, protein: p || undefined, dietId: d || undefined }));
    scroll();
  }, [dispatch]);

  const onCuisine = (v: string) => { const next = cuisine === v ? null : v; setCuisine(next); apply(next, protein, dietId); };
  const onProtein = (v: string) => { const next = protein === v ? null : v; setProtein(next); apply(cuisine, next, dietId); };
  const onDiet = (v: string) => { const next = dietId === v ? null : v; setDietId(next); apply(cuisine, protein, next); };

  const handleClick = (id: string) => {
    setSelectedId(id);
    if (id.startsWith('dj-')) {
      const found = allRecipes.find(r => r.id === id) || null;
      dispatch(setSelected(found));
    } else {
      dispatch(fetchRecipeById(id));
    }
  };

  if (selectedId) {
    return <RecipeDetail onBack={() => setSelectedId(null)} />;
  }

  return (
    <div>
      <RecipeSearch />
      <div className="recipe-layout">
        <FilterSidebar
          cuisine={cuisine} protein={protein} dietId={dietId}
          onCuisine={onCuisine} onProtein={onProtein} onDiet={onDiet}
        />
        <div className="recipe-content">
          <div ref={resultsRef} />
          <RecipeList onRecipeClick={handleClick} />
        </div>
      </div>
    </div>
  );
};
