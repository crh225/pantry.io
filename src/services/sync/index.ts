import { SyncProvider } from './types';
import { localProvider } from './localProvider';

// Firebase provider will replace this when configured
let provider: SyncProvider = localProvider;

export const sync = {
  get: () => provider,
  set: (p: SyncProvider) => { provider = p; },
  read: (key: string) => provider.read(key),
  write: (key: string, data: any) => provider.write(key, data),
  subscribe: (key: string, cb: (data: any) => void) => provider.subscribe?.(key, cb) || (() => {}),
  isRealtime: () => provider.type === 'firebase',
};

export type { SyncProvider } from './types';
