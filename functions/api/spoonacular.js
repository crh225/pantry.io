const BASE = 'https://api.spoonacular.com';

export async function onRequest({ request, env }) {
  const url = new URL(request.url);
  const apiPath = url.searchParams.get('path') || '';

  if (!apiPath) {
    return new Response(JSON.stringify({ error: 'Missing path param' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!env.SPOONACULAR_API_KEY) {
    return new Response(JSON.stringify({ error: 'API key not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Add API key to the path
    const separator = apiPath.includes('?') ? '&' : '?';
    const fullUrl = `${BASE}${apiPath}${separator}apiKey=${env.SPOONACULAR_API_KEY}`;

    const res = await fetch(fullUrl, {
      headers: { 'Accept': 'application/json' },
    });

    const body = await res.text();
    return new Response(body, {
      status: res.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
