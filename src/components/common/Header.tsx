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
            <div className="header-kroger">
              <button className="store-badge" onClick={() => setShowStorePicker(true)}>
                <svg className="store-badge-icon" width="14" height="14" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span className="store-badge-name">{selectedStore?.name || 'Set Store'}</span>
              </button>
              {!kroger.isLoggedIn() ? (
                <button className="kroger-connect-btn" onClick={() => kroger.login()}>
                  Connect Kroger
                </button>
              ) : (
                <span className="kroger-connected">Connected</span>
              )}
            </div>
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
