import { Recipe, Ingredient } from '../types';

const BASE = 'https://www.themealdb.com/api/json/v1/1';

const transformMeal = (meal: any): Recipe => {
  const ingredients: Ingredient[] = [];
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    const msr = meal[`strMeasure${i}`];
    if (ing?.trim()) ingredients.push({ name: ing, measure: msr || '' });
  }
  return {
    id: meal.idMeal, name: meal.strMeal,
    category: meal.strCategory || '', area: meal.strArea || '',
    instructions: meal.strInstructions || '',
    thumbnail: meal.strMealThumb || '', ingredients,
    sourceUrl: meal.strSource || undefined,
  };
};

const fetchJson = async (url: string) => (await fetch(url)).json();

export const recipeApi = {
  searchByName: async (q: string): Promise<Recipe[]> => {
    const d = await fetchJson(`${BASE}/search.php?s=${q}`);
    return d.meals ? d.meals.map(transformMeal) : [];
  },
  searchByCategory: async (c: string): Promise<Recipe[]> => {
    const d = await fetchJson(`${BASE}/filter.php?c=${c}`);
    return d.meals ? d.meals.map(transformMeal) : [];
  },
  searchByArea: async (a: string): Promise<Recipe[]> => {
    const d = await fetchJson(`${BASE}/filter.php?a=${a}`);
    return d.meals ? d.meals.map(transformMeal) : [];
  },
  getById: async (id: string): Promise<Recipe | null> => {
    const d = await fetchJson(`${BASE}/lookup.php?i=${id}`);
    return d.meals ? transformMeal(d.meals[0]) : null;
  },
  hydrateMany: async (ids: string[]): Promise<Recipe[]> => {
    const results = await Promise.all(ids.map(id => recipeApi.getById(id)));
    return results.filter((r): r is Recipe => r !== null);
  },
};
