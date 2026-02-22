import React from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { removeRecipe, moveNight } from '../store/slices/mealPlanSlice';
import { isIngredientAvailable } from '../utils/ingredientMatch';
import { MealNight, Recipe } from '../types';
import { GrabIcon, CartIcon, CheckIcon, XIcon, ChevronLeft, ChevronRight } from './NightIcons';
import { NightCost } from './NightCost';

interface Props {
  night: MealNight; idx: number; total: number; pantryNames: string[];
  dragging: boolean; dragOver: boolean;
  onDragStart: () => void; onDragEnter: () => void; onDragEnd: () => void;
  onSelectNight: (nightId: string) => void; onViewRecipe: (recipe: Recipe) => void;
  onAddToBag: (recipe: Recipe) => void;
}

export const NightCard: React.FC<Props> = ({
  night, idx, total, pantryNames, dragging, dragOver,
  onDragStart, onDragEnter, onDragEnd, onSelectNight, onViewRecipe, onAddToBag,
}) => {
  const dispatch = useAppDispatch();
  const bagNames = useAppSelector(s => s.mealPlan.bag.map(b => b.name.toLowerCase()));
  const allInPantry = night.recipe?.ingredients.length ? night.recipe.ingredients.every(i => isIngredientAvailable(i.name, pantryNames)) : false;
  const missing = night.recipe?.ingredients.filter(i => !isIngredientAvailable(i.name, pantryNames)) || [];
  const allInBag = !allInPantry && missing.length > 0 && missing.every(i => bagNames.includes(i.name.toLowerCase()));
  return (
    <div className={`night-card${dragging ? ' dragging' : ''}${dragOver ? ' drag-over' : ''}`}
      draggable={!!night.recipe} onDragStart={onDragStart} onDragEnter={onDragEnter} onDragOver={e => e.preventDefault()} onDragEnd={onDragEnd}>
      <h3>{night.label}</h3>
      {night.recipe ? (<>
        <div className="drag-handle"><GrabIcon /></div>
        <img src={night.recipe.thumbnail} alt={night.recipe.name} onClick={() => onViewRecipe(night.recipe!)} className="night-img-clickable" />
        <p className="night-recipe-name">{night.recipe.name}</p>
        <NightCost ingredients={night.recipe.ingredients} />
        <div className="night-move-mobile">
          {idx > 0 && <button onClick={() => dispatch(moveNight({ nightId: night.id, dir: -1 }))}><ChevronLeft /></button>}
          {idx < total - 1 && <button onClick={() => dispatch(moveNight({ nightId: night.id, dir: 1 }))}><ChevronRight /></button>}
        </div>
        <div className="night-actions">
          {allInPantry ? <span className="all-in-pantry"><CheckIcon /> All in pantry</span>
            : allInBag ? <span className="all-in-bag"><CheckIcon /> In bag</span>
            : <button onClick={() => onAddToBag(night.recipe!)} className="bag-btn"><CartIcon /> Bag</button>}
          <button onClick={() => dispatch(removeRecipe(night.id))} className="remove-night-btn"><XIcon /></button>
        </div>
      </>) : (
        <button onClick={() => onSelectNight(night.id)} className="assign-btn">+ Pick a Recipe</button>
      )}
    </div>
  );
};
