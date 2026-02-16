const CLIENT_ID = 'pantry-io-bbcck99z';
const CLIENT_SECRET = '5U6iqfC1Gu4lURPBdbrktNJ4vr0POmcy5VFcUvfG';
const BASE = 'https://api-ce.kroger.com';

let cachedToken: { token: string; expires: number } | null = null;

async function getToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expires) {
    return cachedToken.token;
  }
  const creds = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
  const res = await fetch(`${BASE}/v1/connect/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${creds}`,
    },
    body: 'grant_type=client_credentials&scope=product.compact',
  });
  if (!res.ok) throw new Error(`Auth failed: ${res.status}`);
  const data: any = await res.json();
  cachedToken = {
    token: data.access_token,
    expires: Date.now() + (data.expires_in - 60) * 1000,
  };
  return cachedToken.token;
}

export const onRequest: PagesFunction = async ({ params, request }) => {
  const pathParts = (params.path as string[]) || [];
  const apiPath = '/' + pathParts.join('/');
  const url = new URL(request.url);
  const qs = url.search;

  try {
    const token = await getToken();
    const krogerUrl = `${BASE}${apiPath}${qs}`;
    const res = await fetch(krogerUrl, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    });
    const body = await res.text();
    return new Response(body, {
      status: res.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
