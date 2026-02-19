import { useMemo } from 'react';
import { Recipe } from '../types';
import { calculateMatchPercentage } from '../utils/mealPlanner';
import { isIngredientAvailable } from '../utils/ingredientMatch';

export type SortMode = 'match' | 'least-to-buy';

export const useEnriched = (recipes: Recipe[], pantryItems: { name: string }[], sort: SortMode) => {
  const pantryNames = useMemo(() => pantryItems.map(i => i.name.toLowerCase()), [pantryItems]);
  return useMemo(() => {
    const arr = recipes.map(r => {
      const missing = r.ingredients.filter(ing => !isIngredientAvailable(ing.name, pantryNames));
      const pct = r.ingredients.length > 0 ? calculateMatchPercentage(r.ingredients.length, missing.length) : 0;
      return { recipe: r, matchPct: pct, missingCount: missing.length };
    });
    return sort === 'least-to-buy'
      ? arr.sort((a, b) => a.missingCount - b.missingCount || b.matchPct - a.matchPct)
      : arr.sort((a, b) => b.matchPct - a.matchPct);
  }, [recipes, pantryNames, sort]);
};
