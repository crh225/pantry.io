import { KrogerConfig, KrogerStore } from './types';
import { krogerFetch } from './proxy';
import { transformStore } from './locationTransform';

export const krogerLocationApi = {
  searchByZip: async (zip: string, config: KrogerConfig): Promise<KrogerStore[]> => {
    const data = await krogerFetch(`/v1/locations?filter.zipCode.near=${zip}&filter.limit=10`);
    return (data?.data || []).map(transformStore);
  },
  searchByLatLng: async (lat: number, lng: number, radiusMiles: number = 10): Promise<KrogerStore[]> => {
    const data = await krogerFetch(`/v1/locations?filter.lat.near=${lat}&filter.lon.near=${lng}&filter.radiusInMiles=${radiusMiles}&filter.limit=10`);
    return (data?.data || []).map(transformStore);
  },
  getStore: async (locationId: string): Promise<KrogerStore | null> => {
    const data = await krogerFetch(`/v1/locations/${locationId}`);
    return data?.data ? transformStore(data.data) : null;
  },
  getChains: async (): Promise<{ name: string; divisionNumber: string }[]> => {
    const data = await krogerFetch('/v1/chains');
    return (data?.data || []).map((c: any) => ({ name: c.name || '', divisionNumber: c.divisionNumber || '' }));
  },
};
