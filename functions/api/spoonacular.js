const BASE = 'https://api.spoonacular.com';
const DB = 'https://pantry-io-eeccf-default-rtdb.firebaseio.com';
const TTL = 24 * 60 * 60 * 1000;

function cacheKey(path) {
  return path.replace(/[\/\.#\$\[\]]/g, '_').replace(/[^a-zA-Z0-9_\-]/g, '').slice(0, 200);
}

async function getCache(key) {
  try {
    const res = await fetch(`${DB}/spoon-cache/${key}.json`);
    const data = await res.json();
    return data?.body ? data : null;
  } catch { return null; }
}

async function setCache(key, body, secret) {
  try {
    await fetch(`${DB}/spoon-cache/${key}.json?auth=${secret}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body, cachedAt: Date.now() }),
    });
  } catch { /* fire and forget */ }
}

function jsonRes(obj, status) {
  return new Response(JSON.stringify(obj), {
    status, headers: { 'Content-Type': 'application/json' },
  });
}

export async function onRequest({ request, env }) {
  const url = new URL(request.url);
  const apiPath = url.searchParams.get('path') || '';
  if (!apiPath) return jsonRes({ error: 'Missing path param' }, 400);
  if (!env.SPOON_API_KEY) return jsonRes({ error: 'API key not configured' }, 500);

  const key = cacheKey(apiPath);
  const cached = await getCache(key);
  if (cached && (Date.now() - cached.cachedAt) < TTL) {
    return new Response(cached.body, { status: 200, headers: { 'Content-Type': 'application/json', 'X-Cache': 'HIT' } });
  }

  try {
    const sep = apiPath.includes('?') ? '&' : '?';
    const res = await fetch(`${BASE}${apiPath}${sep}apiKey=${env.SPOON_API_KEY}`, { headers: { 'Accept': 'application/json' } });
    const body = await res.text();
    if (!res.ok) {
      if (cached) return new Response(cached.body, { status: 200, headers: { 'Content-Type': 'application/json', 'X-Cache': 'STALE' } });
      return new Response(body, { status: res.status, headers: { 'Content-Type': 'application/json' } });
    }
    if (env.FIREBASE_SECRET) setCache(key, body, env.FIREBASE_SECRET);
    return new Response(body, { status: 200, headers: { 'Content-Type': 'application/json', 'X-Cache': 'MISS' } });
  } catch (e) {
    if (cached) return new Response(cached.body, { status: 200, headers: { 'Content-Type': 'application/json', 'X-Cache': 'STALE' } });
    return jsonRes({ error: e.message }, 500);
  }
}
