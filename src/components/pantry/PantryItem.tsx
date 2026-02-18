import React, { memo } from 'react';
import { PantryItem as PantryItemType } from '../../types';
import './PantryItem.css';

interface Props {
  item: PantryItemType;
  onRemove: (id: string) => void;
  onEdit: (item: PantryItemType) => void;
}

const getExpiryStatus = (expiresAt?: number): 'expired' | 'soon' | 'fresh' | 'none' => {
  if (!expiresAt) return 'none';
  const daysLeft = (expiresAt - Date.now()) / 86_400_000;
  if (daysLeft <= 0) return 'expired';
  if (daysLeft <= 5) return 'soon';
  return 'fresh';
};

const formatExpiry = (expiresAt?: number): string | null => {
  if (!expiresAt) return null;
  const daysLeft = Math.ceil((expiresAt - Date.now()) / 86_400_000);
  if (daysLeft < 0) return `${Math.abs(daysLeft)}d ago`;
  if (daysLeft === 0) return 'today';
  if (daysLeft === 1) return '1d left';
  if (daysLeft <= 30) return `${daysLeft}d left`;
  const months = Math.round(daysLeft / 30);
  return `${months}mo left`;
};

export const PantryItem = memo<Props>(({ item, onRemove, onEdit }) => {
  const status = getExpiryStatus(item.expiresAt);
  const expiryLabel = formatExpiry(item.expiresAt);

  return (
    <span className={`pantry-chip expiry-${status}`}>
      <span className="chip-body" onClick={() => onEdit(item)}>
        <span className="chip-name">{item.name}</span>
        {item.quantity && <span className="chip-qty">{item.quantity}</span>}
        {expiryLabel && <span className={`chip-expiry expiry-text-${status}`}>{expiryLabel}</span>}
      </span>
      <button className="chip-remove" onClick={() => onRemove(item.id)} aria-label="Remove">×</button>
    </span>
  );
});

PantryItem.displayName = 'PantryItem';
