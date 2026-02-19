import React, { useState } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { addCartItem } from '../../store/slices/krogerSlice';
import { kroger, KrogerProduct } from '../../services/kroger';
import { CartSearchResult } from './CartSearchResult';
import './CartSearch.css';

export const CartSearch: React.FC = () => {
  const dispatch = useAppDispatch();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<KrogerProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState<Set<string>>(new Set());
  const [quantities, setQuantities] = useState<Map<string, number>>(new Map());

  const getQty = (upc: string) => quantities.get(upc) || 1;
  const setQty = (upc: string, q: number) => setQuantities(prev => new Map(prev).set(upc, Math.max(1, Math.min(99, q))));

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try { setResults(await kroger.searchProducts(query.trim())); } catch { setResults([]); }
    setLoading(false);
  };

  const handleAdd = async (product: KrogerProduct) => {
    if (!product.upc || !product.price) return;
    const qty = getQty(product.upc);
    try {
      await kroger.addToCart(product.upc, qty);
      dispatch(addCartItem({ upc: product.upc, name: product.description, description: product.description,
        price: product.price.promo || product.price.regular, quantity: qty, image: product.image }));
      setAdded(prev => new Set(prev).add(product.upc));
    } catch {}
  };

  return (
    <div className="cart-search">
      <div className="cart-search-bar">
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search Kroger products..."
          onKeyDown={e => e.key === 'Enter' && handleSearch()} />
        <button onClick={handleSearch} disabled={loading}>{loading ? '...' : 'Search'}</button>
      </div>
      {results.length > 0 && <ul className="cart-search-results">
        {results.map(p => <CartSearchResult key={p.upc} product={p} qty={getQty(p.upc)}
          added={added.has(p.upc)} onSetQty={q => setQty(p.upc, q)} onAdd={() => handleAdd(p)} />)}
      </ul>}
    </div>
  );
};
