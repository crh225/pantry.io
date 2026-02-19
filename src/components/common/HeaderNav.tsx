import React from 'react';
import { kroger } from '../../services/kroger';

interface Props {
  currentPage: string;
  onNavClick: (page: 'recipes' | 'pantry' | 'planner' | 'cart' | 'history') => void;
}

export const HeaderNav: React.FC<Props> = ({ currentPage, onNavClick }) => (
  <nav className="nav">
    <button className={`nav-btn ${currentPage === 'pantry' ? 'active' : ''}`} onClick={() => onNavClick('pantry')}>My Pantry</button>
    <button className={`nav-btn ${currentPage === 'recipes' ? 'active' : ''}`} onClick={() => onNavClick('recipes')}>Recipes</button>
    <button className={`nav-btn ${currentPage === 'planner' ? 'active' : ''}`} onClick={() => onNavClick('planner')}>Meal Planner</button>
    {kroger.isConfigured() && (
      <>
        <button className={`nav-btn ${currentPage === 'cart' ? 'active' : ''}`} onClick={() => onNavClick('cart')}>My Cart</button>
        <button className={`nav-btn ${currentPage === 'history' ? 'active' : ''}`} onClick={() => onNavClick('history')}>History</button>
      </>
    )}
  </nav>
);
