import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { searchRecipes } from '../store/slices/recipeThunks';
import { findMatchingRecipes } from '../utils/mealPlanner';
import { SuggestionCard } from './SuggestionCard';
import { ShoppingList } from './ShoppingList';
import { MealSuggestion } from '../types';
import './MealPlannerPage.css';

export const MealPlannerPage: React.FC = () => {
  const { items } = useAppSelector(state => state.pantry);
  const { recipes } = useAppSelector(state => state.recipe);
  const dispatch = useAppDispatch();
  const [suggestions, setSuggestions] = useState<MealSuggestion[]>([]);
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [shoppingItems, setShoppingItems] = useState<string[]>([]);

  useEffect(() => {
    if (items.length > 0 && recipes.length > 0) {
      const matches = findMatchingRecipes(recipes, items);
      setSuggestions(matches.slice(0, 10));
    }
  }, [items, recipes]);

  const handleSearch = () => {
    dispatch(searchRecipes('chicken'));
  };

  const handleGenerateShoppingList = () => {
    const allMissing = suggestions
      .flatMap(s => s.missingIngredients)
      .filter((item, index, self) => self.indexOf(item) === index);
    setShoppingItems(allMissing);
    setShowShoppingList(true);
  };

  if (items.length === 0) {
    return (
      <div className="meal-planner-empty">
        <h2>Add items to your pantry first!</h2>
        <p>Go to "My Pantry" to add what you have on hand.</p>
      </div>
    );
  }

  return (
    <div className="meal-planner">
      <h1>Meal Planner</h1>
      <p>Find recipes based on what you have</p>
      <div className="planner-actions">
        <button className="search-btn" onClick={handleSearch}>Find Recipes</button>
        {suggestions.length > 0 && (
          <button className="shopping-btn" onClick={handleGenerateShoppingList}>
            Generate Shopping List
          </button>
        )}
      </div>
      <div className="suggestions-list">
        {suggestions.map(suggestion => (
          <SuggestionCard key={suggestion.recipe.id} suggestion={suggestion} />
        ))}
      </div>
      {showShoppingList && (
        <ShoppingList items={shoppingItems} onClose={() => setShowShoppingList(false)} />
      )}
    </div>
  );
};
