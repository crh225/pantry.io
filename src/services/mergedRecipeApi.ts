import { Recipe } from '../types';
import { recipeApi } from './recipeApi';
import { dummyRecipeApi } from './dummyRecipeApi';
import { spoonacularApi } from './spoonacularApi';

const dedup = (recipes: Recipe[]): Recipe[] => {
  const seen = new Set<string>();
  return recipes.filter(r => {
    const key = r.name.toLowerCase().replace(/\s+/g, '');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export const mergedApi = {
  searchByArea: async (area: string): Promise<Recipe[]> => {
    const [mealDb, dummy, spoon] = await Promise.all([
      recipeApi.searchByArea(area),
      dummyRecipeApi.getAll().then(all => all.filter(r => r.area.toLowerCase() === area.toLowerCase())),
      spoonacularApi.searchByCuisine(area, 8).catch(e => { console.warn('Spoonacular unavailable:', e); return []; }),
    ]);
    return dedup([...mealDb, ...dummy, ...spoon]);
  },
  searchByCategory: async (cat: string): Promise<Recipe[]> => {
    const [mealDb, dummy, spoon] = await Promise.all([
      recipeApi.searchByCategory(cat),
      dummyRecipeApi.searchByTag(cat),
      spoonacularApi.searchByCategory(cat.toLowerCase(), 8).catch(e => { console.warn('Spoonacular unavailable:', e); return []; }),
    ]);
    return dedup([...mealDb, ...dummy, ...spoon]);
  },
  searchByName: async (q: string): Promise<Recipe[]> => {
    const [mealDb, dummy, spoon] = await Promise.all([
      recipeApi.searchByName(q),
      dummyRecipeApi.searchByName(q),
      spoonacularApi.searchByName(q, 8).catch(e => { console.warn('Spoonacular unavailable:', e); return []; }),
    ]);
    return dedup([...mealDb, ...dummy, ...spoon]);
  },
  getById: async (id: string): Promise<Recipe | null> => {
    if (id.startsWith('sp-')) return spoonacularApi.getById(id);
    if (id.startsWith('dj-')) return dummyRecipeApi.getById(id);
    return recipeApi.getById(id);
  },
};
