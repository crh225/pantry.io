import React from 'react';

interface Item { id: string; label: string; emoji?: string; }
interface Props {
  label: string; expanded: boolean; active: string | null;
  onToggle: () => void; items: Item[]; onSelect: (id: string) => void;
}

export const FilterRow: React.FC<Props> = ({ label, expanded, active, onToggle, items, onSelect }) => (
  <div className="filter-row">
    <button className="filter-header" onClick={onToggle}>
      <span>{label}</span>
      {active && <span className="active-chip">{items.find(i => i.id === active)?.label}</span>}
      <span className="chevron">{expanded ? '▴' : '▾'}</span>
    </button>
    {expanded && (
      <div className="chip-grid">
        {items.map(item => (
          <button key={item.id} className={`chip ${active === item.id ? 'selected' : ''}`}
            onClick={() => onSelect(item.id)}>
            {item.emoji && <span className="chip-emoji">{item.emoji}</span>}
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    )}
  </div>
);
