import React from 'react';
import { PantryItem as PantryItemType } from '../../types';
import './PantryItem.css';

interface Props {
  item: PantryItemType;
  onRemove: (id: string) => void;
}

export const PantryItem: React.FC<Props> = ({ item, onRemove }) => {
  return (
    <div className="pantry-item">
      <span className="item-name">{item.name}</span>
      {item.quantity && <span className="item-quantity">{item.quantity}</span>}
      <button className="remove-btn" onClick={() => onRemove(item.id)} aria-label="Remove">×</button>
    </div>
  );
};