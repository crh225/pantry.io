import { SyncProvider } from './types';

export const localProvider: SyncProvider = {
  type: 'local',
  read: async (key: string) => {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  },
  write: async (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  },
};
