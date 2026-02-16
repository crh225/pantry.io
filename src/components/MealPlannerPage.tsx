import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { kroger } from '../services/kroger';
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
  const [storeSet, setStoreSet] = useState(false);
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
  const handleStoreSelect = (id: string) => {
    const cfg = kroger.getConfig();
    if (cfg) kroger.configure({ ...cfg, locationId: id });
    setStoreSet(true);
  };

  if (viewingRecipe) return <div className="meal-planner"><RecipeDetail onBack={() => setViewingRecipe(false)} /></div>;
  if (selectingNight) return <div className="meal-planner"><RecipeSelector nightId={selectingNight} onDone={() => setSelectingNight(null)} /></div>;
  return (
    <div className="meal-planner">
      <div className="planner-header"><h1>Meal Planner</h1><p>Plan your meals, price them at Kroger, and go pick up</p></div>
      <MealNights nights={nights} onSelectNight={setSelectingNight} onViewRecipe={handleViewRecipe} onAddToBag={handleAddToBag} />
      {kroger.isConfigured() && !storeSet && <KrogerStorePicker onSelect={handleStoreSelect} />}
      <ShoppingBag bag={bag} />
    </div>
  );
};
