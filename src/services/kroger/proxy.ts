export async function krogerFetch(apiPath: string): Promise<any> {
  const res = await fetch(`/api/kroger?path=${encodeURIComponent(apiPath)}`);
  if (!res.ok) return null;
  return res.json();
}

export async function krogerPost(apiPath: string, body: any, method: string = 'PUT'): Promise<any> {
  const res = await fetch(`/api/kroger?path=${encodeURIComponent(apiPath)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ _method: method, _body: body }),
  });
  if (!res.ok) {
    const err = await res.text().catch(() => 'Unknown error');
    throw new Error(err);
  }
  return res.json().catch(() => ({}));
}
