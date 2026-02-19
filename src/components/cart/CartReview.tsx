import React, { useState, useMemo, useEffect } from 'react';
import { useAppSelector } from '../../store/hooks';
import { dedup } from '../../utils/ingredientUtils';
import { useKrogerPrices, PricedItem } from '../../hooks/useKrogerPrices';
import { KrogerProduct } from '../../services/kroger';
import { CartReviewItem } from './CartReviewItem';
import { CartUnavailableList } from './CartUnavailableList';
import { CartSendBtn } from './CartSendBtn';
import { useCartSend } from './useCartSend';
import './CartReview.css';

const inPantry = (n: string, pn: string[]) => pn.some(p => p.includes(n.toLowerCase()) || n.toLowerCase().includes(p));

export const CartReview: React.FC<{ onSent: (names: string[]) => void }> = ({ onSent }) => {
  const bag = useAppSelector(s => s.mealPlan.bag);
  const pi = useAppSelector(s => s.pantry.items);
  const pn = useMemo(() => pi.map(p => p.name.toLowerCase()), [pi]);
  const unique = useMemo(() => dedup(bag), [bag]);
  const { priced: init } = useKrogerPrices(unique);
  const [priced, setPriced] = useState<PricedItem[]>([]);
  const [sel, setSel] = useState<Set<number>>(new Set());
  const [qtys, setQtys] = useState<Map<number, number>>(new Map());
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle');
  useEffect(() => { setPriced(init); }, [init]);
  const loading = priced.some(p => p.loading);
  useEffect(() => {
    if (!loading && status === 'idle' && priced.length > 0)
      setSel(new Set(priced.map((p, i) => p.product?.price ? i : -1).filter(i => i >= 0)));
  }, [loading, priced, status]);
  const getQ = (i: number) => qtys.get(i) || 1;
  const setQ = (i: number, q: number) => setQtys(prev => new Map(prev).set(i, Math.max(1, Math.min(99, q))));
  const toggle = (i: number) => setSel(prev => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n; });
  const swapAlt = (i: number, alt: KrogerProduct) => setPriced(prev => { const n = [...prev]; n[i] = { ...n[i], product: alt }; return n; });
  const handleSend = useCartSend(priced, sel, getQ, onSent, setStatus);
  const unavail = priced.filter(p => !p.loading && (!p.product || !p.product.price));
  const avail = priced.filter(p => p.product?.price);
  const total = priced.reduce((s, p, i) => !sel.has(i) ? s : s + (p.product?.price?.promo || p.product?.price?.regular || 0) * getQ(i), 0);
  return (
    <div className="cart-review">
      <div className="review-header"><h2>Review Items</h2><p>Select items to add to your Kroger cart</p></div>
      {loading && <div className="review-loading"><div className="review-spinner" />Matching ingredients...</div>}
      {!loading && <>
        {avail.length > 0 && <div className="review-section"><h3>Available ({avail.length})</h3><ul className="review-items">
          {priced.map((p, i) => !p.product?.price ? null : <CartReviewItem key={i} item={p} idx={i} selected={sel.has(i)}
            qty={getQ(i)} inPantry={inPantry(p.ingredient.name, pn)} onToggle={() => toggle(i)} onSetQty={q => setQ(i, q)} onSelectAlt={alt => swapAlt(i, alt)} />)}
        </ul></div>}
        <CartUnavailableList items={unavail} />
        <CartSendBtn selectedCount={sel.size} total={total} sending={status === 'sending'} onSend={handleSend} />
      </>}
    </div>
  );
};
