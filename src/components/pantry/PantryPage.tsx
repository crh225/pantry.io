import React, { useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import { AddPantryItem } from './AddPantryItem';
import { PantryList } from './PantryList';
import { QuickAdd } from './QuickAdd';
import { BarcodeScanner } from './BarcodeScanner';
import { SharePantry } from './SharePantry';
import { HouseholdLink } from './HouseholdLink';
import './PantryPage.css';

export const PantryPage: React.FC = () => {
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const isEmpty = useAppSelector(s => s.pantry.items.length === 0);

  return (
    <div className="pantry-page">
      <div className="pantry-header">
        <h1>My Pantry</h1>
        <p>Track what's in your pantry, fridge, and freezer</p>
        {isEmpty ? (
          <div className="first-time-banner">
            <p>🎉 Get started by adding common items or scanning barcodes.</p>
            <div className="banner-actions">
              <button onClick={() => setShowQuickAdd(true)} className="quick-add-trigger">Quick Add</button>
              <button onClick={() => setShowScanner(true)} className="scan-trigger">📷 Scan</button>
            </div>
          </div>
        ) : (
          <div className="quick-actions">
            <button onClick={() => setShowQuickAdd(true)} className="quick-add-link">+ Quick Add</button>
            <button onClick={() => setShowScanner(true)} className="scan-link">📷 Scan</button>
            <SharePantry />
            <HouseholdLink />
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
