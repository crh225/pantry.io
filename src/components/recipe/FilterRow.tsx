import React, { useEffect, useRef } from 'react';

declare const twemoji: { parse: (element: HTMLElement, options?: { folder: string; ext: string }) => void } | undefined;

interface Item { id: string; label: string; emoji?: string; }
interface Props {
  label: string; expanded: boolean; active: string | null;
  onToggle: () => void; items: Item[]; onSelect: (id: string) => void;
}

export const FilterRow: React.FC<Props> = ({ label, expanded, active, onToggle, items, onSelect }) => {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (expanded && gridRef.current && typeof twemoji !== 'undefined' && twemoji) {
      twemoji.parse(gridRef.current, { folder: 'svg', ext: '.svg' });
    }
  }, [expanded, items]);

  return (
    <div className="filter-row">
      <button className="filter-header" onClick={onToggle}>
        <span>{label}</span>
        {active && <span className="active-chip">{items.find(i => i.id === active)?.label}</span>}
        <span className="chevron">{expanded ? '▴' : '▾'}</span>
      </button>
      {expanded && (
        <div className="chip-grid" ref={gridRef}>
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
};
