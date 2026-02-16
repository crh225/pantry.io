import React, { useState } from 'react';
import { Ingredient } from '../../types';
import { IngredientItem } from './IngredientItem';

interface IngredientWithStatus extends Ingredient { inPantry: boolean; }
interface Props { ingredients: IngredientWithStatus[]; }

export const IngredientsSection: React.FC<Props> = ({ ingredients }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section className="detail-section">
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
