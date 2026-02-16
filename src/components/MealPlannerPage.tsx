import React, { useState } from 'react';
import { useAppSelector } from '../store/hooks';
import { MealNights } from './MealNights';
import { ShoppingBag } from './ShoppingBag';
import { RecipeSelector } from './RecipeSelector';
import './MealPlannerPage.css';

export const MealPlannerPage: React.FC = () => {
  const [selectingNight, setSelectingNight] = useState<string | null>(null);
  const { nights, bag } = useAppSelector(state => state.mealPlan);

  return (
    <div className="meal-planner">
      <div className="planner-header">
        <h1>Meal Planner</h1>
        <p>Plan your meals for the week and build your shopping bag</p>
      </div>
      {selectingNight ? (
        <RecipeSelector
          nightId={selectingNight}
          onDone={() => setSelectingNight(null)}
        />
      ) : (
        <>
          <MealNights nights={nights} onSelectNight={setSelectingNight} />
          <ShoppingBag bag={bag} />
          <div className="kroger-note">
            🛒 <em>Kroger integration coming soon — send your bag directly to Kroger!</em>
          </div>
        </>
      )}
    </div>
  );
};
