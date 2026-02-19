import { useAppDispatch } from '../../store/hooks';
import { addCartItem, setPendingSend } from '../../store/slices/krogerSlice';
import { clearBag } from '../../store/slices/mealPlanSlice';
import { addOrder } from '../../store/slices/orderHistorySlice';
import { kroger } from '../../services/kroger';
import { PricedItem } from '../../hooks/useKrogerPrices';

export const useCartSend = (
  priced: PricedItem[], selected: Set<number>,
  getQty: (i: number) => number, onSent: (names: string[]) => void,
  setStatus: (s: 'idle' | 'sending' | 'done') => void,
) => {
  const dispatch = useAppDispatch();
  return async () => {
    const items = priced.map((p, i) => ({ p, i })).filter(({ p, i }) => selected.has(i) && p.product?.upc);
    if (!items.length) return;
    setStatus('sending');
    try {
      await kroger.addMultipleToCart(items.map(({ p, i }) => ({ upc: p.product!.upc, quantity: getQty(i) })));
      const orderItems = items.map(({ p, i }) => {
        const qty = getQty(i);
        const ci = { upc: p.product!.upc, name: p.ingredient.name, description: p.product!.description,
          price: p.product!.price?.promo || p.product!.price?.regular || 0, quantity: qty, image: p.product!.image };
        dispatch(addCartItem(ci));
        return { ...ci, addedAt: Date.now() };
      });
      dispatch(addOrder({ sentAt: Date.now(), items: orderItems, total: orderItems.reduce((s, i) => s + i.price * i.quantity, 0) }));
      setStatus('done'); dispatch(clearBag()); dispatch(setPendingSend(false));
      onSent(items.map(({ p }) => p.ingredient.name));
    } catch { setStatus('idle'); }
  };
};
