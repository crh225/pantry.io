import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PantryState, PantryItem } from '../../types';

const VID_KEY = 'pantry_visitor_id';

const getVisitorId = (): string => {
  let vid = localStorage.getItem(VID_KEY);
  if (!vid) {
    vid = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(VID_KEY, vid);
  }
  return vid;
};

// Debounced Firebase sync (fire and forget)
let syncTimer: ReturnType<typeof setTimeout> | null = null;
const syncToFirebase = (items: PantryItem[]) => {
  if (syncTimer) clearTimeout(syncTimer);
  syncTimer = setTimeout(() => {
    const vid = getVisitorId();
    fetch(`/api/pantry-sync?vid=${encodeURIComponent(vid)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    }).catch(() => {});
  }, 2000);
};

const persist = (items: PantryItem[]) => {
  localStorage.setItem('pantryItems', JSON.stringify(items));
  syncToFirebase(items);
};

const initialState: PantryState = {
  items: JSON.parse(localStorage.getItem('pantryItems') || '[]'),
};

const pantrySlice = createSlice({
  name: 'pantry',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Omit<PantryItem, 'id'>>) => {
      const newItem: PantryItem = {
        ...action.payload,
        id: Date.now().toString(),
      };
      state.items.push(newItem);
      persist(state.items);
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      persist(state.items);
    },
    updateItem: (state, action: PayloadAction<PantryItem>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
        persist(state.items);
      }
    },
    clearPantry: (state) => {
      state.items = [];
      persist(state.items);
    },
    setItems: (state, action: PayloadAction<PantryItem[]>) => {
      state.items = action.payload;
      localStorage.setItem('pantryItems', JSON.stringify(state.items));
    },
  },
});

export const { addItem, removeItem, updateItem, clearPantry, setItems } = pantrySlice.actions;
export { getVisitorId };
export default pantrySlice.reducer;
