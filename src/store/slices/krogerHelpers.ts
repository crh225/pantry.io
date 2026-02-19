import { KrogerState, CartItem, SESSION_KEY, TOKEN_KEY, EXPIRY_KEY, STORE_KEY, CART_KEY, PROFILE_KEY } from './krogerTypes';

export const loadInitialState = (): KrogerState => {
  try {
    const sessionId = localStorage.getItem(SESSION_KEY);
    const token = localStorage.getItem(TOKEN_KEY);
    const tokenExpiry = parseInt(localStorage.getItem(EXPIRY_KEY) || '0', 10) || null;
    const isTokenValid = !!sessionId && !!token && tokenExpiry !== null && Date.now() < tokenExpiry - 60000;
    return {
      isAuthenticated: isTokenValid, sessionId, tokenExpiry,
      selectedStore: JSON.parse(localStorage.getItem(STORE_KEY) || 'null'),
      cartItems: JSON.parse(localStorage.getItem(CART_KEY) || '[]'),
      profile: JSON.parse(localStorage.getItem(PROFILE_KEY) || 'null'),
      profileLoading: false, pendingSend: false,
    };
  } catch {
    return {
      isAuthenticated: false, sessionId: null, tokenExpiry: null,
      selectedStore: null, cartItems: [], profile: null,
      profileLoading: false, pendingSend: false,
    };
  }
};

export const saveCart = (items: CartItem[]) => {
  try { localStorage.setItem(CART_KEY, JSON.stringify(items)); } catch {}
};
