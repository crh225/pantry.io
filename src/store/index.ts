import { configureStore } from '@reduxjs/toolkit';
import recipeReducer from './slices/recipeSlice';
import pantryReducer from './slices/pantrySlice';

export const store = configureStore({
  reducer: {
    recipe: recipeReducer,
    pantry: pantryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
