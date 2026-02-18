import React, { useState } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { addCartItem } from '../../store/slices/krogerSlice';
import { kroger, KrogerProduct } from '../../services/kroger';
import './CartSearch.css';

export const CartSearch: React.FC = () => {
  const dispatch = useAppDispatch();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<KrogerProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState<Set<string>>(new Set());
  const [quantities, setQuantities] = useState<Map<string, number>>(new Map());

  const getQty = (upc: string) => quantities.get(upc) || 1;
  const setQty = (upc: string, q: number) =>
    setQuantities(prev => new Map(prev).set(upc, Math.max(1, Math.min(99, q))));

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const products = await kroger.searchProducts(query.trim());
      setResults(products);
    } catch { setResults([]); }
    setLoading(false);
  };

  const handleAdd = async (product: KrogerProduct) => {
    if (!product.upc || !product.price) return;
    const qty = getQty(product.upc);
    try {
      await kroger.addToCart(product.upc, qty);
      const item = { upc: product.upc, name: product.description, description: product.description,
        price: product.price.promo || product.price.regular, quantity: qty, image: product.image };
      dispatch(addCartItem(item));
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
      {results.length > 0 && (
        <ul className="cart-search-results">
          {results.map(p => (
            <li key={p.upc} className="search-result-item">
              {p.image && <img src={p.image} alt="" className="search-result-img" />}
              <div className="search-result-info">
                <span className="search-result-name">{p.description}</span>
                {p.size && <span className="search-result-size">{p.size}</span>}
              </div>
              {p.price && (
                <div className="search-result-price">
                  {p.price.promo ? (
                    <><span className="search-price-original">${p.price.regular.toFixed(2)}</span>
                    <span className="search-price-sale">${p.price.promo.toFixed(2)}</span></>
                  ) : (
                    <span>${p.price.regular.toFixed(2)}</span>
                  )}
                </div>
              )}
              <div className="search-qty-control">
                <button className="qty-btn" onClick={() => setQty(p.upc, getQty(p.upc) - 1)} disabled={getQty(p.upc) <= 1 || added.has(p.upc)}>-</button>
                <span className="qty-value">{getQty(p.upc)}</span>
                <button className="qty-btn" onClick={() => setQty(p.upc, getQty(p.upc) + 1)} disabled={added.has(p.upc)}>+</button>
              </div>
              <button className="search-add-btn" onClick={() => handleAdd(p)}
                disabled={added.has(p.upc) || !p.price}>
                {added.has(p.upc) ? 'Added' : 'Add'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
