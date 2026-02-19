import React from 'react';
import { KrogerStore } from '../services/kroger';

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

interface Props {
  zip: string; onZipChange: (v: string) => void;
  loading: boolean; geoLoading: boolean; error: string;
  stores: KrogerStore[];
  onSearch: () => void; onUseLocation: () => void;
  onSelect: (store: KrogerStore) => void;
  formatDistance: (miles: number) => string;
}

export const StoreSearchForm: React.FC<Props> = ({
  zip, onZipChange, loading, geoLoading, error, stores,
  onSearch, onUseLocation, onSelect, formatDistance,
}) => (
  <div className="store-picker">
    <h3><PinIcon size={16} /> Select Your Kroger</h3>
    <p className="store-hint">Find local prices and availability</p>
    <div className="store-search">
      <input value={zip} onChange={e => onZipChange(e.target.value)} placeholder="ZIP code"
        maxLength={5} onKeyDown={e => e.key === 'Enter' && onSearch()} />
      <button onClick={onSearch} disabled={loading || geoLoading}>{loading ? '...' : 'Find'}</button>
      <button className="location-btn" onClick={onUseLocation} disabled={loading || geoLoading} title="Use my location">
        {geoLoading ? '...' : <LocationIcon />}
      </button>
    </div>
    {error && <p className="store-error">{error}</p>}
    {stores.map(s => (
      <button key={s.locationId} className="store-option" onClick={() => onSelect(s)}>
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
