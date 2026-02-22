import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { assignRecipe, addToBag } from '../../store/slices/mealPlanSlice';
import { isIngredientAvailable } from '../../utils/ingredientMatch';
import { NightPicker } from './NightPicker';
import { DetailTags } from './DetailTags';
import { IngredientsSection } from './IngredientsSection';
import { InstructionsSection } from './InstructionsSection';
import { RecipeActions } from './RecipeActions';
import './RecipeDetail.css';

export const RecipeDetail: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { selectedRecipe } = useAppSelector(s => s.recipe);
  const { nights, bag } = useAppSelector(s => s.mealPlan);
  const pantryItems = useAppSelector(s => s.pantry.items);
  const dispatch = useAppDispatch();
  const [showPicker, setShowPicker] = useState(false);
  const [added, setAdded] = useState(false);
  const [addedToBag, setAddedToBag] = useState(false);
  const pantryNames = pantryItems.map(i => i.name.toLowerCase());
  const bagNames = bag.map(b => b.name.toLowerCase());
  if (!selectedRecipe) return <div className="loading">Loading recipe...</div>;
  const paragraphs = selectedRecipe.instructions.split('\n').map(p => p.trim()).filter(p => p && !/^[\d▢\s.-]*$/.test(p) && p.length > 3);
  const handleAssign = (nightId: string) => {
    dispatch(assignRecipe({ nightId, recipe: selectedRecipe }));
    setShowPicker(false); setAdded(true); setTimeout(() => setAdded(false), 2000);
  };
  const ingredients = selectedRecipe.ingredients.map(ing => ({ ...ing, inPantry: isIngredientAvailable(ing.name, pantryNames) }));
  const needToBuy = ingredients.filter(i => !i.inPantry);
  const notInBag = needToBuy.filter(i => !bagNames.includes(i.name.toLowerCase()));
  const allInBag = needToBuy.length > 0 && notInBag.length === 0;
  const handleAddMissing = () => {
    if (notInBag.length > 0) { dispatch(addToBag(notInBag.map(i => ({ name: i.name, measure: i.measure })))); setAddedToBag(true); setTimeout(() => setAddedToBag(false), 2000); }
  };
  return (
    <div className="recipe-detail">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <div className="detail-hero"><img src={selectedRecipe.thumbnail} alt={selectedRecipe.name} /></div>
      <div className="detail-body">
        <div className="detail-title-row">
          <h1>{selectedRecipe.name}</h1>
          <RecipeActions needToBuyCount={notInBag.length} allInBag={allInBag} addedToBag={addedToBag} added={added}
            onAddMissing={handleAddMissing} onTogglePicker={() => setShowPicker(!showPicker)} />
        </div>
        {showPicker && <NightPicker nights={nights} onPick={handleAssign} />}
        <DetailTags recipe={selectedRecipe} />
        <IngredientsSection ingredients={ingredients} />
        <InstructionsSection paragraphs={paragraphs} />
        {selectedRecipe.sourceUrl && <a className="recipe-source-link" href={selectedRecipe.sourceUrl} target="_blank" rel="noopener noreferrer">View Full Recipe →</a>}
      </div>
    </div>
  );
};
