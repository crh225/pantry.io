import React, { useState, lazy, Suspense } from 'react';
import { Header } from './components/common/Header';
import './App.css';

const RecipesPage = lazy(() => import('./components/recipe/RecipesPage').then(m => ({ default: m.RecipesPage })));
const PantryPage = lazy(() => import('./components/pantry/PantryPage').then(m => ({ default: m.PantryPage })));
const MealPlannerPage = lazy(() => import('./components/MealPlannerPage').then(m => ({ default: m.MealPlannerPage })));

type Page = 'recipes' | 'pantry' | 'planner';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('recipes');

  const renderPage = () => {
    switch (currentPage) {
      case 'recipes':
        return <RecipesPage />;
      case 'pantry':
        return <PantryPage />;
      case 'planner':
        return <MealPlannerPage />;
      default:
        return <RecipesPage />;
    }
  };

  return (
    <div className="app">
      <Header onNavClick={setCurrentPage} currentPage={currentPage} />
      <main className="main-content">
        <Suspense fallback={<div className="loading">Loading...</div>}>
          {renderPage()}
        </Suspense>
      </main>
    </div>
  );
}

export default App;
