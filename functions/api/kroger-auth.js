const KROGER_BASE = 'https://api.kroger.com';
const DB = 'https://pantry-io-eeccf-default-rtdb.firebaseio.com';

export async function onRequest({ request, env }) {
  const url = new URL(request.url);
  const action = url.searchParams.get('action');
  const clientId = env.KROGER_CLIENT_ID;
  const clientSecret = env.KROGER_CLIENT_SECRET;
  const firebaseSecret = env.FIREBASE_SECRET;
  const redirectUri = `${url.origin}/api/kroger-auth?action=callback`;

  if (action === 'login') {
    const authUrl = `${KROGER_BASE}/v1/connect/oauth2/authorize` +
      `?scope=${encodeURIComponent('cart.basic:write product.compact profile.compact')}` +
      `&response_type=code` +
      `&client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}`;

    return Response.redirect(authUrl, 302);
  }

  if (action === 'callback') {
    const code = url.searchParams.get('code');
    if (!code) {
      return new Response('Missing authorization code', { status: 400 });
    }

    try {
      const creds = btoa(`${clientId}:${clientSecret}`);
      const tokenRes = await fetch(`${KROGER_BASE}/v1/connect/oauth2/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${creds}`,
        },
        body: `grant_type=authorization_code&code=${encodeURIComponent(code)}&redirect_uri=${encodeURIComponent(redirectUri)}`,
      });

      if (!tokenRes.ok) {
        const err = await tokenRes.text();
        return new Response(`Token exchange failed: ${err}`, { status: 500 });
      }

      const tokenData = await tokenRes.json();
      const sessionId = crypto.randomUUID();

      // Store refresh token in Firebase
      if (firebaseSecret && tokenData.refresh_token) {
        await fetch(`${DB}/kroger_sessions/${sessionId}.json?auth=${firebaseSecret}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            refresh_token: tokenData.refresh_token,
            createdAt: Date.now(),
          }),
        });
      }

      // Redirect back to app with session info
      const appUrl = `${url.origin}/?kroger_session=${sessionId}` +
        `&kroger_token=${tokenData.access_token}` +
        `&kroger_expires=${tokenData.expires_in || 1800}`;

      return Response.redirect(appUrl, 302);
    } catch (e) {
      return new Response(`Auth error: ${e.message}`, { status: 500 });
    }
  }

  if (action === 'refresh') {
    const sessionId = url.searchParams.get('session');
    if (!sessionId || !firebaseSecret) {
      return new Response(JSON.stringify({ error: 'Missing session' }), {
        status: 400, headers: { 'Content-Type': 'application/json' },
      });
    }

    try {
      // Get refresh token from Firebase
      const sessionRes = await fetch(`${DB}/kroger_sessions/${encodeURIComponent(sessionId)}.json?auth=${firebaseSecret}`);
      const session = await sessionRes.json();
      if (!session || !session.refresh_token) {
        return new Response(JSON.stringify({ error: 'Session expired' }), {
          status: 401, headers: { 'Content-Type': 'application/json' },
        });
      }

      const creds = btoa(`${clientId}:${clientSecret}`);
      const tokenRes = await fetch(`${KROGER_BASE}/v1/connect/oauth2/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${creds}`,
        },
        body: `grant_type=refresh_token&refresh_token=${encodeURIComponent(session.refresh_token)}`,
      });

      if (!tokenRes.ok) {
        // Refresh token may have expired
        await fetch(`${DB}/kroger_sessions/${encodeURIComponent(sessionId)}.json?auth=${firebaseSecret}`, { method: 'DELETE' });
        return new Response(JSON.stringify({ error: 'Refresh failed, please re-login' }), {
          status: 401, headers: { 'Content-Type': 'application/json' },
        });
      }

      const tokenData = await tokenRes.json();

      // Update refresh token if a new one was issued
      if (tokenData.refresh_token) {
        await fetch(`${DB}/kroger_sessions/${encodeURIComponent(sessionId)}.json?auth=${firebaseSecret}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: tokenData.refresh_token }),
        });
      }

      return new Response(JSON.stringify({
        access_token: tokenData.access_token,
        expires_in: tokenData.expires_in || 1800,
      }), {
        status: 200, headers: { 'Content-Type': 'application/json' },
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), {
        status: 500, headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  return new Response(JSON.stringify({ error: 'Unknown action' }), {
    status: 400, headers: { 'Content-Type': 'application/json' },
  });
}
