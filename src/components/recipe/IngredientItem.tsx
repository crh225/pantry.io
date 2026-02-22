import React from 'react';
import { IngredientPopup } from './IngredientPopup';
import './IngredientItem.css';

interface Props {
  name: string; measure: string; inPantry: boolean;
  isOpen: boolean; onToggle: () => void;
}

const imgUrl = (name: string) =>
  `https://www.themealdb.com/images/ingredients/${encodeURIComponent(name)}-Small.png`;

export const IngredientItem: React.FC<Props> = ({ name, measure, inPantry, isOpen, onToggle }) => (
  <li className={`ing-item ${inPantry ? 'in-pantry' : 'need-to-buy'}${isOpen ? ' open' : ''}`} onClick={onToggle}>
    <img src={imgUrl(name)} alt="" className="ing-thumb" onError={e => (e.currentTarget.style.display = 'none')} />
    <div className="ing-text">
      <span className="ing-name">{name}</span>
      <span className="ing-measure">{measure}</span>
    </div>
    <span className="ing-status">{inPantry ? '✓' : '○'}</span>
    {isOpen && <IngredientPopup name={name} measure={measure} inPantry={inPantry} onClose={onToggle} />}
  </li>
);
