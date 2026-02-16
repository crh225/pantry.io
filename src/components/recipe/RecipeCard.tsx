import React, { memo } from 'react';
import { Recipe } from '../../types';
import './RecipeCard.css';

interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
}

export const RecipeCard = memo<RecipeCardProps>(({ recipe, onClick }) => {
  return (
    <div className="recipe-card" onClick={onClick}>
      <img 
        src={recipe.thumbnail} 
        alt={recipe.name}
        className="recipe-image"
        loading="lazy"
      />
      <div className="recipe-info">
        <h3 className="recipe-name">{recipe.name}</h3>
        <div className="recipe-meta">
          <span className="recipe-category">{recipe.category}</span>
          <span className="recipe-area">{recipe.area}</span>
        </div>
      </div>
    </div>
  );
});

RecipeCard.displayName = 'RecipeCard';
