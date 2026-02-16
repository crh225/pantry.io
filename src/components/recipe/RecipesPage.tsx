import React, { useState } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { fetchRecipeById } from '../../store/slices/recipeThunks';
import { RecipeSearch } from './RecipeSearch';
import { RecipeList } from './RecipeList';
import { RecipeDetail } from './RecipeDetail';

export const RecipesPage: React.FC = () => {
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const handleRecipeClick = (recipeId: string) => {
    setSelectedRecipeId(recipeId);
    dispatch(fetchRecipeById(recipeId));
  };

  const handleBackClick = () => {
    setSelectedRecipeId(null);
  };

  return (
    <div>
      {selectedRecipeId ? (
        <RecipeDetail onBack={handleBackClick} />
      ) : (
        <>
          <RecipeSearch />
          <RecipeList onRecipeClick={handleRecipeClick} />
        </>
      )}
    </div>
  );
};
