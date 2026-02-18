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

const LocationIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="3 11 22 2 13 21 11 13 3 11" />
  </svg>
);

export const KrogerStorePicker: React.FC<Props> = ({ onSelect, selectedStore, onClear }) => {
  const [zip, setZip] = useState('');
  const [stores, setStores] = useState<KrogerStore[]>([]);
  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [error, setError] = useState('');

  if (!kroger.isConfigured()) return null;

  const handleSearch = async () => {
    if (zip.length < 5) return;
    setLoading(true);
    setError('');
    try {
      const results = await kroger.searchStores(zip);
      setStores(results);
      if (results.length === 0) setError('No stores found for this ZIP code');
    } catch {
      setError('Failed to search stores');
    }
    setLoading(false);
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setGeoLoading(true);
    setError('');
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const results = await kroger.searchStoresByLocation(
            position.coords.latitude,
            position.coords.longitude,
            15
          );
          setStores(results);
          if (results.length === 0) setError('No stores found nearby');
        } catch {
          setError('Failed to search stores');
        }
        setGeoLoading(false);
      },
      () => {
        setError('Unable to get your location');
        setGeoLoading(false);
      }
    );
  };

  const handleSelect = (store: KrogerStore) => {
    onSelect(store);
    setIsChanging(false);
    setStores([]);
    setZip('');
  };

  const formatDistance = (miles: number) => {
    if (miles < 0.1) return 'Nearby';
    return `${miles.toFixed(1)} mi`;
  };

  if (selectedStore && !isChanging) {
    return (
      <div className="store-picker selected">
        <div className="selected-store">
          <span className="store-icon"><PinIcon size={20} /></span>
          <div className="store-info">
            <strong>{selectedStore.name}</strong>
            <span>{selectedStore.address}, {selectedStore.city} {selectedStore.state}</span>
            {selectedStore.phone && <span className="store-phone">{selectedStore.phone}</span>}
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
        <button onClick={handleSearch} disabled={loading || geoLoading}>
          {loading ? '...' : 'Find'}
        </button>
        <button
          className="location-btn"
          onClick={handleUseLocation}
          disabled={loading || geoLoading}
          title="Use my location"
        >
          {geoLoading ? '...' : <LocationIcon />}
        </button>

      </div>
      {error && <p className="store-error">{error}</p>}
      {stores.map(s => (
        <button key={s.locationId} className="store-option" onClick={() => handleSelect(s)}>
          <div className="store-option-main">
            <strong>{s.name}</strong>
            {s.chain && s.chain !== s.name && <span className="store-chain">{s.chain}</span>}
          </div>
          <span className="store-address">{s.address}, {s.city}</span>
          <div className="store-meta">
            {s.distance > 0 && <span className="store-distance">{formatDistance(s.distance)}</span>}
            {s.phone && <span className="store-phone">{s.phone}</span>}
          </div>
        </button>
      ))}
    </div>
  );
};
