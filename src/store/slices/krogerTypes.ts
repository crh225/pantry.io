import { KrogerStore, KrogerProfile } from '../../services/kroger';

export const STORE_KEY = 'kroger_selected_store';
export const SESSION_KEY = 'kroger_session_id';
export const TOKEN_KEY = 'kroger_access_token';
export const EXPIRY_KEY = 'kroger_token_expiry';
export const CART_KEY = 'kroger_cart_items';
export const PROFILE_KEY = 'kroger_profile';

export interface CartItem {
  upc: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image?: string;
  addedAt: number;
}

export interface KrogerState {
  isAuthenticated: boolean;
  sessionId: string | null;
  tokenExpiry: number | null;
  selectedStore: KrogerStore | null;
  cartItems: CartItem[];
  profile: KrogerProfile | null;
  profileLoading: boolean;
  pendingSend: boolean;
}
