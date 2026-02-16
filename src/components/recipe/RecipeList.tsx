import React, { useMemo } from 'react';
import { useAppSelector } from '../../store/hooks';
import { Recipe } from '../../types';
import { RecipeCard } from './RecipeCard';
import { calculateMatchPercentage } from '../../utils/mealPlanner';
import './RecipeList.css';

interface Props { onRecipeClick: (id: string) => void; }

const useEnriched = (recipes: Recipe[], pantryItems: { name: string }[]) => {
  const pantryNames = useMemo(() => pantryItems.map(i => i.name.toLowerCase()), [pantryItems]);
  return useMemo(() => recipes.map(r => {
    const missing = r.ingredients.filter(
      ing => !pantryNames.some(p => ing.name.toLowerCase().includes(p) || p.includes(ing.name.toLowerCase()))
    );
    const pct = r.ingredients.length > 0 ? calculateMatchPercentage(r.ingredients.length, missing.length) : 0;
    return { recipe: r, matchPct: pct, missingCount: missing.length };
  }).sort((a, b) => b.matchPct - a.matchPct), [recipes, pantryNames]);
};

export const RecipeList: React.FC<Props> = ({ onRecipeClick }) => {
  const { recipes, related, loading } = useAppSelector(s => s.recipe);
  const pantryItems = useAppSelector(s => s.pantry.items);
  const enriched = useEnriched(recipes, pantryItems);
  const enrichedRelated = useEnriched(related, pantryItems);

  if (loading) return <div className="loading">Searching recipes...</div>;
  if (recipes.length === 0 && related.length === 0) return <div className="empty">Pick a cuisine or protein to explore</div>;

  return (
    <div>
      {enriched.length > 0 && (
        <div className="recipe-list">{enriched.map(({ recipe, matchPct, missingCount }) => (
          <RecipeCard key={recipe.id} recipe={recipe} onClick={() => onRecipeClick(recipe.id)}
            matchPct={recipe.ingredients.length > 0 ? matchPct : undefined} missingCount={missingCount} />
        ))}</div>
      )}
      {enrichedRelated.length > 0 && (
        <>
          <h3 className="related-heading">You might also like</h3>
          <div className="recipe-list">{enrichedRelated.map(({ recipe, matchPct, missingCount }) => (
            <RecipeCard key={recipe.id} recipe={recipe} onClick={() => onRecipeClick(recipe.id)}
              matchPct={recipe.ingredients.length > 0 ? matchPct : undefined} missingCount={missingCount} />
          ))}</div>
        </>
      )}
    </div>
  );
};
