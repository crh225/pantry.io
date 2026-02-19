import { KrogerConfig, KrogerStore, KrogerProfile } from './types';

const STORE_KEY = 'kroger_selected_store';
const PROFILE_KEY = 'kroger_profile';

let selectedStore: KrogerStore | null = null;
let userProfile: KrogerProfile | null = null;

const loadSaved = <T>(key: string): T | null => {
  try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : null; } catch { return null; }
};

export const initStoreService = (config: KrogerConfig) => {
  const saved = loadSaved<KrogerStore>(STORE_KEY);
  if (saved) { config.locationId = saved.locationId; selectedStore = saved; }
  userProfile = loadSaved<KrogerProfile>(PROFILE_KEY);
};

export const storeService = {
  getSelectedStore: () => selectedStore,
  setStore: (store: KrogerStore, config: KrogerConfig) => {
    config.locationId = store.locationId;
    selectedStore = store;
    localStorage.setItem(STORE_KEY, JSON.stringify(store));
  },
  clearStore: (config: KrogerConfig) => {
    config.locationId = undefined;
    selectedStore = null;
    localStorage.removeItem(STORE_KEY);
  },
  getProfile: () => userProfile,
  setProfile: (profile: KrogerProfile | null) => {
    userProfile = profile;
    if (profile) { try { localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)); } catch {} }
    else localStorage.removeItem(PROFILE_KEY);
  },
};
