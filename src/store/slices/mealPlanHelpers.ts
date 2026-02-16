import { MealPlanState } from '../../types';

export const defaultNights = [
  { id: 'mon', label: 'Monday', recipe: null },
  { id: 'tue', label: 'Tuesday', recipe: null },
  { id: 'wed', label: 'Wednesday', recipe: null },
  { id: 'thu', label: 'Thursday', recipe: null },
];

export const persist = (state: MealPlanState) => {
  localStorage.setItem('mealPlan', JSON.stringify(state));
};

export const loadInitialState = (): MealPlanState => {
  const saved = localStorage.getItem('mealPlan');
  return saved ? JSON.parse(saved) : { nights: defaultNights, bag: [] };
};
