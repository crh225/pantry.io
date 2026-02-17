import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchRecipeById } from '../../store/slices/recipeThunks';
import { setSelected } from '../../store/slices/recipeSlice';
import { RecipeSearch } from './RecipeSearch';
import { RecipeList } from './RecipeList';
import { RecipeDetail } from './RecipeDetail';

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
    <div>
      {selectedId ? (
        <RecipeDetail onBack={() => setSelectedId(null)} />
      ) : (
        <><RecipeSearch /><RecipeList onRecipeClick={handleClick} /></>
      )}
    </div>
  );
};
