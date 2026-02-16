import { createAsyncThunk } from '@reduxjs/toolkit';
import { Recipe } from '../../types';
import { dummyRecipeApi } from '../../services/dummyRecipeApi';
import { mergedApi } from '../../services/mergedRecipeApi';
import { filterByDiet } from '../../utils/dietFilter';
import { diets } from '../../data/diets';
import { hydrateRecipe, setRelated } from './recipeSlice';

export const searchRecipes = createAsyncThunk('recipe/search', (q: string) => mergedApi.searchByName(q));
export const searchByCategory = createAsyncThunk('recipe/searchByCategory', (c: string) => mergedApi.searchByCategory(c));
export const searchByArea = createAsyncThunk('recipe/searchByArea', (a: string) => mergedApi.searchByArea(a));
export const fetchRecipeById = createAsyncThunk('recipe/fetchById', (id: string) => mergedApi.getById(id));

interface MultiFilter { cuisine?: string; protein?: string; dietId?: string; }

const hydrateAll = (recipes: Recipe[], diet: ReturnType<typeof diets.find> | null, dispatch: any) => {
  recipes.slice(0, 30).forEach(r => {
    if (r.id.startsWith('dj-') || r.ingredients.length > 0) return;
    mergedApi.getById(r.id).then(full => {
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
    const mIds = new Set(recipes.map(r => r.id)); const seen = new Set<string>();
    dispatch(setRelated([...byArea, ...byCat].filter(r => !mIds.has(r.id) && (seen.has(r.id) ? false : (seen.add(r.id), true))).slice(0, 20)));
  } else if (f.cuisine) {
    recipes = await mergedApi.searchByArea(f.cuisine);
  } else if (f.protein) {
    recipes = await mergedApi.searchByCategory(f.protein);
  } else if (diet) {
    // Diet only — get all DummyJSON recipes (they have ingredients) and filter
    const all = await dummyRecipeApi.getAll();
    return filterByDiet(all, diet);
  } else { return []; }
  if (recipes.length === 0) return recipes;
  setTimeout(() => hydrateAll(recipes, diet, dispatch), 0);
  return recipes;
});
