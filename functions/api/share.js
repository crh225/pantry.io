const DB = 'https://pantry-io-eeccf-default-rtdb.firebaseio.com';

function generateId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  for (const b of bytes) id += chars[b % chars.length];
  return id;
}

export async function onRequest({ request, env }) {
  const url = new URL(request.url);
  const secret = env.FIREBASE_SECRET;

  if (request.method === 'GET') {
    const id = url.searchParams.get('id');
    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing id param' }), {
        status: 400, headers: { 'Content-Type': 'application/json' },
      });
    }

    try {
      const res = await fetch(`${DB}/shares/${encodeURIComponent(id)}.json`);
      if (!res.ok) {
        return new Response(JSON.stringify({ error: 'Not found' }), {
          status: 404, headers: { 'Content-Type': 'application/json' },
        });
      }
      const data = await res.json();
      if (!data) {
        return new Response(JSON.stringify({ error: 'Not found' }), {
          status: 404, headers: { 'Content-Type': 'application/json' },
        });
      }

      // Check expiration
      if (data.expiresAt && Date.now() > data.expiresAt) {
        // Clean up expired share (fire and forget)
        if (secret) {
          fetch(`${DB}/shares/${encodeURIComponent(id)}.json?auth=${secret}`, { method: 'DELETE' }).catch(() => {});
        }
        return new Response(JSON.stringify({ error: 'Share link has expired' }), {
          status: 410, headers: { 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ items: data.items }), {
        status: 200, headers: { 'Content-Type': 'application/json' },
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), {
        status: 500, headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  if (request.method === 'POST') {
    if (!secret) {
      return new Response(JSON.stringify({ error: 'FIREBASE_SECRET not configured' }), {
        status: 500, headers: { 'Content-Type': 'application/json' },
      });
    }

    try {
      const body = await request.json();
      const { items, expiresIn } = body;

      if (!items || !Array.isArray(items) || items.length === 0) {
        return new Response(JSON.stringify({ error: 'Items required' }), {
          status: 400, headers: { 'Content-Type': 'application/json' },
        });
      }

      const id = generateId();
      const now = Date.now();
      const ttl = expiresIn === '7d' ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;

      const shareData = {
        items: items.map(i => ({ name: i.name, quantity: i.quantity, location: i.location })),
        createdAt: now,
        expiresAt: now + ttl,
      };

      const res = await fetch(`${DB}/shares/${id}.json?auth=${secret}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shareData),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`Firebase write failed: ${err}`);
      }

      return new Response(JSON.stringify({ id }), {
        status: 200, headers: { 'Content-Type': 'application/json' },
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), {
        status: 500, headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405, headers: { 'Content-Type': 'application/json' },
  });
}
