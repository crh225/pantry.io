import React, { useRef, useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { moveNight } from '../store/slices/mealPlanSlice';
import { MealNight, Recipe } from '../types';
import { NightCard } from './NightCard';
import './MealNights.css';

interface Props {
  nights: MealNight[];
  onSelectNight: (nightId: string) => void;
  onViewRecipe: (recipe: Recipe) => void;
  onAddToBag: (recipe: Recipe) => void;
}

export const MealNights: React.FC<Props> = ({ nights, onSelectNight, onViewRecipe, onAddToBag }) => {
  const dispatch = useAppDispatch();
  const pantryItems = useAppSelector(s => s.pantry.items);
  const pantryNames = useMemo(() => pantryItems.map(i => i.name.toLowerCase()), [pantryItems]);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  const [dragging, setDragging] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);

  const handleDragEnd = () => {
    if (dragItem.current !== null && dragOverItem.current !== null && dragItem.current !== dragOverItem.current) {
      const fromId = nights[dragItem.current].id;
      const diff = dragOverItem.current - dragItem.current;
      const dir = diff > 0 ? 1 : -1;
      for (let i = 0; i < Math.abs(diff); i++) dispatch(moveNight({ nightId: fromId, dir: dir as -1 | 1 }));
    }
    dragItem.current = null; dragOverItem.current = null;
    setDragging(null); setDragOver(null);
  };

  return (
    <div className="meal-nights">
      <h2>Your Meals</h2>
      <div className="nights-grid">
        {nights.map((night, idx) => (
          <NightCard key={night.id} night={night} idx={idx} total={nights.length}
            pantryNames={pantryNames} dragging={dragging === idx}
            dragOver={dragOver === idx && dragging !== idx}
            onDragStart={() => { dragItem.current = idx; setDragging(idx); }}
            onDragEnter={() => { dragOverItem.current = idx; setDragOver(idx); }}
            onDragEnd={handleDragEnd} onSelectNight={onSelectNight}
            onViewRecipe={onViewRecipe} onAddToBag={onAddToBag} />
        ))}
      </div>
    </div>
  );
};
