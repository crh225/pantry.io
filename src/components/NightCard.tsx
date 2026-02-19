import React from 'react';
import { useAppDispatch } from '../store/hooks';
import { removeRecipe, moveNight } from '../store/slices/mealPlanSlice';
import { isIngredientAvailable } from '../utils/ingredientMatch';
import { MealNight, Recipe } from '../types';
import { GrabIcon, CartIcon, CheckIcon } from './NightIcons';
import { NightCost } from './NightCost';

interface Props {
  night: MealNight;
  idx: number;
  total: number;
  pantryNames: string[];
  dragging: boolean;
  dragOver: boolean;
  onDragStart: () => void;
  onDragEnter: () => void;
  onDragEnd: () => void;
  onSelectNight: (nightId: string) => void;
  onViewRecipe: (recipe: Recipe) => void;
  onAddToBag: (recipe: Recipe) => void;
}

export const NightCard: React.FC<Props> = ({
  night, idx, total, pantryNames, dragging, dragOver,
  onDragStart, onDragEnter, onDragEnd, onSelectNight, onViewRecipe, onAddToBag,
}) => {
  const dispatch = useAppDispatch();
  const allInPantry = night.recipe?.ingredients.length
    ? night.recipe.ingredients.every(i => isIngredientAvailable(i.name, pantryNames))
    : false;

  return (
    <div className={`night-card${dragging ? ' dragging' : ''}${dragOver ? ' drag-over' : ''}`}
      draggable={!!night.recipe} onDragStart={onDragStart}
      onDragEnter={onDragEnter} onDragOver={e => e.preventDefault()} onDragEnd={onDragEnd}>
      <h3>{night.label}</h3>
      {night.recipe ? (
        <>
          <div className="drag-handle"><GrabIcon /></div>
          <img src={night.recipe.thumbnail} alt={night.recipe.name}
            onClick={() => onViewRecipe(night.recipe!)} className="night-img-clickable" />
          <p className="night-recipe-name">{night.recipe.name}</p>
          <NightCost ingredients={night.recipe.ingredients} />
          <div className="night-actions">
            {allInPantry
              ? <span className="all-in-pantry"><CheckIcon /> All in pantry</span>
              : <button onClick={() => onAddToBag(night.recipe!)} className="bag-btn"><CartIcon /> Bag</button>}
            <button onClick={() => dispatch(removeRecipe(night.id))} className="remove-night-btn">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </>
      ) : (
        <button onClick={() => onSelectNight(night.id)} className="assign-btn">+ Pick a Recipe</button>
      )}
    </div>
  );
};
