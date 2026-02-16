import React, { memo } from 'react';
import { Recipe } from '../../types';
import './RecipeCard.css';

interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
  matchPct?: number;
  missingCount?: number;
}

export const RecipeCard = memo<RecipeCardProps>(({
  recipe, onClick, matchPct, missingCount,
}) => (
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
        {recipe.category && <span className="recipe-category">{recipe.category}</span>}
        {recipe.area && <span className="recipe-area">{recipe.area}</span>}
      </div>
      {matchPct !== undefined && (
        <div className="recipe-match">
          <span className="match-bar-bg">
            <span className="match-bar-fill" style={{ width: `${matchPct}%` }} />
          </span>
          <span className="match-text">{matchPct}% pantry match</span>
          {missingCount !== undefined && missingCount > 0 && (
            <span className="missing-text">
              {missingCount} item{missingCount > 1 ? 's' : ''} to buy
            </span>
          )}
        </div>
      )}
    </div>
  </div>
));

RecipeCard.displayName = 'RecipeCard';
