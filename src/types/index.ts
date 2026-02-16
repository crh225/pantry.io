export interface Ingredient { name: string; measure: string; }

export interface Recipe {
  id: string; name: string; category: string; area: string;
  instructions: string; thumbnail: string; ingredients: Ingredient[];
  caloriesPerServing?: number | null;
  prepTime?: number; cookTime?: number; rating?: number; servings?: number;
}

export interface PantryItem {
  id: string; name: string; quantity: string;
  location: 'pantry' | 'fridge' | 'freezer';
}

export interface RecipeState {
  recipes: Recipe[]; related: Recipe[]; selectedRecipe: Recipe | null;
  loading: boolean; error: string | null; searchQuery: string; searchCategory: string;
}

export interface PantryState { items: PantryItem[]; }
export interface MealSuggestion { recipe: Recipe; missingIngredients: string[]; }
export interface MealNight { id: string; label: string; recipe: Recipe | null; }
export interface MealPlanState { nights: MealNight[]; bag: Ingredient[]; }
