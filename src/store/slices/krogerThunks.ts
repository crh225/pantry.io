import { createAsyncThunk } from '@reduxjs/toolkit';
import { kroger } from '../../services/kroger';
import { SESSION_KEY, TOKEN_KEY, EXPIRY_KEY } from './krogerTypes';

export const handleAuthCallback = createAsyncThunk(
  'kroger/handleAuthCallback',
  async ({ sessionId, token, expiresIn }: { sessionId: string; token: string; expiresIn: number }) => {
    localStorage.setItem(SESSION_KEY, sessionId);
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(EXPIRY_KEY, (Date.now() + expiresIn * 1000).toString());
    return { sessionId, expiresIn };
  }
);

export const fetchProfile = createAsyncThunk(
  'kroger/fetchProfile',
  async () => kroger.fetchProfile()
);
