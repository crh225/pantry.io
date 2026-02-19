import React, { useMemo } from 'react';
import { useAppDispatch } from '../store/hooks';
import { removeFromBag } from '../store/slices/mealPlanSlice';
import { setPendingSend } from '../store/slices/krogerSlice';
import { kroger } from '../services/kroger';
import { Ingredient } from '../types';
import { dedup, cleanName } from '../utils/ingredientUtils';
import { useKrogerPrices } from '../hooks/useKrogerPrices';
import './ShoppingBag.css';

export const ShoppingBag: React.FC<{ bag: Ingredient[] }> = ({ bag }) => {
  const dispatch = useAppDispatch();
  const unique = useMemo(() => dedup(bag), [bag]);
  const { priced, total, available } = useKrogerPrices(unique);
  if (unique.length === 0) return null;
  const handleRemove = (cleanedName: string) => {
    const target = cleanedName.toLowerCase();
    bag.forEach(i => { if (cleanName(i.name).toLowerCase() === target) dispatch(removeFromBag(i.name)); });
  };
  const handleCheckout = () => { dispatch(setPendingSend(true)); window.location.hash = 'cart'; };
  return (
    <div className="shopping-bag">
      <div className="bag-header">
        <h2><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{verticalAlign:'middle',marginRight:4}}><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg> Shopping Bag ({unique.length})</h2>
        {available && total > 0 && <span className="bag-total">~${total.toFixed(2)}</span>}
      </div>
      <ul className="bag-items">
        {priced.map((p, i) => (
          <li key={i}>
            <span className="bag-item-name">{p.ingredient.name}</span>
            {p.loading && <span className="bag-price">&hellip;</span>}
            {p.product?.price && <span className="bag-price">${p.product.price.regular.toFixed(2)}</span>}
            <button onClick={() => handleRemove(p.ingredient.name)} className="remove-item">&times;</button>
          </li>
        ))}
      </ul>
      {kroger.isConfigured() && kroger.isLoggedIn() && (
        <button onClick={handleCheckout} className="kroger-cart-btn">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{verticalAlign:'middle',marginRight:4}}><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          Send to Kroger Cart
        </button>
      )}
    </div>
  );
};
