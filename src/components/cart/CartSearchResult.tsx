import React from 'react';
import { KrogerProduct } from '../../services/kroger';

interface Props {
  product: KrogerProduct;
  qty: number;
  added: boolean;
  onSetQty: (q: number) => void;
  onAdd: () => void;
}

export const CartSearchResult: React.FC<Props> = ({ product: p, qty, added, onSetQty, onAdd }) => (
  <li className="search-result-item">
    {p.image && <img src={p.image} alt="" className="search-result-img" />}
    <div className="search-result-info">
      <span className="search-result-name">{p.description}</span>
      {p.size && <span className="search-result-size">{p.size}</span>}
    </div>
    {p.price && (
      <div className="search-result-price">
        {p.price.promo ? (
          <><span className="search-price-original">${p.price.regular.toFixed(2)}</span>
          <span className="search-price-sale">${p.price.promo.toFixed(2)}</span></>
        ) : <span>${p.price.regular.toFixed(2)}</span>}
      </div>
    )}
    <div className="search-qty-control">
      <button className="qty-btn" onClick={() => onSetQty(qty - 1)} disabled={qty <= 1 || added}>-</button>
      <span className="qty-value">{qty}</span>
      <button className="qty-btn" onClick={() => onSetQty(qty + 1)} disabled={added}>+</button>
    </div>
    <button className="search-add-btn" onClick={onAdd} disabled={added || !p.price}>
      {added ? 'Added' : 'Add'}
    </button>
  </li>
);
