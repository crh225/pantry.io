import React, { useState, useEffect, useRef } from 'react';
import { Ingredient } from '../../types';
import { IngredientItem } from './IngredientItem';

interface IngredientWithStatus extends Ingredient { inPantry: boolean; }
interface Props { ingredients: IngredientWithStatus[]; }

export const IngredientsSection: React.FC<Props> = ({ ingredients }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (openIdx === null) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpenIdx(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [openIdx]);

  return (
    <section className="detail-section" ref={ref}>
      <h2>Ingredients</h2>
      <ul className="ingredients-grid">
        {ingredients.map((ing, i) => (
          <IngredientItem key={i} name={ing.name} measure={ing.measure} inPantry={ing.inPantry}
            isOpen={openIdx === i} onToggle={() => setOpenIdx(openIdx === i ? null : i)} />
        ))}
      </ul>
    </section>
  );
};
