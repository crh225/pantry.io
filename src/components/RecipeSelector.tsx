import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { searchRecipes, searchByArea } from '../store/slices/recipeThunks';
import { assignRecipe } from '../store/slices/mealPlanSlice';
import { cuisines } from '../data/cuisines';
import { Recipe } from '../types';
import './RecipeSelector.css';

interface Props { nightId: string; onDone: () => void; }

export const RecipeSelector: React.FC<Props> = ({ nightId, onDone }) => {
  const { recipes, loading } = useAppSelector(s => s.recipe);
  const [searchText, setSearchText] = useState('');
  const dispatch = useAppDispatch();

  const handlePick = (r: Recipe) => { dispatch(assignRecipe({ nightId, recipe: r })); onDone(); };

  return (
    <div className="recipe-selector">
      <button className="back-btn" onClick={onDone}>← Back to Planner</button>
      <h2>Pick a Recipe</h2>
      <div className="selector-search">
        <input value={searchText} onChange={e => setSearchText(e.target.value)} placeholder="Search by name..."
          onKeyDown={e => e.key === 'Enter' && dispatch(searchRecipes(searchText))} />
        <button onClick={() => dispatch(searchRecipes(searchText))}>Search</button>
      </div>
      <div className="quick-cuisines">
        {cuisines.slice(0, 8).map(c => (
          <button key={c} onClick={() => dispatch(searchByArea(c))}>{c}</button>
        ))}
      </div>
      {loading && <p className="selector-msg">Searching...</p>}
      <div className="selector-results">
        {recipes.map(r => (
          <div key={r.id} className="selector-card" onClick={() => handlePick(r)}>
            <img src={r.thumbnail} alt={r.name} /><p>{r.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
