import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { clearCart } from '../../store/slices/krogerSlice';
import { addItem } from '../../store/slices/pantrySlice';
import { ConfirmModal } from '../common/ConfirmModal';
import { CartReview } from './CartReview';
import { CartTracked } from './CartTracked';
import { CartSearch } from './CartSearch';
import './MyCartPage.css';

export const MyCartPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { pendingSend, cartItems, selectedStore, profile } = useAppSelector(s => s.kroger);
  const [showClear, setShowClear] = useState(false);
  const [sentItems, setSentItems] = useState<string[]>([]);
  const [addedToPantry, setAddedToPantry] = useState(false);

  const handleSent = (names: string[]) => {
    setSentItems(names);
    setAddedToPantry(false);
  };

  const handleAddToPantry = () => {
    sentItems.forEach(name => dispatch(addItem({ name, quantity: '1', location: 'pantry' })));
    setAddedToPantry(true);
  };

  return (
    <div className="my-cart-page">
      <div className="cart-page-header">
        <div className="cart-page-title">
          <h1>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:'0.5rem',flexShrink:0}}>
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            {profile?.firstName ? `${profile.firstName}'s Kroger Cart` : 'My Kroger Cart'}
          </h1>
          {selectedStore && (
            <p className="cart-store">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              {selectedStore.name}{selectedStore.city && `, ${selectedStore.city}`}
            </p>
          )}
        </div>
        {cartItems.length > 0 && !pendingSend && (
          <button className="cart-clear-btn" onClick={() => setShowClear(true)}>Clear All</button>
        )}
      </div>

      {sentItems.length > 0 && !pendingSend && (
        <div className="cart-success-banner">
          <span>{sentItems.length} item{sentItems.length !== 1 ? 's' : ''} added to your Kroger cart!</span>
          {!addedToPantry ? (
            <button className="add-to-pantry-btn" onClick={handleAddToPantry}>Add to Pantry</button>
          ) : (
            <span className="pantry-added">Added to pantry</span>
          )}
          <button className="banner-dismiss" onClick={() => setSentItems([])}>×</button>
        </div>
      )}

      {!pendingSend && <CartSearch />}
      {pendingSend ? <CartReview onSent={handleSent} /> : <CartTracked />}

      {showClear && (
        <ConfirmModal title="Clear Cart"
          message="This will clear your local cart tracking. Items already in your Kroger cart will not be affected."
          confirmText="Clear" cancelText="Keep Items" danger
          onConfirm={() => { dispatch(clearCart()); setShowClear(false); }}
          onCancel={() => setShowClear(false)} />
      )}
    </div>
  );
};
