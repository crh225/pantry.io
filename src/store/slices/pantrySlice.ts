import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PantryState, PantryItem } from '../../types';

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
      localStorage.setItem('pantryItems', JSON.stringify(state.items));
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      localStorage.setItem('pantryItems', JSON.stringify(state.items));
    },
    updateItem: (state, action: PayloadAction<PantryItem>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
        localStorage.setItem('pantryItems', JSON.stringify(state.items));
      }
    },
    clearPantry: (state) => {
      state.items = [];
      localStorage.setItem('pantryItems', JSON.stringify(state.items));
    },
  },
});

export const { addItem, removeItem, updateItem, clearPantry } = pantrySlice.actions;
export default pantrySlice.reducer;
