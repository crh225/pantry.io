import React, { lazy, Suspense, useEffect } from 'react';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { TourOverlay } from './components/tour/TourOverlay';
import { useImportPantry } from './hooks/useImportPantry';
import { useHashNav } from './hooks/useHashNav';
import { useTour } from './hooks/useTour';
import { kroger } from './services/kroger';
import { useAppDispatch } from './store/hooks';
import { handleAuthCallback } from './store/slices/krogerSlice';
import './App.css';

const RecipesPage = lazy(() => import('./components/recipe/RecipesPage').then(m => ({ default: m.RecipesPage })));
const PantryPage = lazy(() => import('./components/pantry/PantryPage').then(m => ({ default: m.PantryPage })));
const MealPlannerPage = lazy(() => import('./components/MealPlannerPage').then(m => ({ default: m.MealPlannerPage })));
const MyCartPage = lazy(() => import('./components/cart/MyCartPage').then(m => ({ default: m.MyCartPage })));

function App() {
  const { page: currentPage, navigate: setCurrentPage } = useHashNav();
  const { imported, dismiss } = useImportPantry();
  const tour = useTour(setCurrentPage as (p: any) => void);
  const dispatch = useAppDispatch();

  // Handle Kroger OAuth callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('kroger_session');
    const token = params.get('kroger_token');
    const expiresIn = params.get('kroger_expires');
    if (sessionId && token) {
      // Update both service layer and Redux state
      kroger.handleAuthCallback(sessionId, token, parseInt(expiresIn || '1800', 10));
      dispatch(handleAuthCallback({ sessionId, token, expiresIn: parseInt(expiresIn || '1800', 10) }));
      window.history.replaceState({}, '', window.location.pathname + window.location.hash);
    }
  }, [dispatch]);

  return (
    <div className="app">
      <Header onNavClick={setCurrentPage} currentPage={currentPage} />
      <main className="main-content">
        {imported && <div className="import-toast" onClick={dismiss}>✓ Pantry items imported! ×</div>}
        <Suspense fallback={<div className="loading">Loading...</div>}>
          {currentPage === 'recipes' && <RecipesPage />}
          {currentPage === 'pantry' && <PantryPage />}
          {currentPage === 'planner' && <MealPlannerPage />}
          {currentPage === 'cart' && <MyCartPage />}
        </Suspense>
      </main>
      <Footer />
      {tour.active && tour.step && <TourOverlay step={tour.step} onNext={tour.next} onSkip={tour.skip} />}
    </div>
  );
}

export default App;
