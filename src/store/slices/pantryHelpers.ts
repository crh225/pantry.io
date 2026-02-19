import { PantryItem } from '../../types';

const VID_KEY = 'pantry_visitor_id';

export const getVisitorId = (): string => {
  let vid = localStorage.getItem(VID_KEY);
  if (!vid) {
    vid = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(VID_KEY, vid);
  }
  return vid;
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
