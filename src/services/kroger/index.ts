import { KrogerConfig, KrogerStore } from './types';
import { krogerProductApi } from './productApi';
import { krogerLocationApi } from './locationApi';
import { krogerProfileApi } from './profileApi';
import { krogerPost } from './proxy';
import { krogerAuth } from './auth';
import { initStoreService, storeService } from './storeService';

let config: KrogerConfig | null = null;
const searchCache = new Map<string, any>();

export const kroger = {
  configure: (c: KrogerConfig) => { config = c; initStoreService(config); },
  isConfigured: () => config !== null,
  getConfig: () => config,
  getSelectedStore: () => storeService.getSelectedStore(),
  setStore: (store: KrogerStore) => { if (config) storeService.setStore(store, config); },
  clearStore: () => { if (config) storeService.clearStore(config); },
  searchProducts: (term: string) => {
    if (!config) throw new Error('Kroger not configured');
    const key = term.toLowerCase().trim();
    const cached = searchCache.get(key);
    if (cached) return Promise.resolve(cached);
    return krogerProductApi.search(term, config).then(r => { searchCache.set(key, r); return r; });
  },
  clearSearchCache: () => { searchCache.clear(); },
  searchStores: (zip: string) => { if (!config) throw new Error('Kroger not configured'); return krogerLocationApi.searchByZip(zip, config); },
  searchStoresByLocation: (lat: number, lng: number, r?: number) => krogerLocationApi.searchByLatLng(lat, lng, r),
  getStoreDetails: (id: string) => krogerLocationApi.getStore(id),
  getChains: () => krogerLocationApi.getChains(),
  addToCart: async (upc: string, quantity: number = 1) => {
    if (!config) throw new Error('Kroger not configured');
    return krogerPost('/v1/cart/add', { items: [{ upc, quantity }] }, 'PUT', await krogerAuth.getAccessToken());
  },
  addMultipleToCart: async (items: { upc: string; quantity: number }[]) => {
    if (!config) throw new Error('Kroger not configured');
    return krogerPost('/v1/cart/add', { items }, 'PUT', await krogerAuth.getAccessToken());
  },
  getProfile: () => storeService.getProfile(),
  fetchProfile: async () => {
    const profile = await krogerProfileApi.getProfile();
    if (profile) storeService.setProfile(profile);
    return profile;
  },
  clearProfile: () => storeService.setProfile(null),
  isLoggedIn: () => krogerAuth.isLoggedIn(),
  login: () => krogerAuth.login(),
  logout: () => { krogerAuth.logout(); storeService.setProfile(null); },
  handleAuthCallback: (s: string, t: string, e: number) => krogerAuth.handleCallback(s, t, e),
};

export type { KrogerProduct, KrogerStore, KrogerConfig, KrogerProfile, KrogerDepartment, KrogerStoreHours } from './types';
