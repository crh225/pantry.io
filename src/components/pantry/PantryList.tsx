import React from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { removeItem } from '../../store/slices/pantrySlice';
import { PantryItem } from './PantryItem';
import './PantryList.css';

export const PantryList: React.FC = () => {
  const { items } = useAppSelector(state => state.pantry);
  const dispatch = useAppDispatch();

  const handleRemove = (id: string) => {
    dispatch(removeItem(id));
  };

  if (items.length === 0) {
    return (
      <div className="empty-pantry">
        Your pantry is empty. Add some items to get started!
      </div>
    );
  }

  return (
    <div className="pantry-list">
      {items.map(item => (
        <PantryItem 
          key={item.id} 
          item={item} 
          onRemove={handleRemove}
        />
      ))}
    </div>
  );
};
