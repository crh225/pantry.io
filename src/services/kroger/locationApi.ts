import { KrogerConfig, KrogerStore } from './types';
import { getToken } from './auth';

const BASE = 'https://api.kroger.com/v1';

export const krogerLocationApi = {
  searchByZip: async (zip: string, config: KrogerConfig): Promise<KrogerStore[]> => {
    const token = await getToken(config);
    const res = await fetch(`${BASE}/locations?filter.zipCode.near=${zip}&filter.limit=5`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.data || []).map((loc: any) => ({
      locationId: loc.locationId,
      name: loc.name,
      address: `${loc.address?.addressLine1}, ${loc.address?.city} ${loc.address?.state}`,
      distance: loc.distance || 0,
    }));
  },
};
