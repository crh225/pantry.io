const BASE = 'https://www.themealdb.com/api/json/v2';

function jsonRes(obj, status) {
  return new Response(JSON.stringify(obj), {
    status, headers: { 'Content-Type': 'application/json' },
  });
}

export async function onRequest({ request, env }) {
  const url = new URL(request.url);
  const apiPath = url.searchParams.get('path') || '';
  if (!apiPath) return jsonRes({ error: 'Missing path param' }, 400);
  if (!env.MEALDB_API_KEY) return jsonRes({ error: 'API key not configured' }, 500);

  try {
    const res = await fetch(`${BASE}/${env.MEALDB_API_KEY}/${apiPath}`, {
      headers: { 'Accept': 'application/json' },
    });
    const body = await res.text();
    return new Response(body, {
      status: res.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return jsonRes({ error: e.message }, 500);
  }
}
