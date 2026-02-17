import { calculateMatchPercentage, findMatchingRecipes } from './mealPlanner';
import { Recipe, PantryItem } from '../types';

describe('mealPlanner utilities', () => {
  describe('calculateMatchPercentage', () => {
    it('should calculate correct percentage', () => {
      expect(calculateMatchPercentage(10, 3)).toBe(70);
    });

    it('should handle zero total ingredients', () => {
      expect(calculateMatchPercentage(0, 0)).toBe(0);
    });

    it('should handle 100% match', () => {
      expect(calculateMatchPercentage(10, 0)).toBe(100);
    });

    it('should handle 0% match', () => {
      expect(calculateMatchPercentage(10, 10)).toBe(0);
    });
  });

  describe('findMatchingRecipes', () => {
    const mockRecipe: Recipe = {
      id: '1',
      name: 'Test Recipe',
      category: 'Chicken',
      area: 'American',
      instructions: 'Cook it',
      thumbnail: 'test.jpg',
      ingredients: [
        { name: 'Chicken', measure: '1 lb' },
        { name: 'Salt', measure: '1 tsp' },
        { name: 'Cumin', measure: '1 tsp' },
      ],
    };

    const mockPantry: PantryItem[] = [
      { id: '1', name: 'Chicken', quantity: '2 lb', location: 'fridge' },
      { id: '2', name: 'Salt', quantity: '1 box', location: 'pantry' },
    ];

    it('should find missing ingredients', () => {
      const result = findMatchingRecipes([mockRecipe], mockPantry);
      expect(result[0].missingIngredients).toContain('Cumin');
      expect(result[0].missingIngredients.length).toBe(1);
    });

    it('should sort by fewest missing ingredients', () => {
      const recipes = [mockRecipe, { ...mockRecipe, id: '2' }];
      const result = findMatchingRecipes(recipes, mockPantry);
      expect(result.length).toBe(2);
    });
  });
});