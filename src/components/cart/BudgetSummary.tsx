import React, { useMemo } from 'react';
import { Order } from '../../store/slices/orderHistorySlice';

const weekStart = () => {
  const d = new Date(); d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay());
  return d.getTime();
};

const monthStart = () => {
  const d = new Date(); d.setHours(0, 0, 0, 0);
  d.setDate(1);
  return d.getTime();
};

export const BudgetSummary: React.FC<{ orders: Order[] }> = ({ orders }) => {
  const stats = useMemo(() => {
    const ws = weekStart(), ms = monthStart();
    const weekly = orders.filter(o => o.sentAt >= ws).reduce((s, o) => s + o.total, 0);
    const monthly = orders.filter(o => o.sentAt >= ms).reduce((s, o) => s + o.total, 0);
    const allTime = orders.reduce((s, o) => s + o.total, 0);
    const itemCount = orders.reduce((s, o) => s + o.items.length, 0);
    return { weekly, monthly, allTime, orderCount: orders.length, itemCount };
  }, [orders]);

  return (
    <div className="budget-summary">
      <div className="budget-card">
        <span className="budget-label">This Week</span>
        <span className="budget-amount">${stats.weekly.toFixed(2)}</span>
      </div>
      <div className="budget-card">
        <span className="budget-label">This Month</span>
        <span className="budget-amount">${stats.monthly.toFixed(2)}</span>
      </div>
      <div className="budget-card">
        <span className="budget-label">All Time</span>
        <span className="budget-amount">${stats.allTime.toFixed(2)}</span>
      </div>
      <div className="budget-card">
        <span className="budget-label">Orders</span>
        <span className="budget-amount">{stats.orderCount}</span>
      </div>
    </div>
  );
};
