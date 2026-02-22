import { PantryItem } from '../../types';

const VID_KEY = 'pantry_visitor_id';
const HOUSEHOLD_CODE_KEY = 'household_code';

export const getVisitorId = (): string => {
  let vid = localStorage.getItem(VID_KEY);
  if (!vid) {
    vid = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(VID_KEY, vid);
  }
  return vid;
};

export const setVisitorId = (vid: string) => {
  localStorage.setItem(VID_KEY, vid);
};

export const getHouseholdCode = (): string | null => localStorage.getItem(HOUSEHOLD_CODE_KEY);
export const setHouseholdCode = (code: string | null) => {
  if (code) localStorage.setItem(HOUSEHOLD_CODE_KEY, code);
  else localStorage.removeItem(HOUSEHOLD_CODE_KEY);
};

let syncTimer: ReturnType<typeof setTimeout> | null = null;
const syncToFirebase = (items: PantryItem[]) => {
  if (syncTimer) clearTimeout(syncTimer);
  syncTimer = setTimeout(() => {
    const vid = getVisitorId();
    fetch(`/api/pantry-sync?vid=${encodeURIComponent(vid)}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    }).catch(() => {});
  }, 2000);
};

export const persist = (items: PantryItem[]) => {
  localStorage.setItem('pantryItems', JSON.stringify(items));
  syncToFirebase(items);
};
