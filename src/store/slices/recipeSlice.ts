import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RecipeState } from '../../types';
import { searchRecipes, fetchRecipeById } from './recipeThunks';

const initialState: RecipeState = {
  recipes: [],
  selectedRecipe: null,
  loading: false,
  error: null,
  searchQuery: '',
  searchCategory: '',
};

const recipeSlice = createSlice({
  name: 'recipe',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearRecipes: (state) => {
      state.recipes = [];
      state.selectedRecipe = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchRecipes.pending, (state) => { state.loading = true; })
      .addCase(searchRecipes.fulfilled, (state, action) => {
        state.loading = false;
        state.recipes = action.payload;
      })
      .addCase(searchRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to search recipes';
      })
      .addCase(fetchRecipeById.fulfilled, (state, action) => {
        state.selectedRecipe = action.payload;
      });
  },
});

export const { setSearchQuery, clearRecipes } = recipeSlice.actions;
export default recipeSlice.reducer;
