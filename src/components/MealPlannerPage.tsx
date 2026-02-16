import React, { useState } from 'react';
import { useAppSelector } from '../store/hooks';
import { kroger } from '../services/kroger';
import { MealNights } from './MealNights';
import { ShoppingBag } from './ShoppingBag';
import { RecipeSelector } from './RecipeSelector';
import { KrogerStorePicker } from './KrogerStorePicker';
import './MealPlannerPage.css';

export const MealPlannerPage: React.FC = () => {
  const [selectingNight, setSelectingNight] = useState<string | null>(null);
  const [storeSet, setStoreSet] = useState(false);
  const { nights, bag } = useAppSelector(s => s.mealPlan);

  const handleStoreSelect = (storeId: string) => {
    const cfg = kroger.getConfig();
    if (cfg) kroger.configure({ ...cfg, locationId: storeId });
    setStoreSet(true);
  };

  return (
    <div className="meal-planner">
      <div className="planner-header">
        <h1>Meal Planner</h1>
        <p>Plan your meals, price them at Kroger, and go pick up</p>
      </div>
      {selectingNight ? (
        <RecipeSelector nightId={selectingNight} onDone={() => setSelectingNight(null)} />
      ) : (
        <>
          <MealNights nights={nights} onSelectNight={setSelectingNight} />
          {kroger.isConfigured() && !storeSet && <KrogerStorePicker onSelect={handleStoreSelect} />}
          <ShoppingBag bag={bag} />
        </>
      )}
    </div>
  );
};
