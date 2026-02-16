import { createAsyncThunk } from '@reduxjs/toolkit';
import { recipeApi } from '../../services/recipeApi';
import { filterByDiet } from '../../utils/dietFilter';
import { diets } from '../../data/diets';

export const searchRecipes = createAsyncThunk('recipe/search', async (q: string) => recipeApi.searchByName(q));
export const searchByCategory = createAsyncThunk('recipe/searchByCategory', async (c: string) => recipeApi.searchByCategory(c));
export const searchByArea = createAsyncThunk('recipe/searchByArea', async (a: string) => recipeApi.searchByArea(a));
export const fetchRecipeById = createAsyncThunk('recipe/fetchById', async (id: string) => recipeApi.getById(id));

interface MultiFilter { cuisine?: string; protein?: string; dietId?: string; }

export const searchMultiFilter = createAsyncThunk('recipe/multiFilter', async (f: MultiFilter) => {
  let recipes = f.cuisine
    ? await recipeApi.searchByArea(f.cuisine)
    : f.protein ? await recipeApi.searchByCategory(f.protein) : [];
  if (f.cuisine && f.protein) {
    recipes = recipes.filter(r => r.category === f.protein);
  }
  if (!f.dietId || recipes.length === 0) return recipes;
  const diet = diets.find(d => d.id === f.dietId);
  if (!diet) return recipes;
  const ids = recipes.slice(0, 30).map(r => r.id);
  const hydrated = await recipeApi.hydrateMany(ids);
  return filterByDiet(hydrated, diet);
});
