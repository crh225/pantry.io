import { useEffect } from 'react';
import { useAppDispatch } from '../store/hooks';
import { handleAuthCallback, fetchProfile } from '../store/slices/krogerSlice';
import { kroger } from '../services/kroger';

export const useAuthCallback = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('kroger_session');
    const token = params.get('kroger_token');
    const expiresIn = params.get('kroger_expires');
    if (sessionId && token) {
      kroger.handleAuthCallback(sessionId, token, parseInt(expiresIn || '1800', 10));
      dispatch(handleAuthCallback({ sessionId, token, expiresIn: parseInt(expiresIn || '1800', 10) }));
      dispatch(fetchProfile());
      window.history.replaceState({}, '', window.location.pathname + window.location.hash);
    }
  }, [dispatch]);
};
