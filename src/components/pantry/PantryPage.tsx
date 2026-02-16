import React, { useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import { AddPantryItem } from './AddPantryItem';
import { PantryList } from './PantryList';
import { QuickAdd } from './QuickAdd';
import { BarcodeScanner } from './BarcodeScanner';
import './PantryPage.css';

export const PantryPage: React.FC = () => {
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const { items } = useAppSelector(state => state.pantry);
  const isEmpty = items.length === 0;

  return (
    <div className="pantry-page">
      <div className="pantry-header">
        <h1>My Pantry</h1>
        <p>Keep track of what you have in your pantry, fridge, and freezer</p>
        {isEmpty && (
          <div className="first-time-banner">
            <p>🎉 Welcome! Get started quickly by selecting common items or scanning barcodes.</p>
            <div className="banner-actions">
              <button onClick={() => setShowQuickAdd(true)} className="quick-add-trigger">
                Quick Add Common Items
              </button>
              <button onClick={() => setShowScanner(true)} className="scan-trigger">
                📷 Scan Barcode
              </button>
            </div>
          </div>
        )}
        {!isEmpty && (
          <div className="quick-actions">
            <button onClick={() => setShowQuickAdd(true)} className="quick-add-link">
              + Quick Add Common Items
            </button>
            <button onClick={() => setShowScanner(true)} className="scan-link">
              📷 Scan Barcode
            </button>
          </div>
        )}
      </div>
      <AddPantryItem />
      <PantryList />
      {showQuickAdd && <QuickAdd onClose={() => setShowQuickAdd(false)} />}
      {showScanner && <BarcodeScanner onClose={() => setShowScanner(false)} />}
    </div>
  );
};
