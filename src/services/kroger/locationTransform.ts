import { KrogerStore, KrogerDepartment, KrogerStoreHours } from './types';

const transformHours = (hours: any): KrogerStoreHours | null => {
  if (!hours) return null;
  const result: KrogerStoreHours = {};
  if (hours.open24) result.open24Hours = true;
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
  days.forEach(day => {
    const dh = hours[day];
    if (dh?.open && dh?.close) result[day] = { open: dh.open, close: dh.close };
  });
  return Object.keys(result).length > 0 ? result : null;
};

const transformDepartment = (dept: any): KrogerDepartment => ({
  departmentId: dept.departmentId || '', name: dept.name || '',
  phone: dept.phone || undefined, hours: transformHours(dept.hours) || undefined,
});

export const transformStore = (loc: any): KrogerStore => ({
  locationId: loc.locationId || '', name: loc.name || '',
  address: loc.address?.addressLine1 || '', city: loc.address?.city || '',
  state: loc.address?.state || '', zipCode: loc.address?.zipCode || '',
  phone: loc.phone || '', distance: loc.distance || 0, chain: loc.chain || '',
  departments: (loc.departments || []).map(transformDepartment),
  hours: transformHours(loc.hours),
  geolocation: loc.geolocation ? { latitude: loc.geolocation.latitude, longitude: loc.geolocation.longitude } : null,
});
