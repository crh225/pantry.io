import React, { useState, useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { assignRecipe } from '../../store/slices/mealPlanSlice';
import { isIngredientAvailable } from '../../utils/ingredientMatch';
import { NightPicker } from './NightPicker';
import { DetailTags } from './DetailTags';
import { IngredientsSection } from './IngredientsSection';
import { InstructionsSection } from './InstructionsSection';
import './RecipeDetail.css';

export const RecipeDetail: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { selectedRecipe } = useAppSelector(s => s.recipe);
  const { nights } = useAppSelector(s => s.mealPlan);
  const pantryItems = useAppSelector(s => s.pantry.items);
  const dispatch = useAppDispatch();
  const [showPicker, setShowPicker] = useState(false); const [added, setAdded] = useState(false);

  const pantryNames = useMemo(() => pantryItems.map(i => i.name.toLowerCase()), [pantryItems]);
  if (!selectedRecipe) return <div className="loading">Loading recipe...</div>;

  const paragraphs = selectedRecipe.instructions.split('\n').filter(p => p.trim());
  const handleAssign = (nightId: string) => {
    dispatch(assignRecipe({ nightId, recipe: selectedRecipe }));
    setShowPicker(false); setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };
  const ingredients = selectedRecipe.ingredients.map(ing => ({
    ...ing,
    inPantry: isIngredientAvailable(ing.name, pantryNames),
  }));

  return (
    <div className="recipe-detail">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <div className="detail-hero"><img src={selectedRecipe.thumbnail} alt={selectedRecipe.name} /></div>
      <div className="detail-body">
        <div className="detail-title-row">
          <h1>{selectedRecipe.name}</h1>
          <button className="add-night-btn" onClick={() => setShowPicker(!showPicker)}>
            {added ? '✓ Added!' : '+ Add to Meal'}
          </button>
        </div>
        {showPicker && <NightPicker nights={nights} onPick={handleAssign} />}
        <DetailTags recipe={selectedRecipe} />
        <IngredientsSection ingredients={ingredients} />
        <InstructionsSection paragraphs={paragraphs} />
      </div>
    </div>
  );
};
