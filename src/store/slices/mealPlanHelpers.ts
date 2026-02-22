import { MealPlanState } from '../../types';
import { getVisitorId } from './pantryHelpers';

export const defaultNights = [
  { id: 'mon', label: 'Monday', recipe: null },
  { id: 'tue', label: 'Tuesday', recipe: null },
  { id: 'wed', label: 'Wednesday', recipe: null },
  { id: 'thu', label: 'Thursday', recipe: null },
];

let mealPlanSyncTimer: ReturnType<typeof setTimeout> | null = null;
const syncMealPlanToFirebase = (state: MealPlanState) => {
  if (mealPlanSyncTimer) clearTimeout(mealPlanSyncTimer);
  mealPlanSyncTimer = setTimeout(() => {
    const vid = getVisitorId();
    fetch(`/api/pantry-sync?vid=${encodeURIComponent(vid)}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mealPlan: state }),
    }).catch(() => {});
  }, 2000);
};

export const persist = (state: MealPlanState) => {
  localStorage.setItem('mealPlan', JSON.stringify(state));
  syncMealPlanToFirebase(state);
};

export const loadInitialState = (): MealPlanState => {
  const saved = localStorage.getItem('mealPlan');
  return saved ? JSON.parse(saved) : { nights: defaultNights, bag: [] };
};
