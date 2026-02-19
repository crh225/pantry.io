import { Recipe } from '../types';
import { transformRecipe, transformSearchResult } from './spoonacularTransform';

async function spoonacularFetch(path: string): Promise<any> {
  const res = await fetch(`/api/spoonacular?path=${encodeURIComponent(path)}`);
  if (!res.ok) return null;
  return res.json();
}

export const spoonacularApi = {
  searchByName: async (query: string, number = 12): Promise<Recipe[]> => {
    const data = await spoonacularFetch(`/recipes/complexSearch?query=${encodeURIComponent(query)}&number=${number}`);
    return data?.results ? data.results.map(transformSearchResult) : [];
  },
  searchByIngredients: async (ingredients: string[], number = 12): Promise<Recipe[]> => {
    const list = ingredients.join(',');
    const data = await spoonacularFetch(`/recipes/findByIngredients?ingredients=${encodeURIComponent(list)}&number=${number}&ranking=2`);
    if (!data) return [];
    return data.map((item: any) => ({
      id: `sp-${item.id}`, name: item.title, category: '', area: '', instructions: '',
      thumbnail: item.image || '', ingredients: [],
      usedIngredientCount: item.usedIngredientCount, missedIngredientCount: item.missedIngredientCount,
    }));
  },
  searchByCuisine: async (cuisine: string, number = 12): Promise<Recipe[]> => {
    const data = await spoonacularFetch(`/recipes/complexSearch?cuisine=${encodeURIComponent(cuisine)}&number=${number}`);
    return data?.results ? data.results.map(transformSearchResult) : [];
  },
  searchByCategory: async (type: string, number = 12): Promise<Recipe[]> => {
    const data = await spoonacularFetch(`/recipes/complexSearch?type=${encodeURIComponent(type)}&number=${number}`);
    return data?.results ? data.results.map(transformSearchResult) : [];
  },
  getById: async (id: string): Promise<Recipe | null> => {
    const data = await spoonacularFetch(`/recipes/${id.replace('sp-', '')}/information?includeNutrition=false`);
    return data ? transformRecipe(data) : null;
  },
  getRandom: async (number = 6, tags?: string): Promise<Recipe[]> => {
    let path = `/recipes/random?number=${number}`;
    if (tags) path += `&tags=${encodeURIComponent(tags)}`;
    const data = await spoonacularFetch(path);
    return data?.recipes ? data.recipes.map(transformRecipe) : [];
  },
};
