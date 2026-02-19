import React from 'react';

interface Props {
  needToBuyCount: number;
  addedToBag: boolean;
  added: boolean;
  onAddMissing: () => void;
  onTogglePicker: () => void;
}

export const RecipeActions: React.FC<Props> = ({ needToBuyCount, addedToBag, added, onAddMissing, onTogglePicker }) => (
  <div className="detail-actions">
    {needToBuyCount > 0 && (
      <button className="add-bag-btn" onClick={onAddMissing}>
        {addedToBag ? '\u2713 Added!' : `+ Add ${needToBuyCount} Missing`}
      </button>
    )}
    <button className="add-night-btn" onClick={onTogglePicker}>
      {added ? '\u2713 Added!' : '+ Add to Meal'}
    </button>
  </div>
);
