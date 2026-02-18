import { configureStore } from '@reduxjs/toolkit';
import recipeReducer from './slices/recipeSlice';
import pantryReducer from './slices/pantrySlice';
import mealPlanReducer from './slices/mealPlanSlice';
import krogerReducer from './slices/krogerSlice';

export const store = configureStore({
  reducer: {
    recipe: recipeReducer,
    pantry: pantryReducer,
    mealPlan: mealPlanReducer,
    kroger: krogerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
