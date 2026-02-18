import React, { useState, useMemo, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { addCartItem, setPendingSend } from '../../store/slices/krogerSlice';
import { clearBag } from '../../store/slices/mealPlanSlice';
import { addOrder } from '../../store/slices/orderHistorySlice';
import { dedup } from '../../utils/ingredientUtils';
import { useKrogerPrices, PricedItem } from '../../hooks/useKrogerPrices';
import { kroger, KrogerProduct } from '../../services/kroger';
import { ProductAlternatives } from '../kroger/ProductAlternatives';
import { CartSendBtn } from './CartSendBtn';
import './CartReview.css';

type SendStatus = 'idle' | 'sending' | 'done';

const inPantry = (name: string, pantryNames: string[]) =>
  pantryNames.some(p => p.includes(name.toLowerCase()) || name.toLowerCase().includes(p));

export const CartReview: React.FC<{ onSent: (names: string[]) => void }> = ({ onSent }) => {
  const dispatch = useAppDispatch();
  const bag = useAppSelector(s => s.mealPlan.bag);
  const pantryItems = useAppSelector(s => s.pantry.items);
  const pantryNames = useMemo(() => pantryItems.map(p => p.name.toLowerCase()), [pantryItems]);
  const unique = useMemo(() => dedup(bag), [bag]);
  const { priced: initialPriced } = useKrogerPrices(unique);

  const [priced, setPriced] = useState<PricedItem[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [quantities, setQuantities] = useState<Map<number, number>>(new Map());
  const [status, setStatus] = useState<SendStatus>('idle');

  useEffect(() => { setPriced(initialPriced); }, [initialPriced]);

  const loading = priced.some(p => p.loading);

  useEffect(() => {
    if (!loading && status === 'idle' && priced.length > 0) {
      setSelected(new Set(priced.map((p, i) => p.product?.price ? i : -1).filter(i => i >= 0)));
    }
  }, [loading, priced, status]);

  const getQty = (i: number) => quantities.get(i) || 1;
  const setQty = (i: number, q: number) =>
    setQuantities(prev => new Map(prev).set(i, Math.max(1, Math.min(99, q))));

  const toggleItem = (idx: number) =>
    setSelected(prev => { const n = new Set(prev); n.has(idx) ? n.delete(idx) : n.add(idx); return n; });

  const handleSelectAlt = (idx: number, alt: KrogerProduct) =>
    setPriced(prev => { const n = [...prev]; n[idx] = { ...n[idx], product: alt }; return n; });

  const handleSend = async () => {
    const items = priced
      .map((p, i) => ({ p, i }))
      .filter(({ p, i }) => selected.has(i) && p.product?.upc);
    if (!items.length) return;
    setStatus('sending');
    try {
      await kroger.addMultipleToCart(items.map(({ p, i }) => ({
        upc: p.product!.upc, quantity: getQty(i),
      })));
      const orderItems = items.map(({ p, i }) => {
        const qty = getQty(i);
        const cartItem = { upc: p.product!.upc, name: p.ingredient.name,
          description: p.product!.description, price: p.product!.price?.promo || p.product!.price?.regular || 0,
          quantity: qty, image: p.product!.image };
        dispatch(addCartItem(cartItem));
        return { ...cartItem, addedAt: Date.now() };
      });
      dispatch(addOrder({ sentAt: Date.now(), items: orderItems,
        total: orderItems.reduce((s, i) => s + i.price * i.quantity, 0) }));
      setStatus('done');
      dispatch(clearBag());
      dispatch(setPendingSend(false));
      onSent(items.map(({ p }) => p.ingredient.name));
    } catch {
      setStatus('idle');
    }
  };

  const inStock = priced.filter(p => p.product?.price);
  const unavailable = priced.filter(p => !p.loading && (!p.product || !p.product.price));
  const selectedTotal = priced.reduce((s, p, i) => {
    if (!selected.has(i)) return s;
    const price = p.product?.price?.promo || p.product?.price?.regular || 0;
    return s + price * getQty(i);
  }, 0);

  return (
    <div className="cart-review">
      <div className="review-header">
        <h2>Review Items</h2>
        <p>Select items to add to your Kroger cart</p>
      </div>
      {loading && <div className="review-loading"><div className="review-spinner" />Matching ingredients...</div>}
      {!loading && (
        <>
          {inStock.length > 0 && (
            <div className="review-section">
              <h3>Available ({inStock.length})</h3>
              <ul className="review-items">
                {priced.map((p, i) => !p.product?.price ? null : (
                  <li key={i} className={`review-item${selected.has(i) ? ' selected' : ''}`}>
                    <div className="review-item-main" onClick={() => toggleItem(i)}>
                      <span className="review-check">{selected.has(i) ? '\u2713' : ''}</span>
                      {p.product!.image && <img src={p.product!.image} alt="" className="review-thumb" />}
                      <div className="review-item-info">
                        <span className="review-item-name">
                          {p.ingredient.name}
                          {inPantry(p.ingredient.name, pantryNames) && <span className="pantry-flag">In Pantry</span>}
                        </span>
                        <span className="review-item-match">{p.product!.description}</span>
                        {p.product!.size && <span className="review-item-size">{p.product!.size}</span>}
                      </div>
                      <div className="review-item-price">
                        {p.product!.price!.promo ? (
                          <>
                            <span className="review-price-original">${(p.product!.price!.regular * getQty(i)).toFixed(2)}</span>
                            <span className="review-price sale">${(p.product!.price!.promo * getQty(i)).toFixed(2)}</span>
                            <span className="review-sale-badge">Save {Math.round((1 - p.product!.price!.promo / p.product!.price!.regular) * 100)}%</span>
                          </>
                        ) : (
                          <span className="review-price">${(p.product!.price!.regular * getQty(i)).toFixed(2)}</span>
                        )}
                      </div>
                    </div>
                    <div className="review-item-controls">
                      <ProductAlternatives ingredientName={p.ingredient.name} currentProduct={p.product!}
                        onSelectAlternative={alt => handleSelectAlt(i, alt)} />
                      <div className="qty-control" onClick={e => e.stopPropagation()}>
                        <button className="qty-btn" onClick={() => setQty(i, getQty(i) - 1)} disabled={getQty(i) <= 1}>-</button>
                        <span className="qty-value">{getQty(i)}</span>
                        <button className="qty-btn" onClick={() => setQty(i, getQty(i) + 1)}>+</button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {unavailable.length > 0 && (
            <div className="review-section review-unavailable">
              <h3>Not Available ({unavailable.length})</h3>
              <ul className="review-items">
                {unavailable.map(p => (
                  <li key={`u-${p.ingredient.name}`} className="review-item disabled">
                    <span className="review-check" />
                    <div className="review-item-info">
                      <span className="review-item-name">{p.ingredient.name}</span>
                      <span className="review-item-match">{p.product?.description ?? 'No match found'}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <CartSendBtn selectedCount={selected.size} total={selectedTotal}
            sending={status === 'sending'} onSend={handleSend} />
        </>
      )}
    </div>
  );
};
