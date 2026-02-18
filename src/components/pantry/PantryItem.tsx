import React, { memo } from 'react';
import { PantryItem as PantryItemType } from '../../types';
import './PantryItem.css';

interface Props {
  item: PantryItemType;
  onRemove: (id: string) => void;
}

export const PantryItem = memo<Props>(({ item, onRemove }) => (
  <span className="pantry-chip">
    <span className="chip-name">{item.name}</span>
    {item.quantity && <span className="chip-qty">{item.quantity}</span>}
    <button className="chip-remove" onClick={() => onRemove(item.id)} aria-label="Remove">×</button>
  </span>
));

PantryItem.displayName = 'PantryItem';
