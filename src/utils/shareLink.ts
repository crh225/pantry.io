import { PantryItem } from '../types';

export const encodePantry = (items: PantryItem[]): string => {
  const compact = items.map(i => `${i.name}|${i.quantity}|${i.location}`);
  const json = JSON.stringify(compact);
  return btoa(encodeURIComponent(json));
};

export const decodePantry = (code: string): PantryItem[] => {
  try {
    const json = decodeURIComponent(atob(code));
    const compact: string[] = JSON.parse(json);
    return compact.map((s, i) => {
      const [name, quantity, location] = s.split('|');
      return { id: `import-${Date.now()}-${i}`, name, quantity, location: location as any };
    });
  } catch { return []; }
};

export const buildShareUrl = (items: PantryItem[]): string => {
  const code = encodePantry(items);
  return `${window.location.origin}${window.location.pathname}?pantry=${code}`;
};
