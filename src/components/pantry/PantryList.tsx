import React, { useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { removeItem } from '../../store/slices/pantrySlice';
import { PantrySection } from './PantrySection';
import './PantryList.css';

const sections = [
  { key: 'fridge' as const, label: '❄️ Fridge', emoji: '❄️' },
  { key: 'pantry' as const, label: '🏺 Pantry', emoji: '🏺' },
  { key: 'freezer' as const, label: '🧊 Freezer', emoji: '🧊' },
];

export const PantryList: React.FC = () => {
  const { items } = useAppSelector(state => state.pantry);
  const dispatch = useAppDispatch();

  const grouped = useMemo(() => {
    const map: Record<string, typeof items> = {};
    sections.forEach(s => { map[s.key] = []; });
    items.forEach(i => { (map[i.location] || (map[i.location] = [])).push(i); });
    return map;
  }, [items]);

  if (items.length === 0) {
    return <div className="empty-pantry">Your pantry is empty. Add some items to get started!</div>;
  }

  return (
    <div className="pantry-list">
      <div className="pantry-summary">{items.length} item{items.length !== 1 ? 's' : ''} total</div>
      {sections.map(s => grouped[s.key]?.length > 0 && (
        <PantrySection key={s.key} label={s.label} items={grouped[s.key]}
          onRemove={id => dispatch(removeItem(id))} />
      ))}
    </div>
  );
};
