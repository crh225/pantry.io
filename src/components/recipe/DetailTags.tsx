import React from 'react';
import { Recipe } from '../../types';

interface DetailTagsProps {
  recipe: Recipe;
}

export const DetailTags: React.FC<DetailTagsProps> = ({ recipe }) => (
  <div className="detail-tags">
    {recipe.category && <span className="tag">{recipe.category}</span>}
    {recipe.area && <span className="tag">{recipe.area}</span>}
  </div>
);
