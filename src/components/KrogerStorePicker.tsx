import React, { useState } from 'react';
import { kroger, KrogerStore } from '../services/kroger';
import './KrogerStorePicker.css';

interface Props {
  onSelect: (store: KrogerStore) => void;
  selectedStore?: KrogerStore | null;
  onClear?: () => void;
}

const PinIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export const KrogerStorePicker: React.FC<Props> = ({ onSelect, selectedStore, onClear }) => {
  const [zip, setZip] = useState('');
  const [stores, setStores] = useState<KrogerStore[]>([]);
  const [loading, setLoading] = useState(false);
  const [isChanging, setIsChanging] = useState(false);

  if (!kroger.isConfigured()) return null;

  const handleSearch = async () => {
    if (zip.length < 5) return;
    setLoading(true);
    const results = await kroger.searchStores(zip);
    setStores(results);
    setLoading(false);
  };

  const handleSelect = (store: KrogerStore) => {
    onSelect(store);
    setIsChanging(false);
    setStores([]);
    setZip('');
  };

  if (selectedStore && !isChanging) {
    return (
      <div className="store-picker selected">
        <div className="selected-store">
          <span className="store-icon"><PinIcon size={20} /></span>
          <div className="store-info">
            <strong>{selectedStore.name}</strong>
            <span>{selectedStore.address}</span>
          </div>
          <button className="change-store-btn" onClick={() => setIsChanging(true)}>Change</button>
        </div>
      </div>
    );
  }

  return (
    <div className="store-picker">
      <h3><PinIcon size={16} /> Select Your Kroger</h3>
      <p className="store-hint">Find local prices and availability</p>
      <div className="store-search">
        <input value={zip} onChange={e => setZip(e.target.value)} placeholder="ZIP code"
          maxLength={5} onKeyDown={e => e.key === 'Enter' && handleSearch()} />
        <button onClick={handleSearch} disabled={loading}>{loading ? '...' : 'Find'}</button>
        {isChanging && <button className="cancel-btn" onClick={() => setIsChanging(false)}>Cancel</button>}
      </div>
      {stores.map(s => (
        <button key={s.locationId} className="store-option" onClick={() => handleSelect(s)}>
          <strong>{s.name}</strong>
          <span>{s.address}</span>
        </button>
      ))}
    </div>
  );
};
