import React, { useMemo, useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import { Recipe } from '../../types';
import { SortBar, SortMode } from './SortBar';
import { calculateMatchPercentage } from '../../utils/mealPlanner';
import { isIngredientAvailable } from '../../utils/ingredientMatch';
import { RecipeGrid } from './RecipeGrid';
import './RecipeList.css';

interface Props { onRecipeClick: (id: string) => void; }

const useEnriched = (recipes: Recipe[], pantryItems: { name: string }[], sort: SortMode) => {
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

const SkeletonCard: React.FC = () => (
  <div className="recipe-card skeleton-card">
    <div className="skeleton-image" />
    <div className="recipe-info">
      <div className="skeleton-line skeleton-title" />
      <div className="skeleton-line skeleton-meta" />
    </div>
  </div>
);

const SkeletonGrid: React.FC = () => (
  <div className="recipe-list">
    {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
  </div>
);

export const RecipeList: React.FC<Props> = ({ onRecipeClick }) => {
  const { recipes, related, loading } = useAppSelector(s => s.recipe);
  const pantryItems = useAppSelector(s => s.pantry.items);
  const [sort, setSort] = useState<SortMode>('match');
  const enriched = useEnriched(recipes, pantryItems, sort);
  const enrichedRelated = useEnriched(related, pantryItems, sort);

  if (loading) return <SkeletonGrid />;
  if (recipes.length === 0 && related.length === 0) return <div className="empty">Pick a cuisine or protein to explore</div>;

  return (
    <div>
      {enriched.length > 0 && <SortBar mode={sort} onChange={setSort} />}
      <RecipeGrid items={enriched} onRecipeClick={onRecipeClick} />
      {enrichedRelated.length > 0 && (
        <><h3 className="related-heading">You might also like</h3>
          <RecipeGrid items={enrichedRelated} onRecipeClick={onRecipeClick} /></>
      )}
    </div>
  );
};
