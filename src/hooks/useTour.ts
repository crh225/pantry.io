import { useState, useCallback } from 'react';

const TOUR_KEY = 'pantry-tour-complete';

export type TourStep = 'welcome' | 'pantry' | 'recipes' | 'planner' | 'done';
const STEPS: TourStep[] = ['welcome', 'pantry', 'recipes', 'planner'];

const PAGE_MAP: Record<string, string> = {
  pantry: 'pantry', recipes: 'recipes', planner: 'planner',
};

export function useTour(setPage: (p: any) => void) {
  const seen = localStorage.getItem(TOUR_KEY) === '1';
  const [step, setStep] = useState<TourStep | null>(seen ? null : 'welcome');

  const finish = useCallback(() => {
    localStorage.setItem(TOUR_KEY, '1');
    setStep(null);
    setPage('pantry');
  }, [setPage]);

  const next = useCallback(() => {
    setStep(prev => {
      const i = STEPS.indexOf(prev!);
      if (i < 0 || i >= STEPS.length - 1) {
        finish();
        return null;
      }
      const ns = STEPS[i + 1];
      if (PAGE_MAP[ns]) setPage(PAGE_MAP[ns]);
      return ns;
    });
  }, [setPage, finish]);

  const skip = useCallback(() => {
    finish();
  }, [finish]);

  return { step, next, skip, active: step !== null };
}
