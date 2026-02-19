import React, { useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import { kroger } from '../../services/kroger';
import { KrogerSetupModal } from '../kroger/KrogerSetupModal';
import { HeaderNav } from './HeaderNav';
import { KrogerBadge } from './KrogerBadge';
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
          <HeaderNav currentPage={currentPage} onNavClick={onNavClick} />
          {kroger.isConfigured() && (
            <KrogerBadge isAuthenticated={isAuthenticated} selectedStore={selectedStore}
              profile={profile} onClick={() => setShowSetupModal(true)} />
          )}
        </div>
      </header>
      {showSetupModal && <KrogerSetupModal onClose={() => setShowSetupModal(false)} />}
    </>
  );
};
