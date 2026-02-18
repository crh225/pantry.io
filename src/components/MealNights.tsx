import React, { useRef, useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { removeRecipe, moveNight } from '../store/slices/mealPlanSlice';
import { useKrogerPrices } from '../hooks/useKrogerPrices';
import { isIngredientAvailable } from '../utils/ingredientMatch';
import { MealNight, Recipe, Ingredient } from '../types';
import './MealNights.css';

const NightCost: React.FC<{ ingredients: Ingredient[] }> = ({ ingredients }) => {
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

interface Props {
  nights: MealNight[];
  onSelectNight: (nightId: string) => void;
  onViewRecipe: (recipe: Recipe) => void;
  onAddToBag: (recipe: Recipe) => void;
}

const GrabIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="5" r="1"/><circle cx="15" cy="5" r="1"/>
    <circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/>
    <circle cx="9" cy="19" r="1"/><circle cx="15" cy="19" r="1"/>
  </svg>
);

const CartIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

export const MealNights: React.FC<Props> = ({ nights, onSelectNight, onViewRecipe, onAddToBag }) => {
  const dispatch = useAppDispatch();
  const pantryItems = useAppSelector(s => s.pantry.items);
  const pantryNames = useMemo(() => pantryItems.map(i => i.name.toLowerCase()), [pantryItems]);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  const [dragging, setDragging] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);

  const handleDragStart = (idx: number) => {
    dragItem.current = idx;
    setDragging(idx);
  };

  const handleDragEnter = (idx: number) => {
    dragOverItem.current = idx;
    setDragOver(idx);
  };

  const handleDragEnd = () => {
    if (dragItem.current !== null && dragOverItem.current !== null && dragItem.current !== dragOverItem.current) {
      const fromId = nights[dragItem.current].id;
      const diff = dragOverItem.current - dragItem.current;
      // Move one step at a time to reach target
      const dir = diff > 0 ? 1 : -1;
      for (let i = 0; i < Math.abs(diff); i++) {
        dispatch(moveNight({ nightId: fromId, dir: dir as -1 | 1 }));
      }
    }
    dragItem.current = null;
    dragOverItem.current = null;
    setDragging(null);
    setDragOver(null);
  };

  return (
    <div className="meal-nights">
      <h2>Your Meals</h2>
      <div className="nights-grid">
        {nights.map((night, idx) => (
          <div
            key={night.id}
            className={`night-card${dragging === idx ? ' dragging' : ''}${dragOver === idx && dragging !== idx ? ' drag-over' : ''}`}
            draggable={!!night.recipe}
            onDragStart={() => handleDragStart(idx)}
            onDragEnter={() => handleDragEnter(idx)}
            onDragOver={e => e.preventDefault()}
            onDragEnd={handleDragEnd}
          >
            <h3>{night.label}</h3>
            {night.recipe ? (
              <>
                <div className="drag-handle"><GrabIcon /></div>
                <img src={night.recipe.thumbnail} alt={night.recipe.name}
                  onClick={() => onViewRecipe(night.recipe!)} className="night-img-clickable" />
                <p className="night-recipe-name">{night.recipe.name}</p>
                <NightCost ingredients={night.recipe.ingredients} />
                <div className="night-move-mobile">
                  {idx > 0 && <button onClick={() => dispatch(moveNight({ nightId: night.id, dir: -1 }))}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                  </button>}
                  {idx < nights.length - 1 && <button onClick={() => dispatch(moveNight({ nightId: night.id, dir: 1 }))}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                  </button>}
                </div>
                <div className="night-actions">
                  {night.recipe!.ingredients.length > 0 &&
                   night.recipe!.ingredients.every(i => isIngredientAvailable(i.name, pantryNames))
                    ? <span className="all-in-pantry"><CheckIcon /> All in pantry</span>
                    : <button onClick={() => onAddToBag(night.recipe!)} className="bag-btn"><CartIcon /> Bag</button>
                  }
                  <button onClick={() => dispatch(removeRecipe(night.id))} className="remove-night-btn">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
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
