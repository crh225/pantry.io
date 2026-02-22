import React, { useState } from 'react';

interface Item { name: string; defaultQuantity: string; }
interface Props {
  title: string; items: Item[];
  selected: Set<string>; onToggle: (name: string) => void;
  onSelectAll: () => void;
}

export const QuickAddSection: React.FC<Props> = ({ title, items, selected, onToggle, onSelectAll }) => {
  const [collapsed, setCollapsed] = useState(false);
  const allSelected = items.every(i => selected.has(i.name));
  const count = items.filter(i => selected.has(i.name)).length;
  const handleSelectAll = () => { onSelectAll(); setCollapsed(true); };
  return (
    <div className="quick-add-section">
      <div className="section-title-row" onClick={() => setCollapsed(!collapsed)} style={{ cursor: 'pointer' }}>
        <h3>
          {title}
          {allSelected && <span className="section-all-badge">All selected</span>}
          {!allSelected && count > 0 && <span className="section-count-badge">{count} selected</span>}
        </h3>
        <div className="section-title-actions">
          <button className="select-all-btn" onClick={e => { e.stopPropagation(); handleSelectAll(); }} type="button">
            {allSelected ? 'Deselect All' : 'Select All'}
          </button>
          <span className={`section-chevron${collapsed ? '' : ' open'}`}>▾</span>
        </div>
      </div>
      {!collapsed && (
        <div className="items-grid">
          {items.map(item => (
            <label key={item.name} className="item-checkbox">
              <input type="checkbox" checked={selected.has(item.name)} onChange={() => onToggle(item.name)} />
              <span>{item.name}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};
