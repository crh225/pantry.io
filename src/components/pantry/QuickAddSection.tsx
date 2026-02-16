import React from 'react';

interface Item { name: string; defaultQuantity: string; }
interface Props {
  title: string; items: Item[];
  selected: Set<string>; onToggle: (name: string) => void;
  onSelectAll: () => void;
}

export const QuickAddSection: React.FC<Props> = ({ title, items, selected, onToggle, onSelectAll }) => (
  <div className="quick-add-section">
    <div className="section-title-row">
      <h3>{title}</h3>
      <button className="select-all-btn" onClick={onSelectAll} type="button">Select All</button>
    </div>
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
