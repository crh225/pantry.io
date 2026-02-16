import React from 'react';
import { useAppSelector } from '../../store/hooks';
import { RecipeCard } from './RecipeCard';
import './RecipeList.css';

interface RecipeListProps {
  onRecipeClick: (recipeId: string) => void;
}

export const RecipeList: React.FC<RecipeListProps> = ({ onRecipeClick }) => {
  const { recipes, loading } = useAppSelector(state => state.recipe);

  if (loading) {
    return <div className="loading">Searching recipes...</div>;
  }

  if (recipes.length === 0) {
    return <div className="empty">No recipes found. Try searching!</div>;
  }

  return (
    <div className="recipe-list">
      {recipes.map(recipe => (
        <RecipeCard 
          key={recipe.id} 
          recipe={recipe} 
          onClick={() => onRecipeClick(recipe.id)}
        />
      ))}
    </div>
  );
};
