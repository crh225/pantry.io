import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { assignRecipe, addToBag } from '../../store/slices/mealPlanSlice';
import { isIngredientAvailable } from '../../utils/ingredientMatch';
import { NightPicker } from './NightPicker';
import { DetailTags } from './DetailTags';
import { IngredientsSection } from './IngredientsSection';
import { InstructionsSection } from './InstructionsSection';
import { Ingredient } from '../../types';
import './RecipeDetail.css';

const CartSidebar: React.FC<{ missing: (Ingredient & { inPantry: boolean })[] }> = ({ missing }) => {
  const dispatch = useAppDispatch();
  const bag = useAppSelector(s => s.mealPlan.bag);
  const bagNames = bag.map(b => b.name.toLowerCase());
  const needToBuy = missing.filter(i => !i.inPantry);

  if (needToBuy.length === 0) return (
    <aside className="cart-sidebar">
      <h3><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{verticalAlign:'middle',marginRight:6}}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>All in Pantry</h3>
      <p className="sidebar-note">You have everything you need!</p>
    </aside>
  );

  const handleAddAll = () => {
    const toAdd = needToBuy.filter(i => !bagNames.includes(i.name.toLowerCase()));
    if (toAdd.length > 0) dispatch(addToBag(toAdd.map(i => ({ name: i.name, measure: i.measure }))));
  };

  return (
    <aside className="cart-sidebar">
      <h3>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{verticalAlign:'middle',marginRight:6}}><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
        Need to Buy ({needToBuy.length})
      </h3>
      <ul className="sidebar-items">
        {needToBuy.map((ing, i) => {
          const inBag = bagNames.includes(ing.name.toLowerCase());
          return (
            <li key={i} className={inBag ? 'in-bag' : ''}>
              <span className="sidebar-item-name">{ing.name}</span>
              {ing.measure && <span className="sidebar-item-measure">{ing.measure}</span>}
              {inBag && <span className="sidebar-in-bag-badge">In Bag</span>}
            </li>
          );
        })}
      </ul>
      <button className="sidebar-add-all" onClick={handleAddAll}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Add All to Bag
      </button>
    </aside>
  );
};

export const RecipeDetail: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { selectedRecipe } = useAppSelector(s => s.recipe);
  const { nights } = useAppSelector(s => s.mealPlan);
  const pantryItems = useAppSelector(s => s.pantry.items);
  const dispatch = useAppDispatch();
  const [showPicker, setShowPicker] = useState(false);
  const [added, setAdded] = useState(false);

  const pantryNames = pantryItems.map(i => i.name.toLowerCase());
  if (!selectedRecipe) return <div className="loading">Loading recipe...</div>;

  const paragraphs = selectedRecipe.instructions.split('\n').filter(p => p.trim());
  const handleAssign = (nightId: string) => {
    dispatch(assignRecipe({ nightId, recipe: selectedRecipe }));
    setShowPicker(false);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };
  const ingredients = selectedRecipe.ingredients.map(ing => ({
    ...ing,
    inPantry: isIngredientAvailable(ing.name, pantryNames),
  }));

  return (
    <div className="recipe-detail-layout">
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
          {selectedRecipe.sourceUrl && (
            <a className="recipe-source-link" href={selectedRecipe.sourceUrl}
              target="_blank" rel="noopener noreferrer">
              View Full Recipe →
            </a>
          )}
        </div>
      </div>
      <CartSidebar missing={ingredients} />
    </div>
  );
};