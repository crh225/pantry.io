export interface SyncProvider {
  read: (key: string) => Promise<any | null>;
  write: (key: string, data: any) => Promise<void>;
  subscribe?: (key: string, callback: (data: any) => void) => () => void;
  type: 'local' | 'firebase';
}

export interface SyncConfig {
  provider: SyncProvider;
  householdId?: string;
}
