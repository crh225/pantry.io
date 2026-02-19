import React, { useState } from 'react';

interface SectionProps {
  title: string;
  items: { id: string; label: string }[];
  active: string | null;
  onSelect: (id: string) => void;
  defaultOpen?: boolean;
}

export const FilterSection: React.FC<SectionProps> = ({ title, items, active, onSelect, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="filter-section">
      <button className="filter-section-header" onClick={() => setOpen(!open)}>
        <span>{title}</span>
        <svg className={`filter-chevron ${open ? 'open' : ''}`} width="14" height="14"
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <div className="filter-section-items">
          {items.map(item => (
            <button key={item.id} className={`filter-item ${active === item.id ? 'selected' : ''}`} onClick={() => onSelect(item.id)}>
              {active === item.id && <span className="filter-check">✓</span>}
              {item.label}
            </button>
          ))}
        </div>
      )}
      <div className="filter-section-pills">
        {items.map(item => (
          <button key={item.id} className={`filter-pill ${active === item.id ? 'selected' : ''}`} onClick={() => onSelect(item.id)}>
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};
