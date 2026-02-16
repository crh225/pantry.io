import { Recipe } from '../types';
import { recipeApi } from './recipeApi';
import { dummyRecipeApi } from './dummyRecipeApi';

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
    const [mealDb, dummy] = await Promise.all([
      recipeApi.searchByArea(area),
      dummyRecipeApi.getAll().then(all => all.filter(r => r.area.toLowerCase() === area.toLowerCase())),
    ]);
    return dedup([...mealDb, ...dummy]);
  },
  searchByCategory: async (cat: string): Promise<Recipe[]> => {
    const [mealDb, dummy] = await Promise.all([
      recipeApi.searchByCategory(cat),
      dummyRecipeApi.searchByTag(cat),
    ]);
    return dedup([...mealDb, ...dummy]);
  },
  searchByName: async (q: string): Promise<Recipe[]> => {
    const [mealDb, dummy] = await Promise.all([
      recipeApi.searchByName(q),
      dummyRecipeApi.searchByName(q),
    ]);
    return dedup([...mealDb, ...dummy]);
  },
};
