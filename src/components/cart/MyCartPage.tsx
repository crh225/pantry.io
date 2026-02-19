import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { clearCart } from '../../store/slices/krogerSlice';
import { addItem } from '../../store/slices/pantrySlice';
import { ConfirmModal } from '../common/ConfirmModal';
import { CartReview } from './CartReview';
import { CartTracked } from './CartTracked';
import { CartSearch } from './CartSearch';
import { CartPageHeader } from './CartPageHeader';
import { CartSuccessBanner } from './CartSuccessBanner';
import './MyCartPage.css';

export const MyCartPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { pendingSend, cartItems, selectedStore, profile } = useAppSelector(s => s.kroger);
  const [showClear, setShowClear] = useState(false);
  const [sentItems, setSentItems] = useState<string[]>([]);
  const [addedToPantry, setAddedToPantry] = useState(false);

  const handleSent = (names: string[]) => { setSentItems(names); setAddedToPantry(false); };
  const handleAddToPantry = () => {
    sentItems.forEach(name => dispatch(addItem({ name, quantity: '1', location: 'pantry' })));
    setAddedToPantry(true);
  };

  return (
    <div className="my-cart-page">
      <CartPageHeader profile={profile} selectedStore={selectedStore}
        showClear={cartItems.length > 0 && !pendingSend} onClear={() => setShowClear(true)} />
      {sentItems.length > 0 && !pendingSend && (
        <CartSuccessBanner sentItems={sentItems} addedToPantry={addedToPantry}
          onAddToPantry={handleAddToPantry} onDismiss={() => setSentItems([])} />
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
