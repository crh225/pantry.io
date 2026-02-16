import React from 'react';
import { useAppDispatch } from '../store/hooks';
import { removeFromBag, clearBag } from '../store/slices/mealPlanSlice';
import { Ingredient } from '../types';
import { useKrogerPrices } from '../hooks/useKrogerPrices';
import './ShoppingBag.css';

interface Props { bag: Ingredient[]; }

export const ShoppingBag: React.FC<Props> = ({ bag }) => {
  const dispatch = useAppDispatch();
  const { priced, total, available } = useKrogerPrices(bag);

  const handleExport = () => {
    const text = bag.map(i => `${i.measure} ${i.name}`).join('\n');
    navigator.clipboard.writeText(text);
    alert('Shopping list copied!');
  };

  if (bag.length === 0) return null;

  return (
    <div className="shopping-bag">
      <div className="bag-header">
        <h2>🛒 Shopping Bag ({bag.length})</h2>
        {available && total > 0 && <span className="bag-total">~${total.toFixed(2)}</span>}
        <div className="bag-actions">
          <button onClick={handleExport} className="copy-btn">Copy</button>
          <button onClick={() => dispatch(clearBag())} className="clear-btn">Clear</button>
        </div>
      </div>
      <ul className="bag-items">
        {priced.map((p, i) => (
          <li key={i}>
            <span className="bag-item-name">{p.ingredient.measure} {p.ingredient.name}</span>
            {p.loading && <span className="bag-price">...</span>}
            {p.product?.price && <span className="bag-price">${p.product.price.regular.toFixed(2)}</span>}
            <button onClick={() => dispatch(removeFromBag(p.ingredient.name))} className="remove-item">×</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
