import React, { useState } from 'react';
import { kroger, KrogerStore } from '../../services/kroger';
import { KrogerStorePicker } from '../KrogerStorePicker';
import './Header.css';

interface HeaderProps {
  onNavClick: (page: 'recipes' | 'pantry' | 'planner') => void;
  currentPage: string;
}

export const Header: React.FC<HeaderProps> = ({ onNavClick, currentPage }) => {
  const [showStorePicker, setShowStorePicker] = useState(false);
  const [selectedStore, setSelectedStore] = useState<KrogerStore | null>(() => kroger.getSelectedStore());

  const handleStoreSelect = (store: KrogerStore) => {
    kroger.setStore(store);
    setSelectedStore(store);
    setShowStorePicker(false);
  };

  return (
    <>
      <header className="header">
        <div className="header-content">
          <h1 className="logo" onClick={() => onNavClick('pantry')} style={{ cursor: 'pointer' }}>Pantry.io</h1>
          <nav className="nav">
            <button
              className={`nav-btn ${currentPage === 'pantry' ? 'active' : ''}`}
              onClick={() => onNavClick('pantry')}
            >
              My Pantry
            </button>
            <button
              className={`nav-btn ${currentPage === 'recipes' ? 'active' : ''}`}
              onClick={() => onNavClick('recipes')}
            >
              Recipes
            </button>
            <button
              className={`nav-btn ${currentPage === 'planner' ? 'active' : ''}`}
              onClick={() => onNavClick('planner')}
            >
              Meal Planner
            </button>
          </nav>
          {kroger.isConfigured() && (
            <button className="store-badge" onClick={() => setShowStorePicker(true)}>
              <span className="store-badge-icon">📍</span>
              <span className="store-badge-name">{selectedStore?.name || 'Set Store'}</span>
            </button>
          )}
        </div>
      </header>

      {showStorePicker && (
        <div className="store-modal-overlay" onClick={() => setShowStorePicker(false)}>
          <div className="store-modal" onClick={e => e.stopPropagation()}>
            <button className="store-modal-close" onClick={() => setShowStorePicker(false)}>×</button>
            <KrogerStorePicker onSelect={handleStoreSelect} selectedStore={selectedStore} />
          </div>
        </div>
      )}
    </>
  );
};
