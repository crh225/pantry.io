import React from 'react';

interface Props {
  isAuthenticated: boolean;
  onConnect: () => void;
  onBack: () => void;
  onDone: () => void;
}

export const ConnectStep: React.FC<Props> = ({ isAuthenticated, onConnect, onBack, onDone }) => (
  <div className="kroger-connect-section">
    <h3>Connect Your Kroger Account</h3>
    {isAuthenticated ? (
      <div className="kroger-connected-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
        <p className="connected-text">Your Kroger account is connected!</p>
        <p className="connected-subtext">You can now add items to your Kroger cart</p>
        <button className="kroger-done-btn" onClick={onDone}>Done</button>
      </div>
    ) : (
      <div className="kroger-connect-prompt">
        <p className="connect-description">Connect your Kroger account to:</p>
        <ul className="connect-benefits">
          <li>Add ingredients directly to your Kroger cart</li>
          <li>See real-time pricing and availability</li>
          <li>Save time on grocery shopping</li>
        </ul>
        <button className="kroger-connect-btn" onClick={onConnect}>Connect Kroger Account</button>
        <button className="kroger-back-btn" onClick={onBack}>Back to Store Selection</button>
      </div>
    )}
  </div>
);
