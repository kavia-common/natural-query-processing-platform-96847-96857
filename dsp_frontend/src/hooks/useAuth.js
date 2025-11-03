/**
 * Lightweight auth state using localStorage token.
 * Provides helper to set and clear token and exposes isAuthenticated.
 */
import { useCallback, useMemo, useSyncExternalStore } from 'react';
import { setToken as persistToken, clearToken as removeToken } from '../api/client';

const STORAGE_KEY = 'jwt_token';

// Subscribe to storage changes to react to cross-tab updates
function subscribe(callback) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

function getSnapshot() {
  return localStorage.getItem(STORAGE_KEY) || '';
}

function getServerSnapshot() {
  return '';
}

// PUBLIC_INTERFACE
export function useAuthProvider() {
  const token = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isAuthenticated = Boolean(token);

  const setToken = useCallback((newToken) => {
    persistToken(newToken);
    // emit storage event for same-tab listeners
    window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY }));
  }, []);

  const logout = useCallback(() => {
    removeToken();
    window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY }));
  }, []);

  return useMemo(() => ({ token, isAuthenticated, setToken, logout }), [token, isAuthenticated, setToken, logout]);
}
