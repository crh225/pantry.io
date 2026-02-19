export const toDateStr = (ts?: number): string => {
  if (!ts) return '';
  const d = new Date(ts);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export const fromDateStr = (s: string): number | undefined => {
  if (!s) return undefined;
  const d = new Date(s + 'T00:00:00');
  return isNaN(d.getTime()) ? undefined : d.getTime();
};
