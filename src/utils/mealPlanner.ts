import { Recipe, PantryItem, MealSuggestion } from '../types';

export const findMatchingRecipes = (
  recipes: Recipe[],
  pantryItems: PantryItem[]
): MealSuggestion[] => {
  const pantryItemNames = pantryItems.map(item => 
    item.name.toLowerCase().trim()
  );

  return recipes.map(recipe => {
    const missingIngredients = recipe.ingredients
      .filter(ingredient => {
        const ingredientName = ingredient.name.toLowerCase().trim();
        return !pantryItemNames.some(pantryItem => 
          ingredientName.includes(pantryItem) || pantryItem.includes(ingredientName)
        );
      })
      .map(ing => ing.name);

    return {
      recipe,
      missingIngredients,
    };
  }).sort((a, b) => a.missingIngredients.length - b.missingIngredients.length);
};

export const calculateMatchPercentage = (
  totalIngredients: number,
  missingIngredients: number
): number => {
  if (totalIngredients === 0) return 0;
  return Math.round(((totalIngredients - missingIngredients) / totalIngredients) * 100);
};
