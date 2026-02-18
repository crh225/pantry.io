import { KrogerConfig, KrogerStore, KrogerDepartment, KrogerStoreHours } from './types';
import { krogerFetch } from './proxy';

const transformHours = (hours: any): KrogerStoreHours | null => {
  if (!hours) return null;
  const result: KrogerStoreHours = {};
  if (hours.open24) result.open24Hours = true;
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
  days.forEach(day => {
    const dayHours = hours[day];
    if (dayHours?.open && dayHours?.close) {
      result[day] = { open: dayHours.open, close: dayHours.close };
    }
  });
  return Object.keys(result).length > 0 ? result : null;
};

const transformDepartment = (dept: any): KrogerDepartment => ({
  departmentId: dept.departmentId || '',
  name: dept.name || '',
  phone: dept.phone || undefined,
  hours: transformHours(dept.hours) || undefined,
});

const transformStore = (loc: any): KrogerStore => ({
  locationId: loc.locationId || '',
  name: loc.name || '',
  address: loc.address?.addressLine1 || '',
  city: loc.address?.city || '',
  state: loc.address?.state || '',
  zipCode: loc.address?.zipCode || '',
  phone: loc.phone || '',
  distance: loc.distance || 0,
  chain: loc.chain || '',
  departments: (loc.departments || []).map(transformDepartment),
  hours: transformHours(loc.hours),
  geolocation: loc.geolocation ? {
    latitude: loc.geolocation.latitude,
    longitude: loc.geolocation.longitude,
  } : null,
});

export const krogerLocationApi = {
  /** Search stores by ZIP code */
  searchByZip: async (zip: string, config: KrogerConfig): Promise<KrogerStore[]> => {
    const path = `/v1/locations?filter.zipCode.near=${zip}&filter.limit=10`;
    const data = await krogerFetch(path);
    return (data?.data || []).map(transformStore);
  },

  /** Search stores by lat/lng coordinates */
  searchByLatLng: async (lat: number, lng: number, radiusMiles: number = 10): Promise<KrogerStore[]> => {
    const path = `/v1/locations?filter.lat.near=${lat}&filter.lon.near=${lng}&filter.radiusInMiles=${radiusMiles}&filter.limit=10`;
    const data = await krogerFetch(path);
    return (data?.data || []).map(transformStore);
  },

  /** Get a specific store by location ID */
  getStore: async (locationId: string): Promise<KrogerStore | null> => {
    const path = `/v1/locations/${locationId}`;
    const data = await krogerFetch(path);
    if (!data?.data) return null;
    return transformStore(data.data);
  },

  /** Get available store chains (Kroger, Ralphs, Fred Meyer, etc.) */
  getChains: async (): Promise<{ name: string; divisionNumber: string }[]> => {
    const path = '/v1/chains';
    const data = await krogerFetch(path);
    return (data?.data || []).map((c: any) => ({
      name: c.name || '',
      divisionNumber: c.divisionNumber || '',
    }));
  },
};
