const SESSION_KEY = 'kroger_session_id';
const TOKEN_KEY = 'kroger_access_token';
const EXPIRY_KEY = 'kroger_token_expiry';

export const krogerAuth = {
  isLoggedIn: (): boolean => {
    return !!localStorage.getItem(SESSION_KEY) && !!localStorage.getItem(TOKEN_KEY);
  },

  login: () => {
    window.location.href = '/api/kroger-auth?action=login';
  },

  handleCallback: (sessionId: string, accessToken: string, expiresIn: number) => {
    localStorage.setItem(SESSION_KEY, sessionId);
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(EXPIRY_KEY, (Date.now() + expiresIn * 1000).toString());
  },

  getAccessToken: async (): Promise<string | null> => {
    const token = localStorage.getItem(TOKEN_KEY);
    const expiry = parseInt(localStorage.getItem(EXPIRY_KEY) || '0', 10);
    const sessionId = localStorage.getItem(SESSION_KEY);

    // Token still valid (with 60s buffer)
    if (token && Date.now() < expiry - 60000) {
      return token;
    }

    // Try to refresh
    if (sessionId) {
      try {
        const res = await fetch(`/api/kroger-auth?action=refresh&session=${encodeURIComponent(sessionId)}`);
        if (res.ok) {
          const data = await res.json();
          localStorage.setItem(TOKEN_KEY, data.access_token);
          localStorage.setItem(EXPIRY_KEY, (Date.now() + data.expires_in * 1000).toString());
          return data.access_token;
        }
      } catch {}
      // Refresh failed, clear session
      krogerAuth.logout();
    }

    return null;
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EXPIRY_KEY);
  },
};
