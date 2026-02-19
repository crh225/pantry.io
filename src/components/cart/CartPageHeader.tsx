import React from 'react';
import { KrogerStore, KrogerProfile } from '../../services/kroger';

interface Props {
  profile: KrogerProfile | null;
  selectedStore: KrogerStore | null;
  showClear: boolean;
  onClear: () => void;
}

export const CartPageHeader: React.FC<Props> = ({ profile, selectedStore, showClear, onClear }) => (
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
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          {selectedStore.name}{selectedStore.city && `, ${selectedStore.city}`}
        </p>
      )}
    </div>
    {showClear && <button className="cart-clear-btn" onClick={onClear}>Clear All</button>}
  </div>
);
