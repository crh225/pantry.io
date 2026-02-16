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

  const paragraphs = selectedRecipe.instructions
    .split('\n')
    .filter(p => p.trim());

  return (
    <div className="recipe-detail">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <div className="detail-hero">
        <img src={selectedRecipe.thumbnail} alt={selectedRecipe.name} />
      </div>
      <div className="detail-body">
        <h1>{selectedRecipe.name}</h1>
        <div className="detail-tags">
          {selectedRecipe.category && <span className="tag">{selectedRecipe.category}</span>}
          {selectedRecipe.area && <span className="tag">{selectedRecipe.area}</span>}
        </div>
        <section className="detail-section">
          <h2>Ingredients</h2>
          <ul className="ingredients-grid">
            {selectedRecipe.ingredients.map((ing, i) => (
              <li key={i}>
                <span className="ing-measure">{ing.measure}</span>
                <span className="ing-name">{ing.name}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="detail-section">
          <h2>Instructions</h2>
          <div className="instructions-text">
            {paragraphs.map((p, i) => (
              <p key={i}>{p.trim()}</p>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
