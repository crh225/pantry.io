import React from 'react';

interface Props {
  sentItems: string[];
  addedToPantry: boolean;
  onAddToPantry: () => void;
  onDismiss: () => void;
}

export const CartSuccessBanner: React.FC<Props> = ({ sentItems, addedToPantry, onAddToPantry, onDismiss }) => (
  <div className="cart-success-banner">
    <span>{sentItems.length} item{sentItems.length !== 1 ? 's' : ''} added to your Kroger cart!</span>
    {!addedToPantry
      ? <button className="add-to-pantry-btn" onClick={onAddToPantry}>Add to Pantry</button>
      : <span className="pantry-added">Added to pantry</span>}
    <button className="banner-dismiss" onClick={onDismiss}>×</button>
  </div>
);
