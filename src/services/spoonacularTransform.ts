import { Recipe, Ingredient, NutritionInfo } from '../types';

const findNutrient = (nutrients: any[], names: string[], defaultVal = 0) => {
  for (const n of nutrients) {
    const norm = (n.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    if (names.some(alt => alt.toLowerCase().replace(/[^a-z0-9]/g, '') === norm)) {
      return n.amount !== undefined && n.amount !== null ? parseFloat(n.amount) : defaultVal;
    }
  }
  return defaultVal;
}

export const transformRecipe = (item: any): Recipe => {
  const ingredients: Ingredient[] = (item.extendedIngredients || []).map((ing: any) => ({
    name: ing.name || ing.originalName,
    measure: ing.original || `${ing.amount} ${ing.unit}`,
  }));
  
  // Extract nutrition if present
  let nutrition: NutritionInfo | undefined;
  const nutrients = (item.nutrition || {}).nutrients || [];
  if (nutrients.length > 0) {
    const calories = findNutrient(nutrients, ['Calories', 'Energy']);
    const fat = findNutrient(nutrients, ['Fat', 'Total Fat', 'Fats']);
    const saturatedFat = findNutrient(nutrients, ['Saturated Fat', 'Saturated Fat Acids']);
    const carbs = findNutrient(nutrients, ['Carbohydrates', 'Total Carbohydrates']);
    const protein = findNutrient(nutrients, ['Protein']);
    const fiber = findNutrient(nutrients, ['Fiber', 'Fiber']);
    const sodium = findNutrient(nutrients, ['Sodium']);
    
    if (calories > 0 || fat > 0 || carbs > 0 || protein > 0) {
      nutrition = { calories, fat, saturatedFat, carbs, protein, fiber, sodium };
    }
  }
  
  return {
    id: `sp-${item.id}`, name: item.title, category: item.dishTypes?.[0] || '',
    area: item.cuisines?.[0] || '', instructions: item.instructions || '',
    thumbnail: item.image || '', ingredients,
    readyInMinutes: item.readyInMinutes, servings: item.servings, sourceUrl: item.sourceUrl,
    nutrition,
  };
};

export const transformSearchResult = (item: any): Recipe => ({
  id: `sp-${item.id}`, name: item.title, category: '', area: '',
  instructions: '', thumbnail: item.image || '', ingredients: [],
});
