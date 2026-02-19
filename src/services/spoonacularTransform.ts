import { Recipe, Ingredient } from '../types';

export const transformRecipe = (item: any): Recipe => {
  const ingredients: Ingredient[] = (item.extendedIngredients || []).map((ing: any) => ({
    name: ing.name || ing.originalName,
    measure: ing.original || `${ing.amount} ${ing.unit}`,
  }));
  return {
    id: `sp-${item.id}`, name: item.title, category: item.dishTypes?.[0] || '',
    area: item.cuisines?.[0] || '', instructions: item.instructions || '',
    thumbnail: item.image || '', ingredients,
    readyInMinutes: item.readyInMinutes, servings: item.servings, sourceUrl: item.sourceUrl,
  };
};

export const transformSearchResult = (item: any): Recipe => ({
  id: `sp-${item.id}`, name: item.title, category: '', area: '',
  instructions: '', thumbnail: item.image || '', ingredients: [],
});
