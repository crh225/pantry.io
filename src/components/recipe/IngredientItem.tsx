import React, { useState } from 'react';
import { Ingredient } from '../../types';
import { IngredientPopup } from './IngredientPopup';
import './IngredientItem.css';

interface Props extends Ingredient { inPantry: boolean; }

const imgUrl = (name: string) =>
  `https://www.themealdb.com/images/ingredients/${encodeURIComponent(name)}-Small.png`;

export const IngredientItem: React.FC<Props> = ({ name, measure, inPantry }) => {
  const [open, setOpen] = useState(false);

  return (
    <li className={`ing-item ${inPantry ? 'in-pantry' : 'need-to-buy'}`} onClick={() => setOpen(!open)}>
      <img src={imgUrl(name)} alt="" className="ing-thumb" onError={e => (e.currentTarget.style.display = 'none')} />
      <div className="ing-text">
        <span className="ing-name">{name}</span>
        <span className="ing-measure">{measure}</span>
      </div>
      <span className="ing-status">{inPantry ? '✓' : '○'}</span>
      {open && <IngredientPopup name={name} />}
    </li>
  );
};
