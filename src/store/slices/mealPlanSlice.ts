import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MealPlanState, Recipe, Ingredient } from '../../types';

const defaultNights = [
  { id: 'mon', label: 'Monday', recipe: null },
  { id: 'tue', label: 'Tuesday', recipe: null },
  { id: 'wed', label: 'Wednesday', recipe: null },
  { id: 'thu', label: 'Thursday', recipe: null },
];

const saved = localStorage.getItem('mealPlan');
const initialState: MealPlanState = saved
  ? JSON.parse(saved)
  : { nights: defaultNights, bag: [] };

const persist = (state: MealPlanState) => {
  localStorage.setItem('mealPlan', JSON.stringify(state));
};

const mealPlanSlice = createSlice({
  name: 'mealPlan',
  initialState,
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
      const newItems = action.payload.filter(
        item => !state.bag.some(b => b.name === item.name)
      );
      state.bag.push(...newItems);
      persist(state);
    },
    removeFromBag: (state, action: PayloadAction<string>) => {
      state.bag = state.bag.filter(item => item.name !== action.payload);
      persist(state);
    },
    clearBag: (state) => {
      state.bag = [];
      persist(state);
    },
  },
});

export const { assignRecipe, removeRecipe, addToBag, removeFromBag, clearBag } = mealPlanSlice.actions;
export default mealPlanSlice.reducer;
