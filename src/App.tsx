import React, { lazy, Suspense, useEffect } from 'react';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { TourOverlay } from './components/tour/TourOverlay';
import { useImportPantry } from './hooks/useImportPantry';
import { useHashNav } from './hooks/useHashNav';
import { useTour } from './hooks/useTour';
import { useAuthCallback } from './hooks/useAuthCallback';
import { useHouseholdSync } from './hooks/useHouseholdSync';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { fetchProfile } from './store/slices/krogerSlice';
import './App.css';

const RecipesPage = lazy(() => import('./components/recipe/RecipesPage').then(m => ({ default: m.RecipesPage })));
const PantryPage = lazy(() => import('./components/pantry/PantryPage').then(m => ({ default: m.PantryPage })));
const MealPlannerPage = lazy(() => import('./components/MealPlannerPage').then(m => ({ default: m.MealPlannerPage })));
const MyCartPage = lazy(() => import('./components/cart/MyCartPage').then(m => ({ default: m.MyCartPage })));
const OrderHistoryPage = lazy(() => import('./components/cart/OrderHistoryPage').then(m => ({ default: m.OrderHistoryPage })));

function App() {
  const { page: currentPage, navigate: setCurrentPage } = useHashNav();
  const { imported, dismiss } = useImportPantry();
  const tour = useTour(setCurrentPage as (p: any) => void);
  const dispatch = useAppDispatch();
  const { isAuthenticated, profile } = useAppSelector(s => s.kroger);
  useAuthCallback();
  useHouseholdSync();
  useEffect(() => { if (isAuthenticated && !profile) dispatch(fetchProfile()); }, [isAuthenticated, profile, dispatch]);

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
          {currentPage === 'history' && <OrderHistoryPage />}
        </Suspense>
      </main>
      <Footer />
      {tour.active && tour.step && <TourOverlay step={tour.step} onNext={tour.next} onSkip={tour.skip} />}
    </div>
  );
}

export default App;
