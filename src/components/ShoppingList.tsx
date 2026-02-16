import React from 'react';
import './ShoppingList.css';

interface ShoppingListProps {
  items: string[];
  onClose: () => void;
}

export const ShoppingList: React.FC<ShoppingListProps> = ({ items, onClose }) => {
  const handleExport = () => {
    const text = items.join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shopping-list.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(items.join('\n'));
    alert('Shopping list copied to clipboard!');
  };

  return (
    <div className="shopping-list-modal">
      <div className="modal-content">
        <h2>Shopping List</h2>
        <ul className="shopping-items">
          {items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
        <div className="modal-actions">
          <button onClick={handleCopy} className="action-btn">Copy</button>
          <button onClick={handleExport} className="action-btn">Export</button>
          <button onClick={onClose} className="action-btn secondary">Close</button>
        </div>
      </div>
    </div>
  );
};
