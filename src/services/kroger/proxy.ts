/** Proxy Kroger API calls through Cloudflare Pages Function */
export async function krogerFetch(apiPath: string): Promise<any> {
  const res = await fetch(`/api/kroger${apiPath}`);
  if (!res.ok) return null;
  return res.json();
}
