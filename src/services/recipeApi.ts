import { Recipe, Ingredient } from '../types';

const mealdbFetch = async (path: string) => {
  const res = await fetch(`/api/mealdb?path=${encodeURIComponent(path)}`);
  return res.json();
};

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

export const recipeApi = {
  searchByName: async (q: string): Promise<Recipe[]> => {
    const d = await mealdbFetch(`search.php?s=${q}`);
    return d.meals ? d.meals.map(transformMeal) : [];
  },
  searchByCategory: async (c: string): Promise<Recipe[]> => {
    const d = await mealdbFetch(`filter.php?c=${c}`);
    return d.meals ? d.meals.map(transformMeal) : [];
  },
  searchByArea: async (a: string): Promise<Recipe[]> => {
    const d = await mealdbFetch(`filter.php?a=${a}`);
    return d.meals ? d.meals.map(transformMeal) : [];
  },
  getById: async (id: string): Promise<Recipe | null> => {
    const d = await mealdbFetch(`lookup.php?i=${id}`);
    return d.meals ? transformMeal(d.meals[0]) : null;
  },
  hydrateMany: async (ids: string[]): Promise<Recipe[]> => {
    const results = await Promise.all(ids.map(id => recipeApi.getById(id)));
    return results.filter((r): r is Recipe => r !== null);
  },
};
