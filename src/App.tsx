import React, { useState, lazy, Suspense } from 'react';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { TourOverlay } from './components/tour/TourOverlay';
import { useImportPantry } from './hooks/useImportPantry';
import { useTour } from './hooks/useTour';
import './App.css';

const RecipesPage = lazy(() => import('./components/recipe/RecipesPage').then(m => ({ default: m.RecipesPage })));
const PantryPage = lazy(() => import('./components/pantry/PantryPage').then(m => ({ default: m.PantryPage })));
const MealPlannerPage = lazy(() => import('./components/MealPlannerPage').then(m => ({ default: m.MealPlannerPage })));

type Page = 'recipes' | 'pantry' | 'planner';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('pantry');
  const imported = useImportPantry();
  const tour = useTour(setCurrentPage as (p: any) => void);

  return (
    <div className="app">
      <Header onNavClick={setCurrentPage} currentPage={currentPage} />
      <main className="main-content">
        {imported && <div className="import-toast">✅ Pantry items imported!</div>}
        <Suspense fallback={<div className="loading">Loading...</div>}>
          {currentPage === 'recipes' && <RecipesPage />}
          {currentPage === 'pantry' && <PantryPage />}
          {currentPage === 'planner' && <MealPlannerPage />}
        </Suspense>
      </main>
      <Footer />
      {tour.active && tour.step && <TourOverlay step={tour.step} onNext={tour.next} onSkip={tour.skip} />}
    </div>
  );
}

export default App;
