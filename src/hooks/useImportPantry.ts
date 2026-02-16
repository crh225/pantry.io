import { useEffect, useState } from 'react';
import { useAppDispatch } from '../store/hooks';
import { addItem } from '../store/slices/pantrySlice';
import { decodePantry } from '../utils/shareLink';

export const useImportPantry = () => {
  const [imported, setImported] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('pantry');
    if (!code) return;
    const items = decodePantry(code);
    if (items.length === 0) return;
    items.forEach(i => dispatch(addItem({ name: i.name, quantity: i.quantity, location: i.location })));
    setImported(true);
    // Clean URL
    window.history.replaceState({}, '', window.location.pathname);
  }, [dispatch]);

  return imported;
};
