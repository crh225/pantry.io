import React, { useState } from 'react';
import { PantryItem as PantryItemType } from '../../types';
import { PantryItem } from './PantryItem';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import './PantrySection.css';

interface Props {
  label: string;
  items: PantryItemType[];
  onRemove: (id: string) => void;
}

export const PantrySection: React.FC<Props> = ({ label, items, onRemove }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="pantry-section">
      <button className="section-header" onClick={() => setCollapsed(!collapsed)}>
        <span className="section-label">{label}</span>
        <span className="section-count">{items.length}</span>
        <span className="section-chevron">{collapsed ? <FaChevronDown /> : <FaChevronUp />}</span>
      </button>
      {!collapsed && (
        <div className="section-items">
          {items.map(item => (
            <PantryItem key={item.id} item={item} onRemove={onRemove} />
          ))}
        </div>
      )}
    </div>
  );
};