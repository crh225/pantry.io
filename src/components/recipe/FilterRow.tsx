import React from 'react';

interface Item { id: string; label: string; }
interface Props {
  label: string; expanded: boolean; active: string | null;
  onToggle: () => void; items: Item[]; onSelect: (id: string) => void;
}

export const FilterRow: React.FC<Props> = ({ label, expanded, active, onToggle, items, onSelect }) => (
  <div className="filter-row">
    <button className="filter-header" onClick={onToggle}>
      <span className="filter-label">{label}</span>
      {active && <span className="active-value">{items.find(i => i.id === active)?.label}</span>}
      <span className="chevron">{expanded ? '▴' : '▾'}</span>
    </button>
    {expanded && (
      <div className="button-grid">
        {items.map(item => (
          <button key={item.id} className={`grid-btn ${active === item.id ? 'selected' : ''}`}
            onClick={() => onSelect(item.id)}>
            {item.label}
          </button>
        ))}
      </div>
    )}
  </div>
);
