const SESSION_KEY = 'kroger_session_id';
const TOKEN_KEY = 'kroger_access_token';
const EXPIRY_KEY = 'kroger_token_expiry';

export const krogerAuth = {
  isLoggedIn: (): boolean => !!localStorage.getItem(SESSION_KEY) && !!localStorage.getItem(TOKEN_KEY),
  login: () => { window.location.href = '/api/kroger-auth?action=login'; },
  handleCallback: (sessionId: string, accessToken: string, expiresIn: number) => {
    localStorage.setItem(SESSION_KEY, sessionId);
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(EXPIRY_KEY, (Date.now() + expiresIn * 1000).toString());
  },
  getAccessToken: async (): Promise<string | null> => {
    const token = localStorage.getItem(TOKEN_KEY);
    const expiry = parseInt(localStorage.getItem(EXPIRY_KEY) || '0', 10);
    const sessionId = localStorage.getItem(SESSION_KEY);
    if (token && Date.now() < expiry - 60000) return token;
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
      krogerAuth.logout();
    }
    return null;
  },
  logout: () => { [SESSION_KEY, TOKEN_KEY, EXPIRY_KEY].forEach(k => localStorage.removeItem(k)); },
};
