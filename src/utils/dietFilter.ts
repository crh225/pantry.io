import { Recipe } from '../types';
import { Diet } from '../data/diets';

export const filterByDiet = (recipes: Recipe[], diet: Diet): Recipe[] => {
  return recipes.filter(r => {
    if (diet.requireCategory?.length) {
      if (r.category && !diet.requireCategory.includes(r.category)) return false;
    }
    if (diet.exclude.length && r.ingredients.length > 0) {
      const hasExcluded = r.ingredients.some(ing =>
        diet.exclude.some(ex => ing.name.toLowerCase().includes(ex))
      );
      if (hasExcluded) return false;
    }
    return true;
  });
};
