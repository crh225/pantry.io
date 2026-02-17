import React from 'react';
import { Recipe } from '../../types';
import { RecipeCard } from './RecipeCard';

interface EnrichedItem { recipe: Recipe; matchPct: number; missingCount: number; }
interface Props { items: EnrichedItem[]; onRecipeClick: (id: string) => void; }

export const RecipeGrid: React.FC<Props> = ({ items, onRecipeClick }) => {
  if (items.length === 0) return null;
  return (
    <div className="recipe-list">
      {items.map(({ recipe, matchPct, missingCount }) => (
        <RecipeCard key={recipe.id} recipe={recipe} onClick={() => onRecipeClick(recipe.id)}
          matchPct={recipe.ingredients.length > 0 ? matchPct : undefined} missingCount={missingCount} />
      ))}
    </div>
  );
};
