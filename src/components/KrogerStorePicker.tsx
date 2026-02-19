import React, { useState } from 'react';
import { kroger, KrogerStore } from '../services/kroger';
import { SelectedStore } from './SelectedStore';
import { StoreSearchForm } from './StoreSearchForm';
import './KrogerStorePicker.css';

interface Props {
  onSelect: (store: KrogerStore) => void;
  selectedStore?: KrogerStore | null;
  onClear?: () => void;
}

const formatDistance = (miles: number) => miles < 0.1 ? 'Nearby' : `${miles.toFixed(1)} mi`;

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
    setLoading(true); setError('');
    try { const r = await kroger.searchStores(zip); setStores(r); if (!r.length) setError('No stores found for this ZIP code'); }
    catch { setError('Failed to search stores'); }
    setLoading(false);
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) { setError('Geolocation is not supported by your browser'); return; }
    setGeoLoading(true); setError('');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try { const r = await kroger.searchStoresByLocation(pos.coords.latitude, pos.coords.longitude, 15); setStores(r); if (!r.length) setError('No stores found nearby'); }
        catch { setError('Failed to search stores'); }
        setGeoLoading(false);
      },
      () => { setError('Unable to get your location'); setGeoLoading(false); }
    );
  };

  const handleSelect = (store: KrogerStore) => { onSelect(store); setIsChanging(false); setStores([]); setZip(''); };

  if (selectedStore && !isChanging) return <SelectedStore store={selectedStore} onChangeStore={() => setIsChanging(true)} />;

  return <StoreSearchForm zip={zip} onZipChange={setZip} loading={loading} geoLoading={geoLoading}
    error={error} stores={stores} onSearch={handleSearch} onUseLocation={handleUseLocation}
    onSelect={handleSelect} formatDistance={formatDistance} />;
};
