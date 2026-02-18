import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { KrogerStore, KrogerProfile } from '../../services/kroger';
import { kroger } from '../../services/kroger';

const STORE_KEY = 'kroger_selected_store';
const SESSION_KEY = 'kroger_session_id';
const TOKEN_KEY = 'kroger_access_token';
const EXPIRY_KEY = 'kroger_token_expiry';
const CART_KEY = 'kroger_cart_items';
const PROFILE_KEY = 'kroger_profile';

export interface CartItem {
  upc: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image?: string;
  addedAt: number;
}

interface KrogerState {
  isAuthenticated: boolean;
  sessionId: string | null;
  tokenExpiry: number | null;
  selectedStore: KrogerStore | null;
  cartItems: CartItem[];
  profile: KrogerProfile | null;
  profileLoading: boolean;
}

// Load initial state from localStorage
const loadInitialState = (): KrogerState => {
  try {
    const sessionId = localStorage.getItem(SESSION_KEY);
    const token = localStorage.getItem(TOKEN_KEY);
    const tokenExpiry = parseInt(localStorage.getItem(EXPIRY_KEY) || '0', 10) || null;
    // Check if token exists AND is not expired (with 60s buffer)
    const isTokenValid = !!sessionId && !!token && tokenExpiry !== null && Date.now() < tokenExpiry - 60000;
    return {
      isAuthenticated: isTokenValid,
      sessionId,
      tokenExpiry,
      selectedStore: JSON.parse(localStorage.getItem(STORE_KEY) || 'null'),
      cartItems: JSON.parse(localStorage.getItem(CART_KEY) || '[]'),
      profile: JSON.parse(localStorage.getItem(PROFILE_KEY) || 'null'),
      profileLoading: false,
    };
  } catch {
    return {
      isAuthenticated: false,
      sessionId: null,
      tokenExpiry: null,
      selectedStore: null,
      cartItems: [],
      profile: null,
      profileLoading: false,
    };
  }
};

// Thunk for handling OAuth callback
export const handleAuthCallback = createAsyncThunk(
  'kroger/handleAuthCallback',
  async ({ sessionId, token, expiresIn }: { sessionId: string; token: string; expiresIn: number }) => {
    localStorage.setItem(SESSION_KEY, sessionId);
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(EXPIRY_KEY, (Date.now() + expiresIn * 1000).toString());
    return { sessionId, expiresIn };
  }
);

// Thunk for fetching user profile
export const fetchProfile = createAsyncThunk(
  'kroger/fetchProfile',
  async () => {
    const profile = await kroger.fetchProfile();
    return profile;
  }
);

const saveCart = (items: CartItem[]) => {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch {
    // localStorage full or unavailable in private browsing
  }
};

const krogerSlice = createSlice({
  name: 'kroger',
  initialState: loadInitialState(),
  reducers: {
    setStore: (state, action: PayloadAction<KrogerStore>) => {
      state.selectedStore = action.payload;
      try {
        localStorage.setItem(STORE_KEY, JSON.stringify(action.payload));
      } catch {
        // localStorage full or unavailable in private browsing
      }
    },
    clearStore: (state) => {
      state.selectedStore = null;
      localStorage.removeItem(STORE_KEY);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.sessionId = null;
      state.tokenExpiry = null;
      state.profile = null;
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(EXPIRY_KEY);
      localStorage.removeItem(PROFILE_KEY);
    },
    addCartItem: (state, action: PayloadAction<Omit<CartItem, 'addedAt'>>) => {
      const existing = state.cartItems.find(i => i.upc === action.payload.upc);
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.cartItems.push({ ...action.payload, addedAt: Date.now() });
      }
      saveCart(state.cartItems);
    },
    removeCartItem: (state, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter(i => i.upc !== action.payload);
      saveCart(state.cartItems);
    },
    clearCart: (state) => {
      state.cartItems = [];
      saveCart([]);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(handleAuthCallback.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.sessionId = action.payload.sessionId;
        state.tokenExpiry = Date.now() + action.payload.expiresIn * 1000;
      })
      .addCase(fetchProfile.pending, (state) => {
        state.profileLoading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.profileLoading = false;
        if (action.payload) {
          try {
            localStorage.setItem(PROFILE_KEY, JSON.stringify(action.payload));
          } catch {}
        }
      })
      .addCase(fetchProfile.rejected, (state) => {
        state.profileLoading = false;
      });
  },
});

export const { setStore, clearStore, logout, addCartItem, removeCartItem, clearCart } = krogerSlice.actions;
export default krogerSlice.reducer;
