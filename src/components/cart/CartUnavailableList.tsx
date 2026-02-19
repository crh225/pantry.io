import React from 'react';
import { PricedItem } from '../../hooks/useKrogerPrices';

export const CartUnavailableList: React.FC<{ items: PricedItem[] }> = ({ items }) => {
  if (items.length === 0) return null;
  return (
    <div className="review-section review-unavailable">
      <h3>Not Available ({items.length})</h3>
      <ul className="review-items">
        {items.map(p => (
          <li key={`u-${p.ingredient.name}`} className="review-item disabled">
            <span className="review-check" />
            <div className="review-item-info">
              <span className="review-item-name">{p.ingredient.name}</span>
              <span className="review-item-match">{p.product?.description ?? 'No match found'}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
