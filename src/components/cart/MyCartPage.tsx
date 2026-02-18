import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { removeCartItem, clearCart } from '../../store/slices/krogerSlice';
import { ConfirmModal } from '../common/ConfirmModal';
import './MyCartPage.css';

export const MyCartPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { cartItems, selectedStore, profile } = useAppSelector(s => s.kroger);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleRemove = (upc: string) => {
    dispatch(removeCartItem(upc));
  };

  const handleClearAll = () => {
    dispatch(clearCart());
    setShowClearConfirm(false);
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  if (cartItems.length === 0) {
    return (
      <div className="my-cart-page">
        <div className="cart-page-header">
          <h1>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '0.5rem', flexShrink: 0}}>
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            {profile?.firstName ? `${profile.firstName}'s Kroger Cart` : 'My Kroger Cart'}
          </h1>
          {selectedStore && (
            <p className="cart-store">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {selectedStore.name}
              {selectedStore.city && `, ${selectedStore.city}`}
            </p>
          )}
        </div>
        <div className="cart-empty">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"/>
            <circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          <h3>Your cart is empty</h3>
          <p>Add items from the Meal Planner to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-cart-page">
      <div className="cart-page-header">
        <div className="cart-page-title">
          <h1>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '0.5rem', flexShrink: 0}}>
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            {profile?.firstName ? `${profile.firstName}'s Kroger Cart` : 'My Kroger Cart'}
          </h1>
          {selectedStore && (
            <p className="cart-store">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {selectedStore.name}
              {selectedStore.city && `, ${selectedStore.city}`}
            </p>
          )}
        </div>
        <button className="cart-clear-btn" onClick={() => setShowClearConfirm(true)}>
          Clear All
        </button>
      </div>

      <div className="cart-notice">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="16" x2="12" y2="12"/>
          <line x1="12" y1="8" x2="12.01" y2="8"/>
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
            <button
              className="cart-item-remove"
              onClick={() => handleRemove(item.upc)}
              title="Remove item"
            >
              ×
            </button>
          </li>
        ))}
      </ul>

      <div className="cart-page-footer">
        <div className="cart-total-row">
          <span className="cart-total-label">Estimated Total</span>
          <span className="cart-total-amount">${total.toFixed(2)}</span>
        </div>
        <a
          href="https://www.kroger.com/cart"
          target="_blank"
          rel="noopener noreferrer"
          className="cart-checkout-btn"
        >
          View Cart on Kroger.com
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
        </a>
      </div>

      {showClearConfirm && (
        <ConfirmModal
          title="Clear Cart"
          message="This will clear your local cart tracking. Items already in your Kroger cart will not be affected."
          confirmText="Clear"
          cancelText="Keep Items"
          danger
          onConfirm={handleClearAll}
          onCancel={() => setShowClearConfirm(false)}
        />
      )}
    </div>
  );
};
