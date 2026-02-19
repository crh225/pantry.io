import React from 'react';
import { KrogerProduct } from '../../services/kroger';

interface Props {
  alt: KrogerProduct;
  onSelect: () => void;
}

export const AlternativeItem: React.FC<Props> = ({ alt, onSelect }) => (
  <button className="alternative-item" onClick={(e) => { e.stopPropagation(); onSelect(); }}>
    {alt.image && <img src={alt.image} alt="" className="alt-thumb" />}
    <div className="alt-info">
      <span className="alt-description">{alt.description}</span>
      {alt.size && <span className="alt-size">{alt.size}</span>}
    </div>
    <div className="alt-price">
      <span>${alt.price?.regular.toFixed(2)}</span>
      {alt.price?.promo && <span className="alt-promo">Sale ${alt.price.promo.toFixed(2)}</span>}
    </div>
  </button>
);
