const DB = 'https://pantry-io-eeccf-default-rtdb.firebaseio.com';

export async function onRequest({ request, env }) {
  const url = new URL(request.url);
  const secret = env.FIREBASE_SECRET;
  const visitorId = url.searchParams.get('vid');

  if (!visitorId) {
    return new Response(JSON.stringify({ error: 'Missing vid param' }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    });
  }

  // GET: retrieve pantry from Firebase
  if (request.method === 'GET') {
    try {
      const res = await fetch(`${DB}/pantries/${encodeURIComponent(visitorId)}.json`);
      const data = await res.json();
      return new Response(JSON.stringify({ items: data?.items || [], mealPlan: data?.mealPlan || null }), {
        status: 200, headers: { 'Content-Type': 'application/json' },
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), {
        status: 500, headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  // POST: save pantry to Firebase
  if (request.method === 'POST') {
    if (!secret) {
      return new Response(JSON.stringify({ error: 'FIREBASE_SECRET not configured' }), {
        status: 500, headers: { 'Content-Type': 'application/json' },
      });
    }

    try {
      const body = await request.json();
      const data = { updatedAt: Date.now() };
      if (body.items !== undefined) data.items = body.items;
      if (body.mealPlan !== undefined) data.mealPlan = body.mealPlan;

      const res = await fetch(`${DB}/pantries/${encodeURIComponent(visitorId)}.json?auth=${secret}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Firebase write failed');

      return new Response(JSON.stringify({ ok: true }), {
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
