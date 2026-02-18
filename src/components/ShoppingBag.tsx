import React, { useMemo } from 'react';
import { useAppDispatch } from '../store/hooks';
import { removeFromBag, clearBag } from '../store/slices/mealPlanSlice';
import { Ingredient } from '../types';
import { useKrogerPrices } from '../hooks/useKrogerPrices';
import './ShoppingBag.css';

interface Props { bag: Ingredient[]; }

// Phrases that indicate prep instructions, not the ingredient itself
const PREP_SUFFIXES = /,?\s+(chopped|minced|diced|sliced|grated|crushed|peeled|deveined|julienned|shredded|melted|softened|cubed|halved|quartered|divided|to taste|for garnish|for serving|as needed|optional|finely|coarsely|freshly|thinly).*$/i;
const PREP_PREFIXES = /^(fresh|freshly|dried|ground|large|small|medium|extra|thick|thin|boneless|skinless)\s+/i;
const COMPOUND_SEASONING = /^salt\s+and\s+pepper/i;

// Items that are basically free/universal — skip them in the shopping bag
const SKIP_ITEMS = new Set([
  'salt', 'pepper', 'black pepper', 'white pepper', 'water', 'ice',
  'cooking spray', 'salt and pepper', 'salt and pepper to taste',
  'kosher salt', 'sea salt',
]);

const cleanName = (name: string): string => {
  let n = name.trim();
  if (COMPOUND_SEASONING.test(n)) return '';  // filter out entirely
  n = n.replace(PREP_SUFFIXES, '');
  n = n.replace(PREP_PREFIXES, '');
  return n.trim();
};

const dedup = (bag: Ingredient[]): Ingredient[] => {
  const map = new Map<string, Ingredient>();
  bag.forEach(i => {
    const cleaned = cleanName(i.name);
    if (!cleaned) return;
    const key = cleaned.toLowerCase();
    if (SKIP_ITEMS.has(key)) return;
    if (!map.has(key)) map.set(key, { ...i, name: cleaned });
  });
  return Array.from(map.values());
};

export const ShoppingBag: React.FC<Props> = ({ bag }) => {
  const dispatch = useAppDispatch();
  const unique = useMemo(() => dedup(bag), [bag]);
  const { priced, total, available } = useKrogerPrices(unique);

  const handleExport = () => {
    const text = unique.map(i => `${i.measure} ${i.name}`).join('\n');
    navigator.clipboard.writeText(text);
  };

  if (unique.length === 0) return null;

  return (
    <div className="shopping-bag">
      <div className="bag-header">
        <h2><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{verticalAlign:'middle',marginRight:4}}><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg> Shopping Bag ({unique.length})</h2>
        {available && total > 0 && <span className="bag-total">~${total.toFixed(2)}</span>}
      </div>
      <ul className="bag-items">
        {priced.map((p, i) => (
          <li key={i}>
            <span className="bag-item-name">{p.ingredient.name}</span>
            {p.loading && <span className="bag-price">…</span>}
            {p.product?.price && <span className="bag-price">${p.product.price.regular.toFixed(2)}</span>}
            <button onClick={() => dispatch(removeFromBag(p.ingredient.name))} className="remove-item">×</button>
          </li>
        ))}
      </ul>
      <div className="bag-footer">
        <button onClick={handleExport} className="copy-btn"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{verticalAlign:'middle',marginRight:3}}><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy</button>
        <button onClick={() => dispatch(clearBag())} className="clear-btn">Clear</button>
      </div>
    </div>
  );
};
