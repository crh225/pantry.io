import React, { useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import { kroger } from '../../services/kroger';
import { KrogerSetupModal } from '../kroger/KrogerSetupModal';
import './Header.css';

interface HeaderProps {
  onNavClick: (page: 'recipes' | 'pantry' | 'planner' | 'cart' | 'history') => void;
  currentPage: string;
}

export const Header: React.FC<HeaderProps> = ({ onNavClick, currentPage }) => {
  const [showSetupModal, setShowSetupModal] = useState(false);
  const { isAuthenticated, selectedStore, profile } = useAppSelector(s => s.kroger);

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
            {kroger.isConfigured() && (
              <>
                <button
                  className={`nav-btn ${currentPage === 'cart' ? 'active' : ''}`}
                  onClick={() => onNavClick('cart')}
                >
                  My Cart
                </button>
                <button
                  className={`nav-btn ${currentPage === 'history' ? 'active' : ''}`}
                  onClick={() => onNavClick('history')}
                >
                  History
                </button>
              </>
            )}
          </nav>
          {kroger.isConfigured() && (
            <div className="header-kroger">
              <button
                className={`store-badge ${isAuthenticated ? 'connected' : ''}`}
                onClick={() => setShowSetupModal(true)}
              >
                <svg className="store-badge-icon" width="14" height="14" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span className="store-badge-name">
                  {selectedStore ? selectedStore.name.replace(/^[^-]+-\s*/, '') : 'Set Store'}
                  {isAuthenticated && profile?.firstName && ` • Hi, ${profile.firstName}`}
                </span>
                {isAuthenticated && <span className="connection-indicator" />}
              </button>
            </div>
          )}
        </div>
      </header>

      {showSetupModal && (
        <KrogerSetupModal onClose={() => setShowSetupModal(false)} />
      )}
    </>
  );
};
