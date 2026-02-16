import { KrogerConfig, KrogerStore } from './types';
import { krogerProductApi } from './productApi';
import { krogerLocationApi } from './locationApi';

const STORE_KEY = 'kroger_selected_store';

let config: KrogerConfig | null = null;
let selectedStore: KrogerStore | null = null;

// Load saved store from localStorage
const loadSavedStore = (): KrogerStore | null => {
  try {
    const saved = localStorage.getItem(STORE_KEY);
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
  },
  isConfigured: () => config !== null,
  getConfig: () => config,
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
  searchProducts: (term: string) => {
    if (!config) throw new Error('Kroger not configured');
    return krogerProductApi.search(term, config);
  },
  searchStores: (zip: string) => {
    if (!config) throw new Error('Kroger not configured');
    return krogerLocationApi.searchByZip(zip, config);
  },
};

export type { KrogerProduct, KrogerStore, KrogerConfig } from './types';
