import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { setStore } from '../../store/slices/krogerSlice';
import { kroger, KrogerStore } from '../../services/kroger';
import { KrogerStorePicker } from '../KrogerStorePicker';
import { ConnectStep } from './ConnectStep';
import './KrogerSetupModal.css';

export const KrogerSetupModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, selectedStore } = useAppSelector(s => s.kroger);
  const [step, setStep] = useState<'store' | 'connect'>('store');

  useEffect(() => { if (selectedStore && !isAuthenticated) setStep('connect'); }, [selectedStore, isAuthenticated]);

  const handleStoreSelect = (store: KrogerStore) => {
    dispatch(setStore(store));
    kroger.setStore(store);
    isAuthenticated ? onClose() : setStep('connect');
  };

  return (
    <div className="kroger-modal-overlay" onClick={onClose}>
      <div className="kroger-modal" onClick={e => e.stopPropagation()}>
        <button className="kroger-modal-close" onClick={onClose}>×</button>
        {step === 'store' && (
          <div className="kroger-modal-content">
            <KrogerStorePicker onSelect={handleStoreSelect} selectedStore={selectedStore} />
          </div>
        )}
        {step === 'connect' && (
          <div className="kroger-modal-content">
            <ConnectStep isAuthenticated={isAuthenticated} onConnect={() => kroger.login()}
              onBack={() => setStep('store')} onDone={onClose} />
          </div>
        )}
      </div>
    </div>
  );
};
