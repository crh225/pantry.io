import React from 'react';

interface Item { name: string; defaultQuantity: string; }
interface Props {
  title: string;
  items: Item[];
  selected: Set<string>;
  onToggle: (name: string) => void;
}

export const QuickAddSection: React.FC<Props> = ({ title, items, selected, onToggle }) => (
  <div className="quick-add-section">
    <h3>{title}</h3>
    <div className="items-grid">
      {items.map(item => (
        <label key={item.name} className="item-checkbox">
          <input type="checkbox" checked={selected.has(item.name)} onChange={() => onToggle(item.name)} />
          <span>{item.name}</span>
        </label>
      ))}
    </div>
  </div>
);
