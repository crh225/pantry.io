import React, { memo } from 'react';
import { PantryItem as PantryItemType } from '../../types';
import './PantryItem.css';

interface Props {
  item: PantryItemType;
  onRemove: (id: string) => void;
}

export const PantryItem = memo<Props>(({ item, onRemove }) => (
  <div className="pantry-item">
    <div className="item-info">
      <span className="item-name">{item.name}</span>
      {item.quantity && <span className="item-quantity">{item.quantity}</span>}
    </div>
    <button className="remove-btn" onClick={() => onRemove(item.id)} aria-label="Remove">×</button>
  </div>
));

PantryItem.displayName = 'PantryItem';
