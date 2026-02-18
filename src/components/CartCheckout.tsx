import React, { useState, useMemo } from 'react';
import { Ingredient } from '../types';
import { useKrogerPrices, PricedItem } from '../hooks/useKrogerPrices';
import { kroger, KrogerProduct } from '../services/kroger';
import { useAppDispatch } from '../store/hooks';
import { addCartItem } from '../store/slices/krogerSlice';
import { ProductAlternatives } from './kroger/ProductAlternatives';
import './CartCheckout.css';

interface Props {
  bag: Ingredient[];
  onBack: () => void;
}

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
const SKIP_ITEMS = new Set([
  'salt', 'pepper', 'black pepper', 'white pepper', 'water', 'ice',
  'cooking spray', 'salt and pepper', 'salt and pepper to taste',
  'kosher salt', 'sea salt',
]);

const cleanName = (name: string): string => {
  let n = name.trim();
  if (COMPOUND_SEASONING.test(n)) return '';
  n = n.replace(PREP_PATTERN, ' ');
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

type SendStatus = 'idle' | 'sending' | 'done';
interface ItemResult { upc: string; name: string; success: boolean; error?: string }

export const CartCheckout: React.FC<Props> = ({ bag, onBack }) => {
  const unique = useMemo(() => dedup(bag), [bag]);
  const { priced: initialPriced } = useKrogerPrices(unique);
  const dispatch = useAppDispatch();

  // Local state for priced items (allows updating when user selects alternative)
  const [priced, setPriced] = useState<PricedItem[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [status, setStatus] = useState<SendStatus>('idle');
  const [results, setResults] = useState<ItemResult[]>([]);
  const [progress, setProgress] = useState(0);

  // Sync initial priced items
  React.useEffect(() => {
    setPriced(initialPriced);
  }, [initialPriced]);

  const loading = priced.some(p => p.loading);
  const inStock = priced.filter(p => p.product && p.product.price);
  const notFound = priced.filter(p => !p.loading && !p.product);
  const noPrice = priced.filter(p => !p.loading && p.product && !p.product.price);

  // Auto-select all in-stock items once loading finishes
  React.useEffect(() => {
    if (!loading && status === 'idle' && priced.length > 0) {
      const indices = new Set<number>();
      priced.forEach((p, i) => {
        if (p.product && p.product.price) indices.add(i);
      });
      setSelected(indices);
    }
  }, [loading, priced, status]);

  const toggleItem = (idx: number) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const handleSelectAlternative = (idx: number, alt: KrogerProduct) => {
    setPriced(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], product: alt };
      return next;
    });
  };

  const selectedItems = priced.filter((_, i) => selected.has(i));
  const selectedTotal = selectedItems.reduce((sum, p) => sum + (p.product?.price?.regular || 0), 0);

  const handleSend = async () => {
    const items = selectedItems.filter(p => p.product?.upc);
    if (items.length === 0) return;

    setStatus('sending');
    setProgress(0);

    // Build batch request
    const cartItems = items.map(p => ({ upc: p.product!.upc, quantity: 1 }));

    try {
      // Single API call to add all items
      await kroger.addMultipleToCart(cartItems);

      // Track all items in Redux
      const itemResults: ItemResult[] = items.map(p => {
        dispatch(addCartItem({
          upc: p.product!.upc,
          name: p.ingredient.name,
          description: p.product!.description,
          price: p.product!.price?.regular || 0,
          quantity: 1,
          image: p.product!.image,
        }));
        return { upc: p.product!.upc, name: p.ingredient.name, success: true };
      });

      setProgress(items.length);
      setResults(itemResults);
    } catch (e: any) {
      // If batch fails, mark all as failed
      const itemResults: ItemResult[] = items.map(p => ({
        upc: p.product!.upc,
        name: p.ingredient.name,
        success: false,
        error: e.message,
      }));
      setResults(itemResults);
    }

    setStatus('done');
  };

  const successCount = results.filter(r => r.success).length;
  const failCount = results.filter(r => !r.success).length;

  return (
    <div className="cart-checkout">
      <button className="checkout-back" onClick={onBack}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        Back to Planner
      </button>

      <div className="checkout-header">
        <h2>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          Send to Kroger Cart
        </h2>
        <p>Review items before adding to your Kroger cart</p>
      </div>

      {loading && (
        <div className="checkout-loading">
          <div className="checkout-spinner" />
          Matching ingredients to Kroger products...
        </div>
      )}

      {!loading && status === 'idle' && (
        <>
          {/* In-stock items */}
          {inStock.length > 0 && (
            <div className="checkout-section">
              <h3>Available ({inStock.length})</h3>
              <ul className="checkout-items">
                {priced.map((p, i) => {
                  if (!p.product || !p.product.price) return null;
                  return (
                    <li key={i} className={selected.has(i) ? 'checkout-item selected' : 'checkout-item'}>
                      <div className="checkout-item-main" onClick={() => toggleItem(i)}>
                        <span className="checkout-check">{selected.has(i) ? '\u2713' : ''}</span>
                        {p.product.image && <img src={p.product.image} alt="" className="checkout-thumb" />}
                        <div className="checkout-item-info">
                          <span className="checkout-item-name">{p.ingredient.name}</span>
                          <span className="checkout-item-match">{p.product.description}</span>
                          {p.product.size && <span className="checkout-item-size">{p.product.size}</span>}
                        </div>
                        <div className="checkout-item-price">
                          <span className="checkout-price">${p.product.price.regular.toFixed(2)}</span>
                          {p.product.price.promo && <span className="checkout-promo">Sale ${p.product.price.promo.toFixed(2)}</span>}
                        </div>
                      </div>
                      <ProductAlternatives
                        ingredientName={p.ingredient.name}
                        currentProduct={p.product}
                        onSelectAlternative={(alt) => handleSelectAlternative(i, alt)}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Not found items */}
          {(notFound.length > 0 || noPrice.length > 0) && (
            <div className="checkout-section checkout-unavailable">
              <h3>Not Available ({notFound.length + noPrice.length})</h3>
              <ul className="checkout-items">
                {notFound.map((p, i) => (
                  <li key={`nf-${i}`} className="checkout-item disabled">
                    <span className="checkout-check" />
                    <div className="checkout-item-info">
                      <span className="checkout-item-name">{p.ingredient.name}</span>
                      <span className="checkout-item-match">No match found</span>
                    </div>
                  </li>
                ))}
                {noPrice.map((p, i) => (
                  <li key={`np-${i}`} className="checkout-item disabled">
                    <span className="checkout-check" />
                    <div className="checkout-item-info">
                      <span className="checkout-item-name">{p.ingredient.name}</span>
                      <span className="checkout-item-match">{p.product?.description} — no price available</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Footer */}
          <div className="checkout-footer">
            <div className="checkout-summary">
              <span>{selected.size} item{selected.size !== 1 ? 's' : ''} selected</span>
              <span className="checkout-total">~${selectedTotal.toFixed(2)}</span>
            </div>
            <button className="checkout-send-btn" onClick={handleSend} disabled={selected.size === 0}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              Add {selected.size} Item{selected.size !== 1 ? 's' : ''} to Kroger Cart
            </button>
          </div>
        </>
      )}

      {/* Sending progress */}
      {status === 'sending' && (
        <div className="checkout-progress">
          <div className="checkout-progress-bar">
            <div className="checkout-progress-fill" style={{ width: `${(progress / selectedItems.length) * 100}%` }} />
          </div>
          <p>Adding items... {progress} / {selectedItems.length}</p>
        </div>
      )}

      {/* Results */}
      {status === 'done' && (
        <div className="checkout-results">
          <div className="checkout-results-summary">
            {failCount === 0 ? (
              <div className="checkout-success">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                <h3>All {successCount} items added to your Kroger cart!</h3>
              </div>
            ) : (
              <div className="checkout-partial">
                <h3>{successCount} added, {failCount} failed</h3>
              </div>
            )}
          </div>
          <ul className="checkout-result-list">
            {results.map((r, i) => (
              <li key={i} className={r.success ? 'result-ok' : 'result-fail'}>
                <span className="result-icon">{r.success ? '\u2713' : '\u2717'}</span>
                <span>{r.name}</span>
                {r.error && <span className="result-error">{r.error}</span>}
              </li>
            ))}
          </ul>
          <div className="checkout-footer">
            <button className="checkout-done-btn" onClick={onBack}>Done</button>
          </div>
        </div>
      )}
    </div>
  );
};
