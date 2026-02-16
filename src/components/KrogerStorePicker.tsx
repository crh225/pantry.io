import React, { useState } from 'react';
import { kroger, KrogerStore } from '../services/kroger';
import './KrogerStorePicker.css';

interface Props {
  onSelect: (store: KrogerStore) => void;
  selectedStore?: KrogerStore | null;
  onClear?: () => void;
}

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

  // Show selected store
  if (selectedStore && !isChanging) {
    return (
      <div className="store-picker selected">
        <div className="selected-store">
          <span className="store-icon">📍</span>
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
      <h3>📍 Select Your Kroger</h3>
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
