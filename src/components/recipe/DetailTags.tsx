import React from 'react';
import { Recipe } from '../../types';

interface Props { recipe: Recipe; }

export const DetailTags: React.FC<Props> = ({ recipe }) => {
  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);

  return (
    <div className="detail-tags">
      {recipe.category && <span className="tag">{recipe.category}</span>}
      {recipe.area && <span className="tag">{recipe.area}</span>}
      {totalTime > 0 && (
        <span className="tag">
          ⏱ {recipe.prepTime && `${recipe.prepTime}m prep`}
          {recipe.prepTime && recipe.cookTime && ' + '}
          {recipe.cookTime && `${recipe.cookTime}m cook`}
        </span>
      )}
      {recipe.servings && <span className="tag">🍽 {recipe.servings} servings</span>}
      {recipe.caloriesPerServing && <span className="tag">🔥 {recipe.caloriesPerServing} cal/serving</span>}
      {recipe.rating && <span className="tag">★ {recipe.rating}</span>}
    </div>
  );
};
