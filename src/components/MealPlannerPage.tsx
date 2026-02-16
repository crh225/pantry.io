import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { kroger, KrogerStore } from '../services/kroger';
import { setSelected } from '../store/slices/recipeSlice';
import { fetchRecipeById } from '../store/slices/recipeThunks';
import { addToBag } from '../store/slices/mealPlanSlice';
import { recipeApi } from '../services/recipeApi';
import { MealNights } from './MealNights';
import { ShoppingBag } from './ShoppingBag';
import { RecipeSelector } from './RecipeSelector';
import { KrogerStorePicker } from './KrogerStorePicker';
import { RecipeDetail } from './recipe/RecipeDetail';
import { Recipe } from '../types';
import './MealPlannerPage.css';

export const MealPlannerPage: React.FC = () => {
  const [selectingNight, setSelectingNight] = useState<string | null>(null);
  const [viewingRecipe, setViewingRecipe] = useState(false);
  const [selectedStore, setSelectedStore] = useState<KrogerStore | null>(() => kroger.getSelectedStore());
  const { nights, bag } = useAppSelector(s => s.mealPlan);
  const dispatch = useAppDispatch();

  const handleViewRecipe = (r: Recipe) => {
    dispatch(setSelected(r));
    if (!r.id.startsWith('dj-')) dispatch(fetchRecipeById(r.id));
    setViewingRecipe(true);
  };
  const handleAddToBag = async (r: Recipe) => {
    if (r.ingredients.length > 0) { dispatch(addToBag(r.ingredients)); return; }
    const full = await recipeApi.getById(r.id);
    if (full) dispatch(addToBag(full.ingredients));
  };
  const handleStoreSelect = (store: KrogerStore) => {
    kroger.setStore(store);
    setSelectedStore(store);
  };

  if (viewingRecipe) return <div className="meal-planner"><RecipeDetail onBack={() => setViewingRecipe(false)} /></div>;
  if (selectingNight) return <div className="meal-planner"><RecipeSelector nightId={selectingNight} onDone={() => setSelectingNight(null)} /></div>;
  return (
    <div className="meal-planner">
      <div className="planner-header"><h1>Meal Planner</h1><p>Plan your meals, price them at Kroger, and go pick up</p></div>
      <MealNights nights={nights} onSelectNight={setSelectingNight} onViewRecipe={handleViewRecipe} onAddToBag={handleAddToBag} />
      {kroger.isConfigured() && <KrogerStorePicker onSelect={handleStoreSelect} selectedStore={selectedStore} />}
      <ShoppingBag bag={bag} />
    </div>
  );
};
