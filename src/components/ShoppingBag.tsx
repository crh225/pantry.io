import React, { useMemo } from 'react';
import { useAppDispatch } from '../store/hooks';
import { removeFromBag, clearBag } from '../store/slices/mealPlanSlice';
import { Ingredient } from '../types';
import { useKrogerPrices } from '../hooks/useKrogerPrices';
import './ShoppingBag.css';

interface Props { bag: Ingredient[]; }

const dedup = (bag: Ingredient[]): Ingredient[] => {
  const map = new Map<string, Ingredient>();
  bag.forEach(i => {
    const key = i.name.toLowerCase();
    if (!map.has(key)) map.set(key, i);
  });
  return Array.from(map.values());
};

export const ShoppingBag: React.FC<Props> = ({ bag }) => {
  const dispatch = useAppDispatch();
  const unique = useMemo(() => dedup(bag), [bag]);
  const { priced, total, available } = useKrogerPrices(unique);

  const handleExport = () => {
    const text = unique.map(i => `${i.measure} ${i.name}`).join('\n');
    navigator.clipboard.writeText(text);
  };

  if (unique.length === 0) return null;

  return (
    <div className="shopping-bag">
      <div className="bag-header">
        <h2>🛒 Shopping Bag ({unique.length})</h2>
        {available && total > 0 && <span className="bag-total">~${total.toFixed(2)}</span>}
        <div className="bag-actions">
          <button onClick={handleExport} className="copy-btn">📋 Copy</button>
          <button onClick={() => dispatch(clearBag())} className="clear-btn">Clear</button>
        </div>
      </div>
      <ul className="bag-items">
        {priced.map((p, i) => (
          <li key={i}>
            <span className="bag-item-name">{p.ingredient.name}</span>
            {p.loading && <span className="bag-price">…</span>}
            {p.product?.price && <span className="bag-price">${p.product.price.regular.toFixed(2)}</span>}
            <button onClick={() => dispatch(removeFromBag(p.ingredient.name))} className="remove-item">×</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
