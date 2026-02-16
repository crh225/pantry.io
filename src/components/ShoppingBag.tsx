import React from 'react';
import { useAppDispatch } from '../store/hooks';
import { removeFromBag, clearBag } from '../store/slices/mealPlanSlice';
import { Ingredient } from '../types';
import './ShoppingBag.css';

interface ShoppingBagProps {
  bag: Ingredient[];
}

export const ShoppingBag: React.FC<ShoppingBagProps> = ({ bag }) => {
  const dispatch = useAppDispatch();

  const handleExport = () => {
    const text = bag.map(i => `${i.measure} ${i.name}`).join('\n');
    navigator.clipboard.writeText(text);
    alert('Shopping list copied to clipboard!');
  };

  if (bag.length === 0) return null;

  return (
    <div className="shopping-bag">
      <div className="bag-header">
        <h2>🛒 Shopping Bag ({bag.length} items)</h2>
        <div className="bag-actions">
          <button onClick={handleExport} className="copy-btn">Copy List</button>
          <button onClick={() => dispatch(clearBag())} className="clear-btn">Clear</button>
        </div>
      </div>
      <ul className="bag-items">
        {bag.map((item, i) => (
          <li key={i}>
            <span>{item.measure} {item.name}</span>
            <button onClick={() => dispatch(removeFromBag(item.name))} className="remove-item">×</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
