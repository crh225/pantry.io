import React, { useState } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { addItem } from '../../store/slices/pantrySlice';
import { sanitizeInput, validatePantryItem } from '../../utils/validation';
import './AddPantryItem.css';

export const AddPantryItem: React.FC = () => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [location, setLocation] = useState<'pantry' | 'fridge' | 'freezer'>('pantry');
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const err = validatePantryItem(name, quantity);
    if (err) { setError(err); return; }
    dispatch(addItem({ name: sanitizeInput(name), quantity: sanitizeInput(quantity), location }));
    setName(''); setQuantity('');
  };

  return (
    <form className="add-pantry-form" onSubmit={handleSubmit}>
      {error && <div className="error-message">{error}</div>}
      <input type="text" value={name} onChange={e => setName(e.target.value)}
        placeholder="Item name" className="pantry-input" maxLength={100} />
      <input type="text" value={quantity} onChange={e => setQuantity(e.target.value)}
        placeholder="Quantity" className="pantry-input" maxLength={50} />
      <select value={location} onChange={e => setLocation(e.target.value as any)} className="pantry-select">
        <option value="pantry">Pantry</option>
        <option value="fridge">Fridge</option>
        <option value="freezer">Freezer</option>
      </select>
      <button type="submit" className="add-btn">Add</button>
    </form>
  );
};
