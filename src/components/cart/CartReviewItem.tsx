import React from 'react';
import { PricedItem } from '../../hooks/useKrogerPrices';
import { KrogerProduct } from '../../services/kroger';
import { ProductAlternatives } from '../kroger/ProductAlternatives';

interface Props {
  item: PricedItem;
  idx: number;
  selected: boolean;
  qty: number;
  inPantry: boolean;
  onToggle: () => void;
  onSetQty: (q: number) => void;
  onSelectAlt: (alt: KrogerProduct) => void;
}

export const CartReviewItem: React.FC<Props> = ({
  item, idx, selected, qty, inPantry, onToggle, onSetQty, onSelectAlt,
}) => {
  const p = item.product!;
  return (
    <li className={`review-item${selected ? ' selected' : ''}`}>
      <div className="review-item-main" onClick={onToggle}>
        <span className="review-check">{selected ? '\u2713' : ''}</span>
        {p.image && <img src={p.image} alt="" className="review-thumb" />}
        <div className="review-item-info">
          <span className="review-item-name">
            {item.ingredient.name}
            {inPantry && <span className="pantry-flag">In Pantry</span>}
          </span>
          <span className="review-item-match">{p.description}</span>
          {p.size && <span className="review-item-size">{p.size}</span>}
        </div>
        <div className="review-item-price">
          {p.price!.promo ? (
            <>
              <span className="review-price-original">${(p.price!.regular * qty).toFixed(2)}</span>
              <span className="review-price sale">${(p.price!.promo * qty).toFixed(2)}</span>
              <span className="review-sale-badge">Save {Math.round((1 - p.price!.promo / p.price!.regular) * 100)}%</span>
            </>
          ) : (
            <span className="review-price">${(p.price!.regular * qty).toFixed(2)}</span>
          )}
        </div>
      </div>
      <div className="review-item-controls">
        <ProductAlternatives ingredientName={item.ingredient.name} currentProduct={p} onSelectAlternative={onSelectAlt} />
        <div className="qty-control" onClick={e => e.stopPropagation()}>
          <button className="qty-btn" onClick={() => onSetQty(qty - 1)} disabled={qty <= 1}>-</button>
          <span className="qty-value">{qty}</span>
          <button className="qty-btn" onClick={() => onSetQty(qty + 1)}>+</button>
        </div>
      </div>
    </li>
  );
};
