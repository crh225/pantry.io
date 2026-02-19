import React, { useState } from 'react';
import { PantryItem } from '../../types';
import { sanitizeInput } from '../../utils/validation';
import { toDateStr, fromDateStr } from './editItemUtils';
import './EditItemModal.css';

interface Props { item: PantryItem; onSave: (updated: PantryItem) => void; onClose: () => void; }

export const EditItemModal: React.FC<Props> = ({ item, onSave, onClose }) => {
  const [name, setName] = useState(item.name);
  const [quantity, setQuantity] = useState(item.quantity);
  const [location, setLocation] = useState(item.location);
  const [expiresAt, setExpiresAt] = useState(toDateStr(item.expiresAt));
  const handleSave = () => {
    if (!name.trim()) return;
    onSave({ ...item, name: sanitizeInput(name), quantity: sanitizeInput(quantity), location, expiresAt: fromDateStr(expiresAt) });
  };
  return (
    <div className="edit-modal-backdrop" onClick={onClose}>
      <div className="edit-modal" onClick={e => e.stopPropagation()}>
        <div className="edit-modal-header"><h3>Edit Item</h3><button className="edit-modal-close" onClick={onClose}>×</button></div>
        <div className="edit-field"><label>Name</label><input type="text" value={name} onChange={e => setName(e.target.value)} maxLength={100} /></div>
        <div className="edit-field"><label>Quantity</label><input type="text" value={quantity} onChange={e => setQuantity(e.target.value)} maxLength={50} /></div>
        <div className="edit-field"><label>Location</label>
          <select value={location} onChange={e => setLocation(e.target.value as any)}>
            <option value="pantry">Pantry</option><option value="fridge">Fridge</option><option value="freezer">Freezer</option>
          </select>
        </div>
        <div className="edit-field"><label>Expires</label>
          <div className="edit-date-row">
            <input type="date" value={expiresAt} onChange={e => setExpiresAt(e.target.value)} />
            {expiresAt && <button className="clear-date-btn" onClick={() => setExpiresAt('')}>Clear</button>}
          </div>
        </div>
        <div className="edit-actions">
          <button className="edit-cancel" onClick={onClose}>Cancel</button>
          <button className="edit-save" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
};
