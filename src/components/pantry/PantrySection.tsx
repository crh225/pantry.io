import React, { useState, useMemo, useEffect } from 'react';
import { PantryItem as PantryItemType } from '../../types';
import { PantryItem } from './PantryItem';
import './PantrySection.css';

interface Props { label: string; items: PantryItemType[]; onRemove: (id: string) => void; onEdit: (item: PantryItemType) => void; }

export const PantrySection: React.FC<Props> = ({ label, items, onRemove, onEdit }) => {
  const [sortByExpiry, setSortByExpiry] = useState(false);
  const hasExpiry = items.some(i => i.expiresAt);
  useEffect(() => { if (!hasExpiry && sortByExpiry) setSortByExpiry(false); }, [hasExpiry, sortByExpiry]);
  const sorted = useMemo(() => {
    if (!sortByExpiry) return items;
    return [...items].sort((a, b) => {
      if (!a.expiresAt && !b.expiresAt) return 0;
      if (!a.expiresAt) return 1; if (!b.expiresAt) return -1;
      return a.expiresAt - b.expiresAt;
    });
  }, [items, sortByExpiry]);
  return (
    <div className="pantry-section">
      <div className="section-header">
        <span className="section-label">{label}</span>
        {hasExpiry && (
          <button className={`sort-expiry-btn${sortByExpiry ? ' active' : ''}`} onClick={() => setSortByExpiry(v => !v)} title="Sort by expiration date">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
          </button>
        )}
        <span className="section-count">{items.length}</span>
      </div>
      <div className="section-items">
        {sorted.length > 0 ? sorted.map(item => <PantryItem key={item.id} item={item} onRemove={onRemove} onEdit={onEdit} />) : <p className="section-empty">No items yet</p>}
      </div>
    </div>
  );
};
