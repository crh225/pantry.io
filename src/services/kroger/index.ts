import { KrogerConfig, KrogerStore, KrogerProfile } from './types';
import { krogerProductApi } from './productApi';
import { krogerLocationApi } from './locationApi';
import { krogerProfileApi } from './profileApi';
import { krogerPost } from './proxy';
import { krogerAuth } from './auth';

const STORE_KEY = 'kroger_selected_store';
const PROFILE_KEY = 'kroger_profile';

let config: KrogerConfig | null = null;
let selectedStore: KrogerStore | null = null;
let userProfile: KrogerProfile | null = null;

// Load saved store from localStorage
const loadSavedStore = (): KrogerStore | null => {
  try {
    const saved = localStorage.getItem(STORE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch { return null; }
};

// Load saved profile from localStorage
const loadSavedProfile = (): KrogerProfile | null => {
  try {
    const saved = localStorage.getItem(PROFILE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch { return null; }
};

export const kroger = {
  configure: (c: KrogerConfig) => {
    config = c;
    // Load previously saved store
    const saved = loadSavedStore();
    if (saved) {
      config.locationId = saved.locationId;
      selectedStore = saved;
    }
    // Load previously saved profile
    userProfile = loadSavedProfile();
  },
  isConfigured: () => config !== null,
  getConfig: () => config,

  // Store methods
  getSelectedStore: () => selectedStore,
  setStore: (store: KrogerStore) => {
    if (!config) return;
    config.locationId = store.locationId;
    selectedStore = store;
    localStorage.setItem(STORE_KEY, JSON.stringify(store));
  },
  clearStore: () => {
    if (config) config.locationId = undefined;
    selectedStore = null;
    localStorage.removeItem(STORE_KEY);
  },

  // Product methods
  searchProducts: (term: string) => {
    if (!config) throw new Error('Kroger not configured');
    return krogerProductApi.search(term, config);
  },

  // Location methods
  searchStores: (zip: string) => {
    if (!config) throw new Error('Kroger not configured');
    return krogerLocationApi.searchByZip(zip, config);
  },
  searchStoresByLocation: (lat: number, lng: number, radiusMiles?: number) => {
    return krogerLocationApi.searchByLatLng(lat, lng, radiusMiles);
  },
  getStoreDetails: (locationId: string) => {
    return krogerLocationApi.getStore(locationId);
  },
  getChains: () => {
    return krogerLocationApi.getChains();
  },

  // Cart methods
  addToCart: async (upc: string, quantity: number = 1) => {
    if (!config) throw new Error('Kroger not configured');
    const token = await krogerAuth.getAccessToken();
    return krogerPost('/v1/cart/add', { items: [{ upc, quantity }] }, 'PUT', token);
  },
  addMultipleToCart: async (items: { upc: string; quantity: number }[]) => {
    if (!config) throw new Error('Kroger not configured');
    const token = await krogerAuth.getAccessToken();
    return krogerPost('/v1/cart/add', { items }, 'PUT', token);
  },

  // Profile methods
  getProfile: () => userProfile,
  fetchProfile: async (): Promise<KrogerProfile | null> => {
    const profile = await krogerProfileApi.getProfile();
    if (profile) {
      userProfile = profile;
      try {
        localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
      } catch {}
    }
    return profile;
  },
  clearProfile: () => {
    userProfile = null;
    localStorage.removeItem(PROFILE_KEY);
  },

  // Auth methods
  isLoggedIn: () => krogerAuth.isLoggedIn(),
  login: () => krogerAuth.login(),
  logout: () => {
    krogerAuth.logout();
    userProfile = null;
    localStorage.removeItem(PROFILE_KEY);
  },
  handleAuthCallback: (sessionId: string, token: string, expiresIn: number) => {
    krogerAuth.handleCallback(sessionId, token, expiresIn);
  },
};

export type { KrogerProduct, KrogerStore, KrogerConfig, KrogerProfile, KrogerDepartment, KrogerStoreHours } from './types';
