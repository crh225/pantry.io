import { KrogerConfig } from './types';
import { krogerProductApi } from './productApi';
import { krogerLocationApi } from './locationApi';

let config: KrogerConfig | null = null;

export const kroger = {
  configure: (c: KrogerConfig) => { config = c; },
  isConfigured: () => config !== null,
  getConfig: () => config,
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
