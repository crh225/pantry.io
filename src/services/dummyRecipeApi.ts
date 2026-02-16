import { Recipe } from '../types';

const BASE = 'https://dummyjson.com/recipes';

const transform = (r: any): Recipe => ({
  id: `dj-${r.id}`,
  name: r.name,
  category: (r.tags || []).find((t: string) => ['Chicken', 'Beef', 'Shrimp', 'Pasta', 'Vegetarian'].includes(t)) || '',
  area: r.cuisine || '',
  instructions: (r.instructions || []).join('\n'),
  thumbnail: r.image || '',
  ingredients: (r.ingredients || []).map((i: string) => ({ name: i, measure: '' })),
  caloriesPerServing: r.caloriesPerServing || null,
  prepTime: r.prepTimeMinutes,
  cookTime: r.cookTimeMinutes,
  rating: r.rating, reviewCount: r.reviewCount,
  servings: r.servings,
});

const fetchJson = async (url: string) => (await fetch(url)).json();

export const dummyRecipeApi = {
  searchByName: async (q: string): Promise<Recipe[]> => {
    const d = await fetchJson(`${BASE}/search?q=${q}&limit=20`);
    return (d.recipes || []).map(transform);
  },
  searchByTag: async (tag: string): Promise<Recipe[]> => {
    const d = await fetchJson(`${BASE}/tag/${tag}?limit=20`);
    return (d.recipes || []).map(transform);
  },
  getAll: async (): Promise<Recipe[]> => {
    const d = await fetchJson(`${BASE}?limit=50`);
    return (d.recipes || []).map(transform);
  },
};
