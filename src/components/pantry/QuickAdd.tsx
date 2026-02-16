import React, { useState } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { addItem } from '../../store/slices/pantrySlice';
import { commonPantryItems, commonFridgeItems, commonFreezerItems } from '../../data/commonItems';
import { QuickAddSection } from './QuickAddSection';
import './QuickAdd.css';

interface Props { onClose: () => void; }

export const QuickAdd: React.FC<Props> = ({ onClose }) => {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const dispatch = useAppDispatch();

  const toggle = (n: string) => { const s = new Set(selected); s.has(n) ? s.delete(n) : s.add(n); setSelected(s); };
  const selAll = (items: { name: string }[]) => { const s = new Set(selected); items.forEach(i => s.add(i.name)); setSelected(s); };
  const handleAdd = () => {
    const all = [
      ...commonPantryItems.map(i => ({ ...i, location: 'pantry' as const })),
      ...commonFridgeItems.map(i => ({ ...i, location: 'fridge' as const })),
      ...commonFreezerItems.map(i => ({ ...i, location: 'freezer' as const })),
    ];
    all.filter(i => selected.has(i.name)).forEach(i => dispatch(addItem({ name: i.name, quantity: i.defaultQuantity, location: i.location })));
    onClose();
  };

  return (
    <div className="quick-add-modal">
      <div className="quick-add-content">
        <div className="quick-add-header">
          <h2>Quick Add Common Items</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <QuickAddSection title="Pantry" items={commonPantryItems} selected={selected} onToggle={toggle} onSelectAll={() => selAll(commonPantryItems)} />
        <QuickAddSection title="Fridge" items={commonFridgeItems} selected={selected} onToggle={toggle} onSelectAll={() => selAll(commonFridgeItems)} />
        <QuickAddSection title="Freezer" items={commonFreezerItems} selected={selected} onToggle={toggle} onSelectAll={() => selAll(commonFreezerItems)} />
        <div className="quick-add-actions">
          <button onClick={handleAdd} className="add-btn">Add Selected ({selected.size})</button>
          <button onClick={onClose} className="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  );
};
