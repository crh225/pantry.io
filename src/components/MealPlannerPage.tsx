import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { kroger } from '../services/kroger';
import { setSelected } from '../store/slices/recipeSlice';
import { fetchRecipeById } from '../store/slices/recipeThunks';
import { addToBag } from '../store/slices/mealPlanSlice';
import { recipeApi } from '../services/recipeApi';
import { MealNights } from './MealNights';
import { ShoppingBag } from './ShoppingBag';
import { CartCheckout } from './CartCheckout';
import { RecipeSelector } from './RecipeSelector';
import { RecipeDetail } from './recipe/RecipeDetail';
import { Recipe } from '../types';
import './MealPlannerPage.css';

export const MealPlannerPage: React.FC = () => {
  const [selectingNight, setSelectingNight] = useState<string | null>(null);
  const [viewingRecipe, setViewingRecipe] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const { nights, bag } = useAppSelector(s => s.mealPlan);
  const dispatch = useAppDispatch();
  const hasStore = kroger.getSelectedStore() !== null;

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

  if (viewingRecipe) return <div className="meal-planner"><RecipeDetail onBack={() => setViewingRecipe(false)} /></div>;
  if (selectingNight) return <div className="meal-planner"><RecipeSelector nightId={selectingNight} onDone={() => setSelectingNight(null)} /></div>;
  if (checkingOut) return <div className="meal-planner"><CartCheckout bag={bag} onBack={() => setCheckingOut(false)} /></div>;
  return (
    <div className="meal-planner">
      <div className="planner-header"><h1>Meal Planner</h1><p>Plan your meals, price them at Kroger, and go pick up</p></div>
      {kroger.isConfigured() && !hasStore && (
        <div className="store-prompt">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{verticalAlign:'middle',marginRight:4}}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          Set your Kroger store in the header to see local prices
        </div>
      )}
      <div className="planner-layout">
        <div className="planner-main">
          <MealNights nights={nights} onSelectNight={setSelectingNight} onViewRecipe={handleViewRecipe} onAddToBag={handleAddToBag} />
        </div>
        {bag.length > 0 && (
          <div className="planner-sidebar">
            <ShoppingBag bag={bag} onCheckout={() => setCheckingOut(true)} />
          </div>
        )}
      </div>
    </div>
  );
};
