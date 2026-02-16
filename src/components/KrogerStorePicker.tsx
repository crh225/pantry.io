import React, { useState } from 'react';
import { kroger, KrogerStore } from '../services/kroger';
import './KrogerStorePicker.css';

interface Props { onSelect: (storeId: string) => void; }

export const KrogerStorePicker: React.FC<Props> = ({ onSelect }) => {
  const [zip, setZip] = useState('');
  const [stores, setStores] = useState<KrogerStore[]>([]);
  const [loading, setLoading] = useState(false);

  if (!kroger.isConfigured()) return null;

  const handleSearch = async () => {
    if (zip.length < 5) return;
    setLoading(true);
    const results = await kroger.searchStores(zip);
    setStores(results);
    setLoading(false);
  };

  return (
    <div className="store-picker">
      <h3>📍 Select Your Kroger</h3>
      <div className="store-search">
        <input value={zip} onChange={e => setZip(e.target.value)} placeholder="ZIP code"
          maxLength={5} onKeyDown={e => e.key === 'Enter' && handleSearch()} />
        <button onClick={handleSearch} disabled={loading}>{loading ? '...' : 'Find'}</button>
      </div>
      {stores.map(s => (
        <button key={s.locationId} className="store-option" onClick={() => onSelect(s.locationId)}>
          <strong>{s.name}</strong>
          <span>{s.address}</span>
        </button>
      ))}
    </div>
  );
};
