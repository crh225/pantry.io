import React, { useMemo } from 'react';
import { useAppSelector } from '../store/hooks';
import { useKrogerPrices } from '../hooks/useKrogerPrices';
import { isIngredientAvailable } from '../utils/ingredientMatch';
import { Ingredient } from '../types';

export const NightCost: React.FC<{ ingredients: Ingredient[] }> = ({ ingredients }) => {
  const pantryItems = useAppSelector(s => s.pantry.items);
  const pantryNames = useMemo(() => pantryItems.map(i => i.name.toLowerCase()), [pantryItems]);
  const missing = useMemo(
    () => ingredients.filter(i => !isIngredientAvailable(i.name, pantryNames)),
    [ingredients, pantryNames]
  );
  const { priced, total, available } = useKrogerPrices(missing);
  if (!available) return null;
  const loading = priced.some(p => p.loading);
  if (!loading && total === 0) return null;
  return (
    <span className="night-cost">{loading ? '...' : `~$${total.toFixed(2)}`}</span>
  );
};
