import { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (!available || items.length === 0) {
      setPriced(items.map(i => ({ ingredient: i, product: null, loading: false })));
      return;
    }
    setPriced(items.map(i => ({ ingredient: i, product: null, loading: true })));
    items.forEach((ing, idx) => {
      kroger.searchProducts(ing.name).then(results => {
        setPriced(prev => {
          const next = [...prev];
          next[idx] = { ingredient: ing, product: results[0] || null, loading: false };
          return next;
        });
      }).catch(() => {
        setPriced(prev => {
          const next = [...prev];
          next[idx] = { ingredient: ing, product: null, loading: false };
          return next;
        });
      });
    });
  }, [items, available]);

  const total = priced.reduce((sum, p) => sum + (p.product?.price?.regular || 0), 0);
  return { priced, total, available };
};
