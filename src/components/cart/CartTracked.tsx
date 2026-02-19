import React from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { removeCartItem } from '../../store/slices/krogerSlice';
import { CartEmpty } from './CartEmpty';

const formatTime = (ts: number) => {
  const d = Math.floor((Date.now() - ts) / 60000);
  if (d < 60) return `${d}m ago`;
  return d < 1440 ? `${Math.floor(d / 60)}h ago` : `${Math.floor(d / 1440)}d ago`;
};

export const CartTracked: React.FC = () => {
  const dispatch = useAppDispatch();
  const { cartItems } = useAppSelector(s => s.kroger);
  const total = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  if (cartItems.length === 0) return <CartEmpty />;
  return (
    <>
      <div className="cart-notice">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
        Items shown are tracked locally. Visit Kroger.com or the app to complete your purchase.
      </div>
      <ul className="cart-items-list">
        {cartItems.map(item => (
          <li key={item.upc} className="cart-list-item">
            {item.image && <img src={item.image} alt="" className="cart-item-image" />}
            <div className="cart-item-details">
              <span className="cart-item-ingredient">{item.name}</span>
              <span className="cart-item-product">{item.description}</span>
              <span className="cart-item-time">{formatTime(item.addedAt)}</span>
            </div>
            <div className="cart-item-right">
              <span className="cart-item-qty">Qty: {item.quantity}</span>
              <span className="cart-item-price">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
            <button className="cart-item-remove" onClick={() => dispatch(removeCartItem(item.upc))}>&times;</button>
          </li>
        ))}
      </ul>
      <div className="cart-page-footer">
        <div className="cart-total-row">
          <span className="cart-total-label">Estimated Total</span>
          <span className="cart-total-amount">${total.toFixed(2)}</span>
        </div>
        <a href="https://www.kroger.com/cart" target="_blank" rel="noopener noreferrer" className="cart-checkout-btn">
          View Cart on Kroger.com
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
        </a>
      </div>
    </>
  );
};
