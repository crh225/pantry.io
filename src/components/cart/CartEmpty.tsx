import React from 'react';

export const CartEmpty: React.FC = () => (
  <div className="cart-empty">
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
    </svg>
    <h3>Your cart is empty</h3>
    <p>Add items from the Meal Planner to get started</p>
  </div>
);
