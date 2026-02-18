import React from 'react';

interface Item { id: string; label: string; }
interface Props {
  label: string; items: Item[]; active: string | null; onSelect: (id: string) => void;
}

export const FilterRow: React.FC<Props> = ({ label, items, active, onSelect }) => (
  <div className="filter-row">
    <span className="filter-row-label">{label}</span>
    <div className="chip-scroll">
      {items.map(item => (
        <button key={item.id}
          className={`filter-chip ${active === item.id ? 'selected' : ''}`}
          onClick={() => onSelect(item.id)}>
          {item.label}
        </button>
      ))}
    </div>
  </div>
);
