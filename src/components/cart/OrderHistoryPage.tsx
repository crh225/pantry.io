import React, { useMemo, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { clearHistory } from '../../store/slices/orderHistorySlice';
import { ConfirmModal } from '../common/ConfirmModal';
import { BudgetSummary } from './BudgetSummary';
import { OrderGroup } from './OrderGroup';
import './OrderHistoryPage.css';

const groupByDate = (orders: { sentAt: number }[]) => {
  const groups = new Map<string, typeof orders>();
  orders.forEach(o => {
    const key = new Date(o.sentAt).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(o);
  });
  return Array.from(groups.entries());
};

export const OrderHistoryPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { orders } = useAppSelector(s => s.orderHistory);
  const [showClear, setShowClear] = useState(false);
  const grouped = useMemo(() => groupByDate(orders), [orders]);
  return (
    <div className="history-page">
      <div className="history-header">
        <h1>Order History</h1>
        {orders.length > 0 && <button className="history-clear-btn" onClick={() => setShowClear(true)}>Clear History</button>}
      </div>
      {orders.length > 0 && <BudgetSummary orders={orders} />}
      {orders.length === 0 ? (
        <div className="history-empty"><h3>No orders yet</h3><p>Items you send to your Kroger cart will appear here</p></div>
      ) : grouped.map(([date, dateOrders]) => <OrderGroup key={date} date={date} orders={dateOrders as any} />)}
      {showClear && (
        <ConfirmModal title="Clear History" message="This will permanently delete your order history."
          confirmText="Clear" cancelText="Keep" danger
          onConfirm={() => { dispatch(clearHistory()); setShowClear(false); }} onCancel={() => setShowClear(false)} />
      )}
    </div>
  );
};
