import React, { memo } from 'react';
import { Recipe } from '../../types';
import { DonutChart } from './DonutChart';
import { estimateCalories } from '../../data/calories';
import './RecipeCard.css';

interface Props { recipe: Recipe; onClick: () => void; matchPct?: number; missingCount?: number; }

export const RecipeCard = memo<Props>(({ recipe, onClick, matchPct, missingCount }) => {
  const cal = recipe.caloriesPerServing || (recipe.ingredients.length > 0 ? estimateCalories(recipe.ingredients) : null);
  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);

  return (
    <div className="recipe-card" onClick={onClick}>
      <div className="recipe-image-wrap">
        <img src={recipe.thumbnail} alt={recipe.name} className="recipe-image" loading="lazy" />
        {matchPct !== undefined && <DonutChart percent={matchPct} />}
        {totalTime > 0 && <span className="time-badge">⏱ {totalTime}m</span>}
      </div>
      <div className="recipe-info">
        <h3 className="recipe-name">{recipe.name}</h3>
        <div className="recipe-meta">
          {recipe.category && <span className="recipe-tag">{recipe.category}</span>}
          {recipe.area && <span className="recipe-tag">{recipe.area}</span>}
          {cal && <span className="recipe-cal">{recipe.caloriesPerServing ? '' : '~'}{cal} cal</span>}
          {recipe.rating && <span className="recipe-cal">★ {recipe.rating}</span>}
        </div>
        {missingCount !== undefined && missingCount > 0 && <span className="missing-text">{missingCount} to buy</span>}
      </div>
    </div>
  );
});

RecipeCard.displayName = 'RecipeCard';
