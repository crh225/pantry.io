import React, { useMemo } from 'react';
import { useAppSelector } from '../../store/hooks';
import { RecipeCard } from './RecipeCard';
import { calculateMatchPercentage } from '../../utils/mealPlanner';
import './RecipeList.css';

interface RecipeListProps {
  onRecipeClick: (recipeId: string) => void;
}

export const RecipeList: React.FC<RecipeListProps> = ({ onRecipeClick }) => {
  const { recipes, loading } = useAppSelector(state => state.recipe);
  const pantryItems = useAppSelector(state => state.pantry.items);

  const pantryNames = useMemo(
    () => pantryItems.map(i => i.name.toLowerCase()),
    [pantryItems]
  );

  const enriched = useMemo(() => {
    return recipes.map(r => {
      const missing = r.ingredients.filter(
        ing => !pantryNames.some(p => ing.name.toLowerCase().includes(p) || p.includes(ing.name.toLowerCase()))
      );
      const pct = r.ingredients.length > 0
        ? calculateMatchPercentage(r.ingredients.length, missing.length)
        : 0;
      return { recipe: r, matchPct: pct, missingCount: missing.length };
    }).sort((a, b) => b.matchPct - a.matchPct);
  }, [recipes, pantryNames]);

  if (loading) return <div className="loading">Searching recipes...</div>;
  if (recipes.length === 0) return <div className="empty">Pick a cuisine or protein to explore recipes</div>;

  return (
    <div className="recipe-list">
      {enriched.map(({ recipe, matchPct, missingCount }) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          onClick={() => onRecipeClick(recipe.id)}
          matchPct={recipe.ingredients.length > 0 ? matchPct : undefined}
          missingCount={missingCount}
        />
      ))}
    </div>
  );
};
