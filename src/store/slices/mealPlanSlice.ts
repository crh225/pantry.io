import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Recipe, Ingredient, MealPlanState } from '../../types';
import { persist, loadInitialState } from './mealPlanHelpers';

const mealPlanSlice = createSlice({
  name: 'mealPlan',
  initialState: loadInitialState(),
  reducers: {
    assignRecipe: (state, action: PayloadAction<{ nightId: string; recipe: Recipe }>) => {
      const night = state.nights.find(n => n.id === action.payload.nightId);
      if (night) night.recipe = action.payload.recipe;
      persist(state);
    },
    removeRecipe: (state, action: PayloadAction<string>) => {
      const night = state.nights.find(n => n.id === action.payload);
      if (night) night.recipe = null;
      persist(state);
    },
    addToBag: (state, action: PayloadAction<Ingredient[]>) => {
      const newItems = action.payload.filter(i => !state.bag.some(b => b.name === i.name));
      state.bag.push(...newItems);
      persist(state);
    },
    removeFromBag: (state, action: PayloadAction<string>) => {
      state.bag = state.bag.filter(i => i.name !== action.payload);
      persist(state);
    },
    clearBag: (state) => { state.bag = []; persist(state); },
    swapNights: (state, action: PayloadAction<{ from: string; to: string }>) => {
      const a = state.nights.find(n => n.id === action.payload.from);
      const b = state.nights.find(n => n.id === action.payload.to);
      if (a && b) { const tmp = a.recipe; a.recipe = b.recipe; b.recipe = tmp; }
      persist(state);
    },
    moveNight: (state, action: PayloadAction<{ nightId: string; dir: -1 | 1 }>) => {
      const idx = state.nights.findIndex(n => n.id === action.payload.nightId);
      const t = idx + action.payload.dir;
      if (idx >= 0 && t >= 0 && t < state.nights.length) {
        const tmp = state.nights[idx].recipe;
        state.nights[idx].recipe = state.nights[t].recipe;
        state.nights[t].recipe = tmp;
      }
      persist(state);
    },
    setMealPlan: (_state, action: PayloadAction<MealPlanState>) => {
      localStorage.setItem('mealPlan', JSON.stringify(action.payload));
      return action.payload;
    },
  },
});

export const { assignRecipe, removeRecipe, addToBag, removeFromBag, clearBag, swapNights, moveNight, setMealPlan } = mealPlanSlice.actions;
export default mealPlanSlice.reducer;
