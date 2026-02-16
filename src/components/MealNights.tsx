import React from 'react';
import { useAppDispatch } from '../store/hooks';
import { removeRecipe, addToBag, moveNight } from '../store/slices/mealPlanSlice';
import { MealNight, Recipe } from '../types';
import './MealNights.css';

interface Props {
  nights: MealNight[];
  onSelectNight: (nightId: string) => void;
  onViewRecipe: (recipe: Recipe) => void;
}

export const MealNights: React.FC<Props> = ({ nights, onSelectNight, onViewRecipe }) => {
  const dispatch = useAppDispatch();
  const addToBagHandler = (n: MealNight) => { if (n.recipe) dispatch(addToBag(n.recipe.ingredients)); };

  return (
    <div className="meal-nights">
      <h2>Your Meals</h2>
      <div className="nights-grid">
        {nights.map((night, idx) => (
          <div key={night.id} className="night-card">
            <h3>{night.label}</h3>
            {night.recipe ? (
              <>
                <img src={night.recipe.thumbnail} alt={night.recipe.name}
                  onClick={() => onViewRecipe(night.recipe!)} className="night-img-clickable" />
                <p className="night-recipe-name">{night.recipe.name}</p>
                <div className="night-move">
                  {idx > 0 && <button onClick={() => dispatch(moveNight({ nightId: night.id, dir: -1 }))}>←</button>}
                  {idx < nights.length - 1 && <button onClick={() => dispatch(moveNight({ nightId: night.id, dir: 1 }))}>→</button>}
                </div>
                <div className="night-actions">
                  <button onClick={() => addToBagHandler(night)} className="bag-btn">🛒 Bag</button>
                  <button onClick={() => onSelectNight(night.id)} className="swap-btn">↻ Swap</button>
                  <button onClick={() => dispatch(removeRecipe(night.id))} className="remove-night-btn">✕</button>
                </div>
              </>
            ) : (
              <button onClick={() => onSelectNight(night.id)} className="assign-btn">+ Pick a Recipe</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
