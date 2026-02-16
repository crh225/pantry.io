import React from 'react';
import { useAppSelector } from '../../store/hooks';
import './RecipeDetail.css';

interface RecipeDetailProps {
  onBack: () => void;
}

export const RecipeDetail: React.FC<RecipeDetailProps> = ({ onBack }) => {
  const { selectedRecipe } = useAppSelector(state => state.recipe);

  if (!selectedRecipe) {
    return <div className="loading">Loading recipe...</div>;
  }

  return (
    <div className="recipe-detail">
      <button className="back-btn" onClick={onBack}>← Back to Results</button>
      <div className="detail-content">
        <img 
          src={selectedRecipe.thumbnail} 
          alt={selectedRecipe.name}
          className="detail-image"
        />
        <div className="detail-info">
          <h1>{selectedRecipe.name}</h1>
          <div className="detail-meta">
            <span>{selectedRecipe.category}</span>
            <span>{selectedRecipe.area}</span>
          </div>
          <h2>Ingredients</h2>
          <ul className="ingredients-list">
            {selectedRecipe.ingredients.map((ing, i) => (
              <li key={i}>{ing.measure} {ing.name}</li>
            ))}
          </ul>
          <h2>Instructions</h2>
          <p className="instructions">{selectedRecipe.instructions}</p>
        </div>
      </div>
    </div>
  );
};
