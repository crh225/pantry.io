import { KrogerConfig, KrogerStore } from './types';
import { krogerFetch } from './proxy';

export const krogerLocationApi = {
  searchByZip: async (zip: string, config: KrogerConfig): Promise<KrogerStore[]> => {
    const path = `/v1/locations?filter.zipCode.near=${zip}&filter.limit=5`;
    const data = await krogerFetch(path);
    return (data?.data || []).map((loc: any) => ({
      locationId: loc.locationId,
      name: loc.name,
      address: `${loc.address?.addressLine1}, ${loc.address?.city} ${loc.address?.state}`,
      distance: loc.distance || 0,
    }));
  },
};
