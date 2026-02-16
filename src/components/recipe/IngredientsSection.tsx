import React from 'react';
import { Ingredient } from '../../types';

interface IngredientWithStatus extends Ingredient {
  inPantry: boolean;
}

interface Props {
  ingredients: IngredientWithStatus[];
}

export const IngredientsSection: React.FC<Props> = ({ ingredients }) => (
  <section className="detail-section">
    <h2>Ingredients</h2>
    <ul className="ingredients-grid">
      {ingredients.map((ing, i) => (
        <li key={i} className={ing.inPantry ? 'in-pantry' : 'need-to-buy'}>
          <span className="ing-status">{ing.inPantry ? '✓' : '○'}</span>
          <span className="ing-measure">{ing.measure}</span>
          <span className="ing-name">{ing.name}</span>
        </li>
      ))}
    </ul>
  </section>
);
