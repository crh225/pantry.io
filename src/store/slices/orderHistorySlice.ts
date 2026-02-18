import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from './krogerSlice';

export interface Order {
  id: string;
  sentAt: number;
  items: CartItem[];
  total: number;
}

interface OrderHistoryState {
  orders: Order[];
}

const HISTORY_KEY = 'order_history';

const loadOrders = (): Order[] => {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); }
  catch { return []; }
};

const initialState: OrderHistoryState = { orders: loadOrders() };

const persist = (orders: Order[]) => {
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify(orders)); } catch {}
};

const orderHistorySlice = createSlice({
  name: 'orderHistory',
  initialState,
  reducers: {
    addOrder: (state, action: PayloadAction<Omit<Order, 'id'>>) => {
      state.orders.unshift({ ...action.payload, id: `order-${Date.now()}` });
      persist(state.orders);
    },
    clearHistory: (state) => {
      state.orders = [];
      persist([]);
    },
  },
});

export const { addOrder, clearHistory } = orderHistorySlice.actions;
export default orderHistorySlice.reducer;
