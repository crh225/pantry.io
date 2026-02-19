import React, { useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import { SortBar, SortMode } from './SortBar';
import { useEnriched } from '../../hooks/useEnriched';
import { RecipeGrid } from './RecipeGrid';
import { SkeletonGrid } from './SkeletonGrid';
import './RecipeList.css';

interface Props { onRecipeClick: (id: string) => void; }

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
