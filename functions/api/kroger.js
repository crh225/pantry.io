const BASE = 'https://api-ce.kroger.com';

let cachedToken = null;

async function getToken(env) {
  if (cachedToken && Date.now() < cachedToken.expires) return cachedToken.token;
  const creds = btoa(`${env.KROGER_CLIENT_ID}:${env.KROGER_CLIENT_SECRET}`);
  const res = await fetch(`${BASE}/v1/connect/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${creds}`,
    },
    body: 'grant_type=client_credentials&scope=product.compact',
  });
  if (!res.ok) throw new Error(`Auth failed: ${res.status}`);
  const data = await res.json();
  cachedToken = { token: data.access_token, expires: Date.now() + (data.expires_in - 60) * 1000 };
  return cachedToken.token;
}

export async function onRequest({ request, env }) {
  const url = new URL(request.url);
  const apiPath = url.searchParams.get('path') || '';
  if (!apiPath) {
    return new Response(JSON.stringify({ error: 'Missing path param' }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const token = await getToken(env);

    // Support forwarded PUT/POST requests (e.g. cart API)
    const fetchOpts = {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    };

    if (request.method === 'POST') {
      const payload = await request.json().catch(() => null);
      if (payload && payload._method) {
        fetchOpts.method = payload._method;
        fetchOpts.headers['Content-Type'] = 'application/json';
        fetchOpts.body = JSON.stringify(payload._body);
      }
    }

    const res = await fetch(`${BASE}${apiPath}`, fetchOpts);
    const body = await res.text();
    return new Response(body, {
      status: res.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }
}
