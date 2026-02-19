import React, { useState, useMemo, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { addCartItem, setPendingSend } from '../../store/slices/krogerSlice';
import { clearBag } from '../../store/slices/mealPlanSlice';
import { addOrder } from '../../store/slices/orderHistorySlice';
import { dedup } from '../../utils/ingredientUtils';
import { useKrogerPrices, PricedItem } from '../../hooks/useKrogerPrices';
import { kroger, KrogerProduct } from '../../services/kroger';
import { CartReviewItem } from './CartReviewItem';
import { CartSendBtn } from './CartSendBtn';
import './CartReview.css';

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
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle');

  useEffect(() => { setPriced(initialPriced); }, [initialPriced]);
  const loading = priced.some(p => p.loading);
  useEffect(() => {
    if (!loading && status === 'idle' && priced.length > 0)
      setSelected(new Set(priced.map((p, i) => p.product?.price ? i : -1).filter(i => i >= 0)));
  }, [loading, priced, status]);

  const getQty = (i: number) => quantities.get(i) || 1;
  const setQty = (i: number, q: number) => setQuantities(prev => new Map(prev).set(i, Math.max(1, Math.min(99, q))));
  const toggle = (idx: number) => setSelected(prev => { const n = new Set(prev); n.has(idx) ? n.delete(idx) : n.add(idx); return n; });
  const selectAlt = (idx: number, alt: KrogerProduct) => setPriced(prev => { const n = [...prev]; n[idx] = { ...n[idx], product: alt }; return n; });

  const selectedTotal = priced.reduce((s, p, i) => {
    if (!selected.has(i)) return s;
    return s + (p.product?.price?.promo || p.product?.price?.regular || 0) * getQty(i);
  }, 0);

  return <CartReviewInner priced={priced} loading={loading} selected={selected} pantryNames={pantryNames}
    getQty={getQty} setQty={setQty} toggle={toggle} selectAlt={selectAlt} selectedTotal={selectedTotal}
    status={status} setStatus={setStatus} dispatch={dispatch} onSent={onSent} />;
};
