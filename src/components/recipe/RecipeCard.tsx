import React, { memo } from 'react';
import { Recipe } from '../../types';
import { DonutChart } from './DonutChart';
import './RecipeCard.css';

interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
  matchPct?: number;
  missingCount?: number;
}

export const RecipeCard = memo<RecipeCardProps>(({ recipe, onClick, matchPct, missingCount }) => (
  <div className="recipe-card" onClick={onClick}>
    <div className="recipe-image-wrap">
      <img src={recipe.thumbnail} alt={recipe.name} className="recipe-image" loading="lazy" />
      {matchPct !== undefined && <DonutChart percent={matchPct} />}
    </div>
    <div className="recipe-info">
      <h3 className="recipe-name">{recipe.name}</h3>
      <div className="recipe-meta">
        {recipe.category && <span className="recipe-category">{recipe.category}</span>}
        {recipe.area && <span className="recipe-area">{recipe.area}</span>}
        {missingCount !== undefined && missingCount > 0 && (
          <span className="missing-text">{missingCount} to buy</span>
        )}
      </div>
    </div>
  </div>
));

RecipeCard.displayName = 'RecipeCard';
