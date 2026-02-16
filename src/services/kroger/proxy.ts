export async function krogerFetch(apiPath: string): Promise<any> {
  const res = await fetch(`/api/kroger?path=${encodeURIComponent(apiPath)}`);
  if (!res.ok) return null;
  return res.json();
}
