import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { KrogerStore } from '../../services/kroger';
import { CartItem, STORE_KEY, SESSION_KEY, TOKEN_KEY, EXPIRY_KEY, PROFILE_KEY } from './krogerTypes';
import { loadInitialState, saveCart } from './krogerHelpers';
import { handleAuthCallback, fetchProfile } from './krogerThunks';

const krogerSlice = createSlice({
  name: 'kroger',
  initialState: loadInitialState(),
  reducers: {
    setStore: (state, action: PayloadAction<KrogerStore>) => {
      state.selectedStore = action.payload;
      try { localStorage.setItem(STORE_KEY, JSON.stringify(action.payload)); } catch {}
    },
    clearStore: (state) => { state.selectedStore = null; localStorage.removeItem(STORE_KEY); },
    logout: (state) => {
      Object.assign(state, { isAuthenticated: false, sessionId: null, tokenExpiry: null, profile: null });
      [SESSION_KEY, TOKEN_KEY, EXPIRY_KEY, PROFILE_KEY].forEach(k => localStorage.removeItem(k));
    },
    addCartItem: (state, action: PayloadAction<Omit<CartItem, 'addedAt'>>) => {
      const existing = state.cartItems.find(i => i.upc === action.payload.upc);
      if (existing) existing.quantity += action.payload.quantity;
      else state.cartItems.push({ ...action.payload, addedAt: Date.now() });
      saveCart(state.cartItems);
    },
    removeCartItem: (state, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter(i => i.upc !== action.payload);
      saveCart(state.cartItems);
    },
    clearCart: (state) => { state.cartItems = []; saveCart([]); },
    setPendingSend: (state, action: PayloadAction<boolean>) => { state.pendingSend = action.payload; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(handleAuthCallback.fulfilled, (state, { payload }) => {
        Object.assign(state, { isAuthenticated: true, sessionId: payload.sessionId,
          tokenExpiry: Date.now() + payload.expiresIn * 1000 });
      })
      .addCase(fetchProfile.pending, (state) => { state.profileLoading = true; })
      .addCase(fetchProfile.fulfilled, (state, { payload }) => {
        state.profile = payload; state.profileLoading = false;
        if (payload) try { localStorage.setItem(PROFILE_KEY, JSON.stringify(payload)); } catch {}
      })
      .addCase(fetchProfile.rejected, (state) => { state.profileLoading = false; });
  },
});

export { handleAuthCallback, fetchProfile };
export type { CartItem } from './krogerTypes';
export const { setStore, clearStore, logout, addCartItem, removeCartItem, clearCart, setPendingSend } = krogerSlice.actions;
export default krogerSlice.reducer;
