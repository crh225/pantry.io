import { Recipe, Ingredient } from '../types';

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

export const recipeApi = {
  searchByName: async (query: string): Promise<Recipe[]> => {
    const response = await fetch(`${BASE_URL}/search.php?s=${query}`);
    const data = await response.json();
    return data.meals ? data.meals.map(transformMeal) : [];
  },

  searchByCategory: async (category: string): Promise<Recipe[]> => {
    const response = await fetch(`${BASE_URL}/filter.php?c=${category}`);
    const data = await response.json();
    return data.meals ? data.meals.map(transformMeal) : [];
  },

  searchByArea: async (area: string): Promise<Recipe[]> => {
    const response = await fetch(`${BASE_URL}/filter.php?a=${area}`);
    const data = await response.json();
    return data.meals ? data.meals.map(transformMeal) : [];
  },

  getById: async (id: string): Promise<Recipe | null> => {
    const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
    const data = await response.json();
    return data.meals ? transformMeal(data.meals[0]) : null;
  },
};

const transformMeal = (meal: any): Recipe => {
  const ingredients: Ingredient[] = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push({ name: ingredient, measure: measure || '' });
    }
  }

  return {
    id: meal.idMeal,
    name: meal.strMeal,
    category: meal.strCategory || '',
    area: meal.strArea || '',
    instructions: meal.strInstructions || '',
    thumbnail: meal.strMealThumb || '',
    ingredients,
  };
};
