import { useEffect } from 'react';
import { useAppDispatch } from '../store/hooks';
import { setItems } from '../store/slices/pantrySlice';
import { setMealPlan } from '../store/slices/mealPlanSlice';
import { getVisitorId, getHouseholdCode } from '../store/slices/pantryHelpers';

export const useHouseholdSync = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const pull = async () => {
      if (!getHouseholdCode()) return;
      try {
        const vid = getVisitorId();
        const res = await fetch(`/api/pantry-sync?vid=${encodeURIComponent(vid)}`);
        const data = await res.json();
        if (data.items) dispatch(setItems(data.items));
        if (data.mealPlan) dispatch(setMealPlan(data.mealPlan));
      } catch { /* silent */ }
    };

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') pull();
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [dispatch]);
};
