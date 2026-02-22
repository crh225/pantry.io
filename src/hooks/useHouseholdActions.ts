import { useState } from 'react';
import { useAppDispatch } from '../store/hooks';
import { setItems } from '../store/slices/pantrySlice';
import { setMealPlan } from '../store/slices/mealPlanSlice';
import { getVisitorId, setVisitorId, setHouseholdCode } from '../store/slices/pantryHelpers';

async function fetchJson(url: string, opts?: RequestInit) {
  const res = await fetch(url, opts);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Request failed`);
  return data;
}

export const useHouseholdActions = (onDone: () => void) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const withLoading = async <T,>(fn: () => Promise<T>): Promise<T | null> => {
    setLoading(true); setError('');
    try { return await fn(); }
    catch (e: any) { setError(e.message); return null; }
    finally { setLoading(false); }
  };

  const createCode = () => withLoading(async () => {
    const data = await fetchJson('/api/household', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vid: getVisitorId() }),
    });
    setHouseholdCode(data.code);
    return data.code as string;
  });

  const joinHousehold = (input: string) => {
    const trimmed = input.trim().toUpperCase();
    if (trimmed.length < 4) { setError('Enter the code from the other device'); return Promise.resolve(null); }
    return withLoading(async () => {
      const data = await fetchJson(`/api/household?code=${encodeURIComponent(trimmed)}`);
      setVisitorId(data.vid); setHouseholdCode(trimmed);
      const sync = await fetchJson(`/api/pantry-sync?vid=${encodeURIComponent(data.vid)}`);
      if (sync.items) dispatch(setItems(sync.items));
      if (sync.mealPlan) dispatch(setMealPlan(sync.mealPlan));
      return trimmed;
    });
  };

  const unlink = () => {
    const id = crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setVisitorId(id); setHouseholdCode(null); onDone();
  };

  return { loading, error, createCode, joinHousehold, unlink };
};
