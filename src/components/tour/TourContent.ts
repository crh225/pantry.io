import { TourStep } from '../../hooks/useTour';

type StepInfo = { title: string; body: string; cta: string };

export const TOUR: Record<string, StepInfo> = {
  welcome: {
    title: 'Welcome to Pantry.io 👋',
    body: 'Find amazing meals from what you already have — and see the 1-3 items you need to grab. Let\'s take a quick tour!',
    cta: 'Show me →',
  },
  pantry: {
    title: 'Step 1 — Stock Your Pantry',
    body: 'Use Quick Add to load common items in seconds, or scan barcodes. This is what we\'ll match recipes against.',
    cta: 'Next →',
  },
  recipes: {
    title: 'Step 2 — Find Recipes',
    body: 'Filter by cuisine, protein, or diet. Each card shows how many ingredients you already have and what\'s missing.',
    cta: 'Next →',
  },
  planner: {
    title: 'Step 3 — Plan Your Week',
    body: 'Assign meals to nights, then check your shopping bag — complete with Kroger prices. That\'s it!',
    cta: 'Get Started',
  },
};

export const stepNumber = (s: TourStep) =>
  ({ welcome: 0, pantry: 1, recipes: 2, planner: 3, done: 4 }[s]);
