import { createAsyncThunk } from '@reduxjs/toolkit';
import { recipeApi } from '../../services/recipeApi';
import { filterByDiet } from '../../utils/dietFilter';
import { diets } from '../../data/diets';
import { hydrateRecipe } from './recipeSlice';

export const searchRecipes = createAsyncThunk('recipe/search', async (q: string) => recipeApi.searchByName(q));
export const searchByCategory = createAsyncThunk('recipe/searchByCategory', async (c: string) => recipeApi.searchByCategory(c));
export const searchByArea = createAsyncThunk('recipe/searchByArea', async (a: string) => recipeApi.searchByArea(a));
export const fetchRecipeById = createAsyncThunk('recipe/fetchById', async (id: string) => recipeApi.getById(id));

interface MultiFilter { cuisine?: string; protein?: string; dietId?: string; }

export const searchMultiFilter = createAsyncThunk('recipe/multiFilter', async (f: MultiFilter, { dispatch }) => {
  let recipes;
  if (f.cuisine && f.protein) {
    const [byArea, byCat] = await Promise.all([recipeApi.searchByArea(f.cuisine), recipeApi.searchByCategory(f.protein)]);
    const catIds = new Set(byCat.map(r => r.id));
    recipes = byArea.filter(r => catIds.has(r.id));
  } else if (f.cuisine) {
    recipes = await recipeApi.searchByArea(f.cuisine);
  } else if (f.protein) {
    recipes = await recipeApi.searchByCategory(f.protein);
  } else { return []; }
  if (recipes.length === 0) return recipes;
  const diet = f.dietId ? diets.find(d => d.id === f.dietId) : null;
  const toHydrate = recipes.slice(0, 30);
  setTimeout(() => {
    toHydrate.forEach(r => {
      recipeApi.getById(r.id).then(full => { if (full) {
        if (diet && filterByDiet([full], diet).length === 0) return;
        dispatch(hydrateRecipe(full));
      }});
    });
  }, 0);
  return recipes;
});
