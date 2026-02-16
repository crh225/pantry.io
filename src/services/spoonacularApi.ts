import { Recipe, Ingredient } from '../types';

async function spoonacularFetch(path: string): Promise<any> {
  const res = await fetch(`/api/spoonacular?path=${encodeURIComponent(path)}`);
  if (!res.ok) return null;
  return res.json();
}

const transformRecipe = (item: any): Recipe => {
  const ingredients: Ingredient[] = (item.extendedIngredients || []).map((ing: any) => ({
    name: ing.name || ing.originalName,
    measure: ing.original || `${ing.amount} ${ing.unit}`,
  }));

  return {
    id: `sp-${item.id}`,
    name: item.title,
    category: item.dishTypes?.[0] || '',
    area: item.cuisines?.[0] || '',
    instructions: item.instructions || '',
    thumbnail: item.image || '',
    ingredients,
    readyInMinutes: item.readyInMinutes,
    servings: item.servings,
    sourceUrl: item.sourceUrl,
  };
};

const transformSearchResult = (item: any): Recipe => ({
  id: `sp-${item.id}`,
  name: item.title,
  category: '',
  area: '',
  instructions: '',
  thumbnail: item.image || '',
  ingredients: [],
});

export const spoonacularApi = {
  searchByName: async (query: string, number = 12): Promise<Recipe[]> => {
    const data = await spoonacularFetch(`/recipes/complexSearch?query=${encodeURIComponent(query)}&number=${number}`);
    return data?.results ? data.results.map(transformSearchResult) : [];
  },

  searchByIngredients: async (ingredients: string[], number = 12): Promise<Recipe[]> => {
    const ingredientList = ingredients.join(',');
    const data = await spoonacularFetch(`/recipes/findByIngredients?ingredients=${encodeURIComponent(ingredientList)}&number=${number}&ranking=2`);
    if (!data) return [];
    return data.map((item: any) => ({
      id: `sp-${item.id}`,
      name: item.title,
      category: '',
      area: '',
      instructions: '',
      thumbnail: item.image || '',
      ingredients: [],
      usedIngredientCount: item.usedIngredientCount,
      missedIngredientCount: item.missedIngredientCount,
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
    // Remove 'sp-' prefix if present
    const numericId = id.replace('sp-', '');
    const data = await spoonacularFetch(`/recipes/${numericId}/information?includeNutrition=false`);
    return data ? transformRecipe(data) : null;
  },

  getRandom: async (number = 6, tags?: string): Promise<Recipe[]> => {
    let path = `/recipes/random?number=${number}`;
    if (tags) path += `&tags=${encodeURIComponent(tags)}`;
    const data = await spoonacularFetch(path);
    return data?.recipes ? data.recipes.map(transformRecipe) : [];
  },
};
