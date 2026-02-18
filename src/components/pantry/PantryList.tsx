import React, { useMemo, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { removeItem } from '../../store/slices/pantrySlice';
import { PantrySection } from './PantrySection';
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

  if (items.length === 0) {
    return <div className="empty-pantry">Your pantry is empty. Add some items to get started!</div>;
  }

  return (
    <div className="pantry-list">
      <div className="pantry-summary">{items.length} item{items.length !== 1 ? 's' : ''}</div>
      {items.length > 10 && (
        <input className="pantry-search" placeholder="Search items..." value={filter}
          onChange={e => setFilter(e.target.value)} />
      )}
      {sections.map(s => grouped[s.key]?.length > 0 && (
        <PantrySection key={s.key} label={s.label} items={grouped[s.key]}
          onRemove={id => dispatch(removeItem(id))} />
      ))}
    </div>
  );
};
