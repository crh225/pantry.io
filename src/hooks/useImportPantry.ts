import { useEffect, useState } from 'react';
import { useAppDispatch } from '../store/hooks';
import { addItem } from '../store/slices/pantrySlice';
import { decodePantry } from '../utils/shareLink';

export const useImportPantry = () => {
  const [imported, setImported] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    // New short share URL: ?s={id}
    const shareId = params.get('s');
    if (shareId) {
      fetch(`/api/share?id=${encodeURIComponent(shareId)}`)
        .then(res => {
          if (!res.ok) throw new Error('Share not found or expired');
          return res.json();
        })
        .then(data => {
          if (data.items && data.items.length > 0) {
            data.items.forEach((i: any) =>
              dispatch(addItem({ name: i.name, quantity: i.quantity, location: i.location }))
            );
            setImported(true);
            window.history.replaceState({}, '', window.location.pathname);
            setTimeout(() => setImported(false), 4000);
          }
        })
        .catch(() => {});
      return;
    }

    // Legacy base64 share URL: ?pantry={code}
    const code = params.get('pantry');
    if (!code) return;
    const items = decodePantry(code);
    if (items.length === 0) return;
    items.forEach(i => dispatch(addItem({ name: i.name, quantity: i.quantity, location: i.location })));
    setImported(true);
    window.history.replaceState({}, '', window.location.pathname);
    setTimeout(() => setImported(false), 4000);
  }, [dispatch]);

  const dismiss = () => setImported(false);
  return { imported, dismiss };
};
