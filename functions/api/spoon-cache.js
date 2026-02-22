const DB = 'https://pantry-io-eeccf-default-rtdb.firebaseio.com';

export function cacheKey(path) {
  return path
    .replace(/[\/\.#\$\[\]]/g, '_')
    .replace(/[^a-zA-Z0-9_\-]/g, '')
    .slice(0, 200);
}

export async function getCache(key) {
  try {
    const res = await fetch(`${DB}/spoon-cache/${key}.json`);
    const data = await res.json();
    if (!data || !data.body) return null;
    return data;
  } catch {
    return null;
  }
}

export async function setCache(key, body, secret) {
  try {
    await fetch(`${DB}/spoon-cache/${key}.json?auth=${secret}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body, cachedAt: Date.now() }),
    });
  } catch {
    /* fire and forget */
  }
}
