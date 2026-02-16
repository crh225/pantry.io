import React, { memo } from 'react';
import { MealSuggestion } from '../types';
import { calculateMatchPercentage } from '../utils/mealPlanner';
import './SuggestionCard.css';

interface SuggestionCardProps {
  suggestion: MealSuggestion;
}

export const SuggestionCard = memo<SuggestionCardProps>(({ suggestion }) => {
  const { recipe, missingIngredients } = suggestion;
  const matchPct = calculateMatchPercentage(
    recipe.ingredients.length,
    missingIngredients.length
  );

  return (
    <div className="suggestion-card">
      <img 
        src={recipe.thumbnail} 
        alt={recipe.name} 
        className="suggestion-image"
        loading="lazy"
      />
      <div className="suggestion-info">
        <h3>{recipe.name}</h3>
        <div className="match-score">{matchPct}% Match</div>
        {missingIngredients.length > 0 && (
          <div className="missing-items">
            <strong>Need to buy:</strong>
            <ul>
              {missingIngredients.slice(0, 3).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
              {missingIngredients.length > 3 && (
                <li>+{missingIngredients.length - 3} more</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
});

SuggestionCard.displayName = 'SuggestionCard';
