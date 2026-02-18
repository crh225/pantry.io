import React, { useMemo, useState, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { removeItem, updateItem } from '../../store/slices/pantrySlice';
import { PantryItem as PantryItemType } from '../../types';
import { PantrySection } from './PantrySection';
import { EditItemModal } from './EditItemModal';
import './PantryList.css';

const sections = [
  { key: 'fridge' as const, label: '❄️ Fridge' },
  { key: 'pantry' as const, label: '🏺 Pantry' },
  { key: 'freezer' as const, label: '🧊 Freezer' },
];

export const PantryList: React.FC = () => {
  const { items } = useAppSelector(state => state.pantry);
  const dispatch = useAppDispatch();
  const [filter, setFilter] = useState('');
  const [editing, setEditing] = useState<PantryItemType | null>(null);

  const filtered = useMemo(() => {
    const q = filter.toLowerCase();
    return q ? items.filter(i => i.name.toLowerCase().includes(q)) : items;
  }, [items, filter]);

  const grouped = useMemo(() => {
    const map: Record<string, typeof items> = {};
    sections.forEach(s => { map[s.key] = []; });
    filtered.forEach(i => { (map[i.location] || (map[i.location] = [])).push(i); });
    return map;
  }, [filtered]);

  const handleRemove = useCallback((id: string) => dispatch(removeItem(id)), [dispatch]);
  const handleEdit = useCallback((item: PantryItemType) => setEditing(item), []);
  const handleSave = (updated: PantryItemType) => {
    dispatch(updateItem(updated));
    setEditing(null);
  };

  if (items.length === 0) {
    return <div className="empty-pantry">Your pantry is empty. Add some items to get started!</div>;
  }

  return (
    <div className="pantry-list">
      <div className="pantry-list-header">
        <span className="pantry-summary">{items.length} item{items.length !== 1 ? 's' : ''}</span>
        {items.length > 10 && (
          <input className="pantry-search" placeholder="Search items..." value={filter}
            onChange={e => setFilter(e.target.value)} />
        )}
      </div>
      <div className="pantry-columns">
        {sections.map(s => (
          <PantrySection key={s.key} label={s.label} items={grouped[s.key] || []}
            onRemove={handleRemove}
            onEdit={handleEdit} />
        ))}
      </div>
      {editing && (
        <EditItemModal item={editing} onSave={handleSave} onClose={() => setEditing(null)} />
      )}
    </div>
  );
};
