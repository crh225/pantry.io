import React, { useMemo } from 'react';
import { useAppDispatch } from '../store/hooks';
import { removeFromBag } from '../store/slices/mealPlanSlice';
import { kroger } from '../services/kroger';
import { Ingredient } from '../types';
import { useKrogerPrices } from '../hooks/useKrogerPrices';
import './ShoppingBag.css';

interface Props { bag: Ingredient[]; onCheckout?: () => void; }

// Prep words to remove (as suffixes like "tomatoes, diced" or prefixes like "diced tomatoes")
const PREP_WORDS = [
  'chopped', 'minced', 'diced', 'sliced', 'grated', 'crushed', 'peeled',
  'deveined', 'julienned', 'shredded', 'melted', 'softened', 'cubed',
  'halved', 'quartered', 'divided', 'crumbled', 'torn', 'beaten', 'whisked',
  'room temperature', 'at room temperature', 'warmed', 'chilled', 'frozen',
  'thawed', 'rinsed', 'drained', 'patted dry', 'trimmed', 'cored', 'seeded',
  'deseeded', 'pitted', 'zested', 'juiced', 'separated', 'sifted',
  'to taste', 'for garnish', 'for serving', 'as needed', 'optional',
  'finely', 'coarsely', 'freshly', 'thinly', 'roughly', 'lightly',
  'fresh', 'dried', 'ground', 'whole', 'raw', 'cooked',
  'large', 'small', 'medium', 'extra', 'thick', 'thin',
  'boneless', 'skinless', 'bone-in', 'skin-on',
  'packed', 'loosely packed', 'firmly packed',
];
const PREP_PATTERN = new RegExp(
  `(,?\\s*\\b(${PREP_WORDS.join('|')})\\b\\s*)+`, 'gi'
);
const COMPOUND_SEASONING = /^salt\s+and\s+pepper/i;

// Items that are basically free/universal — skip them in the shopping bag
const SKIP_ITEMS = new Set([
  'salt', 'pepper', 'black pepper', 'white pepper', 'water', 'ice',
  'cooking spray', 'salt and pepper', 'salt and pepper to taste',
  'kosher salt', 'sea salt',
]);

const cleanName = (name: string): string => {
  let n = name.trim();
  if (COMPOUND_SEASONING.test(n)) return '';
  // Remove prep words from anywhere in the string
  n = n.replace(PREP_PATTERN, ' ');
  // Clean up extra spaces and commas
  n = n.replace(/\s+/g, ' ').replace(/^[,\s]+|[,\s]+$/g, '').trim();
  return n;
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

export const ShoppingBag: React.FC<Props> = ({ bag, onCheckout }) => {
  const dispatch = useAppDispatch();
  const unique = useMemo(() => dedup(bag), [bag]);
  const { priced, total, available } = useKrogerPrices(unique);

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
      {kroger.isConfigured() && kroger.isLoggedIn() && onCheckout && (
        <button onClick={onCheckout} className="kroger-cart-btn">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{verticalAlign:'middle',marginRight:4}}><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          Send to Kroger Cart
        </button>
      )}
    </div>
  );
};
