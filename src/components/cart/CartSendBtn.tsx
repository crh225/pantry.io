import React from 'react';

interface Props {
  selectedCount: number;
  total: number;
  sending: boolean;
  onSend: () => void;
}

export const CartSendBtn: React.FC<Props> = ({ selectedCount, total, sending, onSend }) => (
  <div className="review-footer">
    {sending ? (
      <div className="review-progress">
        <div className="review-spinner" />
        <p>Adding items to Kroger...</p>
      </div>
    ) : (
      <>
        <div className="review-summary">
          <span>{selectedCount} item{selectedCount !== 1 ? 's' : ''} selected</span>
          <span className="review-total">~${total.toFixed(2)}</span>
        </div>
        <button className="review-send-btn" onClick={onSend} disabled={selectedCount === 0}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          Add {selectedCount} Item{selectedCount !== 1 ? 's' : ''} to Kroger Cart
        </button>
      </>
    )}
  </div>
);
