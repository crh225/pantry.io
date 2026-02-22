import { cacheKey, getCache, setCache } from './spoon-cache.js';

const BASE = 'https://api.spoonacular.com';
const TTL = 24 * 60 * 60 * 1000;

function jsonRes(obj, status) {
  return new Response(JSON.stringify(obj), {
    status, headers: { 'Content-Type': 'application/json' },
  });
}

function cachedRes(cached, tag) {
  return new Response(cached.body, {
    status: 200, headers: { 'Content-Type': 'application/json', 'X-Cache': tag },
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
    return cachedRes(cached, 'HIT');
  }

  try {
    const sep = apiPath.includes('?') ? '&' : '?';
    const res = await fetch(`${BASE}${apiPath}${sep}apiKey=${env.SPOON_API_KEY}`, {
      headers: { 'Accept': 'application/json' },
    });
    const body = await res.text();

    if (!res.ok) {
      if (cached) return cachedRes(cached, 'STALE');
      return new Response(body, { status: res.status, headers: { 'Content-Type': 'application/json' } });
    }

    if (env.FIREBASE_SECRET) setCache(key, body, env.FIREBASE_SECRET);
    return cachedRes({ body }, 'MISS');
  } catch (e) {
    if (cached) return cachedRes(cached, 'STALE');
    return jsonRes({ error: e.message }, 500);
  }
}
