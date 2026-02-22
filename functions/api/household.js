const DB = 'https://pantry-io-eeccf-default-rtdb.firebaseio.com';

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O/1/I to avoid confusion
  let code = '';
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  for (const b of bytes) code += chars[b % chars.length];
  return code;
}

export async function onRequest({ request, env }) {
  const url = new URL(request.url);
  const secret = env.FIREBASE_SECRET;

  // GET: look up visitor ID by household code
  if (request.method === 'GET') {
    const code = url.searchParams.get('code');
    if (!code) {
      return new Response(JSON.stringify({ error: 'Missing code param' }), {
        status: 400, headers: { 'Content-Type': 'application/json' },
      });
    }

    try {
      const res = await fetch(`${DB}/households/${encodeURIComponent(code.toUpperCase())}.json`);
      const data = await res.json();
      if (!data || !data.vid) {
        return new Response(JSON.stringify({ error: 'Code not found' }), {
          status: 404, headers: { 'Content-Type': 'application/json' },
        });
      }
      return new Response(JSON.stringify({ vid: data.vid }), {
        status: 200, headers: { 'Content-Type': 'application/json' },
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), {
        status: 500, headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  // POST: create a household code for a visitor ID
  if (request.method === 'POST') {
    if (!secret) {
      return new Response(JSON.stringify({ error: 'FIREBASE_SECRET not configured' }), {
        status: 500, headers: { 'Content-Type': 'application/json' },
      });
    }

    try {
      const body = await request.json();
      const { vid } = body;
      if (!vid) {
        return new Response(JSON.stringify({ error: 'Missing vid' }), {
          status: 400, headers: { 'Content-Type': 'application/json' },
        });
      }

      const code = generateCode();
      const res = await fetch(`${DB}/households/${code}.json?auth=${secret}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vid, createdAt: Date.now() }),
      });

      if (!res.ok) throw new Error('Firebase write failed');

      return new Response(JSON.stringify({ code }), {
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
