import React, { useState } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { addItem } from '../../store/slices/pantrySlice';
import { commonPantryItems, commonFridgeItems, commonFreezerItems } from '../../data/commonItems';
import './QuickAdd.css';

interface QuickAddProps {
  onClose: () => void;
}

export const QuickAdd: React.FC<QuickAddProps> = ({ onClose }) => {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const dispatch = useAppDispatch();

  const toggleItem = (itemName: string) => {
    const newSelected = new Set(selected);
    if (newSelected.has(itemName)) {
      newSelected.delete(itemName);
    } else {
      newSelected.add(itemName);
    }
    setSelected(newSelected);
  };

  const handleAddSelected = () => {
    const allItems = [
      ...commonPantryItems.map(i => ({ ...i, location: 'pantry' as const })),
      ...commonFridgeItems.map(i => ({ ...i, location: 'fridge' as const })),
      ...commonFreezerItems.map(i => ({ ...i, location: 'freezer' as const })),
    ];

    allItems
      .filter(item => selected.has(item.name))
      .forEach(item => {
        dispatch(addItem({
          name: item.name,
          quantity: item.defaultQuantity,
          location: item.location,
        }));
      });

    onClose();
  };

  const renderSection = (title: string, items: typeof commonPantryItems, location: string) => (
    <div className="quick-add-section">
      <h3>{title}</h3>
      <div className="items-grid">
        {items.map(item => (
          <label key={item.name} className="item-checkbox">
            <input
              type="checkbox"
              checked={selected.has(item.name)}
              onChange={() => toggleItem(item.name)}
            />
            <span>{item.name}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="quick-add-modal">
      <div className="quick-add-content">
        <div className="quick-add-header">
          <h2>Quick Add Common Items</h2>
          <p>Select items you already have to quickly populate your pantry</p>
        </div>
        {renderSection('Pantry Items', commonPantryItems, 'pantry')}
        {renderSection('Fridge Items', commonFridgeItems, 'fridge')}
        {renderSection('Freezer Items', commonFreezerItems, 'freezer')}
        <div className="quick-add-actions">
          <button onClick={handleAddSelected} className="add-btn">
            Add Selected ({selected.size})
          </button>
          <button onClick={onClose} className="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  );
};
