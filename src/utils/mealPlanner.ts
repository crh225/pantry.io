import { Recipe, PantryItem, MealSuggestion } from '../types';
import { isIngredientAvailable } from './ingredientMatch';

export const findMatchingRecipes = (
  recipes: Recipe[],
  pantryItems: PantryItem[]
): MealSuggestion[] => {
  const pantryNames = pantryItems.map(i => i.name.toLowerCase().trim());

  return recipes.map(recipe => {
    const missingIngredients = recipe.ingredients
      .filter(ing => !isIngredientAvailable(ing.name, pantryNames))
      .map(ing => ing.name);
    return { recipe, missingIngredients };
  }).sort((a, b) => a.missingIngredients.length - b.missingIngredients.length);
};

export const calculateMatchPercentage = (
  totalIngredients: number,
  missingIngredients: number
): number => {
  if (totalIngredients === 0) return 0;
  return Math.round(((totalIngredients - missingIngredients) / totalIngredients) * 100);
};
