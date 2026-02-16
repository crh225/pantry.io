import React from 'react';
import { Ingredient } from '../../types';
import { IngredientItem } from './IngredientItem';

interface IngredientWithStatus extends Ingredient { inPantry: boolean; }
interface Props { ingredients: IngredientWithStatus[]; }

export const IngredientsSection: React.FC<Props> = ({ ingredients }) => (
  <section className="detail-section">
    <h2>Ingredients</h2>
    <ul className="ingredients-grid">
      {ingredients.map((ing, i) => (
        <IngredientItem key={i} name={ing.name} measure={ing.measure} inPantry={ing.inPantry} />
      ))}
    </ul>
  </section>
);
