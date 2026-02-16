import { createAsyncThunk } from '@reduxjs/toolkit';
import { Recipe } from '../../types';
import { recipeApi } from '../../services/recipeApi';
import { mergedApi } from '../../services/mergedRecipeApi';
import { filterByDiet } from '../../utils/dietFilter';
import { diets } from '../../data/diets';
import { hydrateRecipe, setRelated } from './recipeSlice';

export const searchRecipes = createAsyncThunk('recipe/search', async (q: string) => mergedApi.searchByName(q));
export const searchByCategory = createAsyncThunk('recipe/searchByCategory', async (c: string) => mergedApi.searchByCategory(c));
export const searchByArea = createAsyncThunk('recipe/searchByArea', async (a: string) => mergedApi.searchByArea(a));
export const fetchRecipeById = createAsyncThunk('recipe/fetchById', async (id: string) => recipeApi.getById(id));

interface MultiFilter { cuisine?: string; protein?: string; dietId?: string; }

const hydrateAll = (recipes: Recipe[], diet: ReturnType<typeof diets.find> | null, dispatch: any) => {
  recipes.slice(0, 30).forEach(r => {
    if (r.id.startsWith('dj-') || r.ingredients.length > 0) return; // already has data
    recipeApi.getById(r.id).then(full => {
      if (!full) return;
      if (diet && filterByDiet([full], diet).length === 0) return;
      dispatch(hydrateRecipe(full));
    });
  });
};

export const searchMultiFilter = createAsyncThunk('recipe/multiFilter', async (f: MultiFilter, { dispatch }) => {
  const diet = f.dietId ? diets.find(d => d.id === f.dietId) : null;
  let recipes: Recipe[];
  if (f.cuisine && f.protein) {
    const [byArea, byCat] = await Promise.all([mergedApi.searchByArea(f.cuisine), mergedApi.searchByCategory(f.protein)]);
    const catIds = new Set(byCat.map(r => r.id));
    recipes = byArea.filter(r => catIds.has(r.id));
    // Related: remaining from each set (not in intersection)
    const matchIds = new Set(recipes.map(r => r.id));
    const related = [...byArea, ...byCat].filter(r => !matchIds.has(r.id));
    const seen = new Set<string>();
    const dedupRelated = related.filter(r => { if (seen.has(r.id)) return false; seen.add(r.id); return true; });
    dispatch(setRelated(dedupRelated.slice(0, 20)));
    setTimeout(() => hydrateAll(dedupRelated, diet, dispatch), 100);
  } else if (f.cuisine) {
    recipes = await mergedApi.searchByArea(f.cuisine);
  } else if (f.protein) {
    recipes = await mergedApi.searchByCategory(f.protein);
  } else { return []; }
  if (recipes.length === 0) return recipes;
  setTimeout(() => hydrateAll(recipes, diet, dispatch), 0);
  return recipes;
});
