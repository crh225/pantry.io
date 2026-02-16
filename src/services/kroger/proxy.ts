const PROXY = '/api/kroger';

export async function krogerFetch(apiPath: string): Promise<any> {
  const res = await fetch(`${PROXY}?path=${encodeURIComponent(apiPath)}`);
  if (!res.ok) return null;
  return res.json();
}
