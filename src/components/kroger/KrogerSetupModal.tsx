import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { setStore } from '../../store/slices/krogerSlice';
import { kroger, KrogerStore } from '../../services/kroger';
import { KrogerStorePicker } from '../KrogerStorePicker';
import './KrogerSetupModal.css';

interface Props {
  onClose: () => void;
}

type Step = 'store' | 'connect';

export const KrogerSetupModal: React.FC<Props> = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, selectedStore } = useAppSelector(s => s.kroger);
  const [step, setStep] = useState<Step>('store');

  // If store is already selected and not connected, jump to connect step
  useEffect(() => {
    if (selectedStore && !isAuthenticated) {
      setStep('connect');
    }
  }, [selectedStore, isAuthenticated]);

  const handleStoreSelect = (store: KrogerStore) => {
    dispatch(setStore(store));
    kroger.setStore(store); // Also update service layer
    if (!isAuthenticated) {
      setStep('connect');
    } else {
      onClose();
    }
  };

  const handleConnect = () => {
    kroger.login(); // Redirect to OAuth
  };

  return (
    <div className="kroger-modal-overlay" onClick={onClose}>
      <div className="kroger-modal" onClick={e => e.stopPropagation()}>
        <button className="kroger-modal-close" onClick={onClose}>×</button>

        {step === 'store' && (
          <div className="kroger-modal-content">
            <KrogerStorePicker
              onSelect={handleStoreSelect}
              selectedStore={selectedStore}
            />
          </div>
        )}

        {step === 'connect' && (
          <div className="kroger-modal-content">
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
                  <button className="kroger-done-btn" onClick={onClose}>Done</button>
                </div>
              ) : (
                <div className="kroger-connect-prompt">
                  <p className="connect-description">
                    Connect your Kroger account to:
                  </p>
                  <ul className="connect-benefits">
                    <li>Add ingredients directly to your Kroger cart</li>
                    <li>See real-time pricing and availability</li>
                    <li>Save time on grocery shopping</li>
                  </ul>
                  <button className="kroger-connect-btn" onClick={handleConnect}>
                    Connect Kroger Account
                  </button>
                  <button className="kroger-back-btn" onClick={() => setStep('store')}>
                    Back to Store Selection
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
