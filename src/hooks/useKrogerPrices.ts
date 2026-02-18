import { useState, useEffect, useRef } from 'react';
import { kroger, KrogerProduct } from '../services/kroger';
import { Ingredient } from '../types';

export interface PricedItem {
  ingredient: Ingredient;
  product: KrogerProduct | null;
  loading: boolean;
}

export const useKrogerPrices = (items: Ingredient[]) => {
  const [priced, setPriced] = useState<PricedItem[]>([]);
  const available = kroger.isConfigured();
  // Use a stable string key so re-renders with the same ingredients don't refetch
  const key = items.map(i => i.name).join('|');
  const itemsRef = useRef(items);
  itemsRef.current = items;

  useEffect(() => {
    const currentItems = itemsRef.current;
    if (!available || currentItems.length === 0) {
      setPriced(currentItems.map(i => ({ ingredient: i, product: null, loading: false })));
      return;
    }
    let cancelled = false;
    setPriced(currentItems.map(i => ({ ingredient: i, product: null, loading: true })));
    currentItems.forEach((ing, idx) => {
      kroger.searchProducts(ing.name).then(results => {
        if (cancelled) return;
        setPriced(prev => {
          const next = [...prev];
          next[idx] = { ingredient: ing, product: results[0] || null, loading: false };
          return next;
        });
      }).catch(() => {
        if (cancelled) return;
        setPriced(prev => {
          const next = [...prev];
          next[idx] = { ingredient: ing, product: null, loading: false };
          return next;
        });
      });
    });
    return () => { cancelled = true; };
  }, [key, available]);

  const total = priced.reduce((sum, p) => sum + (p.product?.price?.promo || p.product?.price?.regular || 0), 0);
  return { priced, total, available };
};
