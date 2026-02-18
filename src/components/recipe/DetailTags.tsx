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
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{verticalAlign:'middle',marginRight:3}}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          {recipe.prepTime && `${recipe.prepTime}m prep`}
          {recipe.prepTime && recipe.cookTime && ' + '}
          {recipe.cookTime && `${recipe.cookTime}m cook`}
        </span>
      )}
      {recipe.servings && <span className="tag"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{verticalAlign:'middle',marginRight:3}}><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg> {recipe.servings} servings</span>}
      {recipe.caloriesPerServing && <span className="tag"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{verticalAlign:'middle',marginRight:3}}><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg> {recipe.caloriesPerServing} cal/serving</span>}
      {recipe.rating && <span className="tag">★ {recipe.rating}{recipe.reviewCount ? ` (${recipe.reviewCount} reviews)` : ''}</span>}
    </div>
  );
};
