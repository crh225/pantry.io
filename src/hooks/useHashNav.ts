import { useState, useEffect, useCallback } from 'react';

type Page = 'pantry' | 'recipes' | 'planner' | 'cart' | 'history';
const VALID: Page[] = ['pantry', 'recipes', 'planner', 'cart', 'history'];

const read = (): Page => {
  const h = window.location.hash.replace('#', '') as Page;
  return VALID.includes(h) ? h : 'pantry';
};

export function useHashNav() {
  const [page, setPage] = useState<Page>(read);

  useEffect(() => {
    const handler = () => setPage(read());
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  const navigate = useCallback((p: Page) => {
    window.location.hash = p;
  }, []);

  return { page, navigate };
}
