import React from 'react';
import './Header.css';

interface HeaderProps {
  onNavClick: (page: 'recipes' | 'pantry' | 'planner') => void;
  currentPage: string;
}

export const Header: React.FC<HeaderProps> = ({ onNavClick, currentPage }) => {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="logo">Pantry.io</h1>
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
      </div>
      <div className="coming-soon-banner">
        🛒 Kroger API integration coming soon!
      </div>
    </header>
  );
};
