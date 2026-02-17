import React, { useState, lazy, Suspense } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { setSelected } from '../../store/slices/recipeSlice';
import { fetchRecipeById } from '../../store/slices/recipeThunks';
import { IngredientFilter } from './IngredientFilter';
import { RecipeDetail } from './RecipeDetail';
import { RecipeList } from './RecipeList';
import './RecipesPage.css';

const RecipeCard = lazy(() => import('./RecipeCard').then(m => ({ default: m.RecipeCard })));

export const RecipesPage: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const allRecipes = useAppSelector(s => [...s.recipe.recipes, ...s.recipe.related]);

  const handleClick = (id: string) => {
    setSelectedId(id);
    if (id.startsWith('dj-')) {
      const found = allRecipes.find(r => r.id === id) || null;
      dispatch(setSelected(found));
    } else {
      dispatch(fetchRecipeById(id));
    }
  };

  return (
    <div className="recipes-page">
      <IngredientFilter ingredients={allRecipes.flatMap(r => r.ingredients)} onFilter={() => {}} />
      {selectedId ? (
        <RecipeDetail onBack={() => setSelectedId(null)} />
      ) : (
        <Suspense fallback={<div className="loading">Loading...</div>}>
          <RecipeList onRecipeClick={handleClick} />
        </Suspense>
      )}
    </div>
  );
};