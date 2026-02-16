import React, { memo } from 'react';
import { PantryItem as PantryItemType } from '../../types';
import './PantryItem.css';

interface PantryItemProps {
  item: PantryItemType;
  onRemove: (id: string) => void;
}

export const PantryItem = memo<PantryItemProps>(({ item, onRemove }) => {
  const locationLabels = {
    pantry: '🏺 Pantry',
    fridge: '❄️ Fridge',
    freezer: '🧊 Freezer',
  };

  return (
    <div className="pantry-item">
      <div className="item-info">
        <h4 className="item-name">{item.name}</h4>
        <span className="item-quantity">{item.quantity}</span>
        <span className="item-location">{locationLabels[item.location]}</span>
      </div>
      <button 
        className="remove-btn" 
        onClick={() => onRemove(item.id)}
        aria-label="Remove item"
      >
        ×
      </button>
    </div>
  );
});

PantryItem.displayName = 'PantryItem';
