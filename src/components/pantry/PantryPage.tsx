import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { removeItem } from '../../store/slices/pantrySlice';
import { PantryItem } from './PantryItem';
import { PantrySearch } from './PantrySearch';
import './PantryPage.css';

export const PantryPage: React.FC = () => {
  const { items } = useAppSelector(state => state.pantry);
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = searchTerm
    ? items.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : items;

  return (
    <div className="pantry-page">
      <h1>My Pantry</h1>
      <PantrySearch value={searchTerm} onChange={setSearchTerm} />
      <div className="pantry-items">
        {filteredItems.map(item => (
          <PantryItem key={item.id} item={item} onRemove={id => dispatch(removeItem(id))} />
        ))}
      </div>
    </div>
  );
};