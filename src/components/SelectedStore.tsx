import React from 'react';
import { KrogerStore } from '../services/kroger';

const PinIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

interface Props {
  store: KrogerStore;
  onChangeStore: () => void;
}

export const SelectedStore: React.FC<Props> = ({ store, onChangeStore }) => (
  <div className="store-picker selected">
    <div className="selected-store">
      <span className="store-icon"><PinIcon size={20} /></span>
      <div className="store-info">
        <strong>{store.name}</strong>
        <span>{store.address}, {store.city} {store.state}</span>
        {store.phone && <span className="store-phone">{store.phone}</span>}
      </div>
      <button className="change-store-btn" onClick={onChangeStore}>Change</button>
    </div>
  </div>
);
