import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PantryState, PantryItem } from '../../types';
import { getShelfLifeDays } from '../../data/shelfLife';
import { persist, getVisitorId } from './pantryHelpers';

const dedup = (items: PantryItem[]): PantryItem[] => {
  const seen = new Set<string>();
  return items.filter(i => {
    if (seen.has(i.id)) return false;
    seen.add(i.id);
    return true;
  });
};

const initialState: PantryState = {
  items: dedup(JSON.parse(localStorage.getItem('pantryItems') || '[]')),
};

const pantrySlice = createSlice({
  name: 'pantry',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Omit<PantryItem, 'id'>>) => {
      const exists = state.items.some(i => i.name.toLowerCase() === action.payload.name.toLowerCase() && i.location === action.payload.location);
      if (exists) return;
      const now = Date.now();
      const shelfDays = getShelfLifeDays(action.payload.name, action.payload.location);
      state.items.push({
        ...action.payload,
        id: crypto.randomUUID ? crypto.randomUUID() : `${now}-${Math.random().toString(36).slice(2)}`,
        addedAt: now,
        expiresAt: shelfDays ? now + shelfDays * 86_400_000 : undefined,
      });
      persist(state.items);
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      persist(state.items);
    },
    updateItem: (state, action: PayloadAction<PantryItem>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) { state.items[index] = action.payload; persist(state.items); }
    },
    clearPantry: (state) => { state.items = []; persist(state.items); },
    setItems: (state, action: PayloadAction<PantryItem[]>) => {
      state.items = dedup(action.payload);
      localStorage.setItem('pantryItems', JSON.stringify(state.items));
    },
  },
});

export const { addItem, removeItem, updateItem, clearPantry, setItems } = pantrySlice.actions;
export { getVisitorId };
export default pantrySlice.reducer;
