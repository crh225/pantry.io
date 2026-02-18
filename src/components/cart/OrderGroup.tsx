import React, { useState } from 'react';
import { Order } from '../../store/slices/orderHistorySlice';

const formatTime = (ts: number) => new Date(ts).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

export const OrderGroup: React.FC<{ date: string; orders: Order[] }> = ({ date, orders }) => {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="order-group">
      <h3 className="order-date">{date}</h3>
      {orders.map(order => (
        <div key={order.id} className="order-card">
          <div className="order-card-header" onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
            <div className="order-card-info">
              <span className="order-time">{formatTime(order.sentAt)}</span>
              <span className="order-item-count">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
            </div>
            <span className="order-total">${order.total.toFixed(2)}</span>
            <span className={`order-chevron${expanded === order.id ? ' open' : ''}`}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </span>
          </div>
          {expanded === order.id && (
            <ul className="order-items">
              {order.items.map((item, i) => (
                <li key={i} className="order-item">
                  {item.image && <img src={item.image} alt="" className="order-item-img" />}
                  <div className="order-item-info">
                    <span className="order-item-name">{item.name}</span>
                    <span className="order-item-desc">{item.description}</span>
                  </div>
                  <span className="order-item-qty">x{item.quantity}</span>
                  <span className="order-item-price">${(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};
