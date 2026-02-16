import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RecipeState } from '../../types';
import { searchRecipes, fetchRecipeById, searchByCategory, searchByArea } from './recipeThunks';

const initialState: RecipeState = {
  recipes: [], selectedRecipe: null, loading: false,
  error: null, searchQuery: '', searchCategory: '',
};

const pending = (s: RecipeState) => { s.loading = true; s.error = null; };
const rejected = (s: RecipeState, a: any) => { s.loading = false; s.error = a.error.message || 'Failed'; };
const done = (s: RecipeState, a: PayloadAction<any>) => { s.loading = false; s.recipes = a.payload; };

const recipeSlice = createSlice({
  name: 'recipe',
  initialState,
  reducers: {
    setSearchQuery: (s, a: PayloadAction<string>) => { s.searchQuery = a.payload; },
    clearRecipes: (s) => { s.recipes = []; s.selectedRecipe = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchRecipes.pending, pending)
      .addCase(searchRecipes.fulfilled, done)
      .addCase(searchRecipes.rejected, rejected)
      .addCase(searchByCategory.pending, pending)
      .addCase(searchByCategory.fulfilled, done)
      .addCase(searchByCategory.rejected, rejected)
      .addCase(searchByArea.pending, pending)
      .addCase(searchByArea.fulfilled, done)
      .addCase(searchByArea.rejected, rejected)
      .addCase(fetchRecipeById.fulfilled, (s, a) => { s.selectedRecipe = a.payload; });
  },
});

export const { setSearchQuery, clearRecipes } = recipeSlice.actions;
export default recipeSlice.reducer;
