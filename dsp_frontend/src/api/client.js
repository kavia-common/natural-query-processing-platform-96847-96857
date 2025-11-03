//
// Simple API client using fetch with JSON and Bearer token support.
// Reads base URL from REACT_APP_BACKEND_URL and falls back to same-origin.
//
const BASE_URL = process.env.REACT_APP_BACKEND_URL || '';

function getToken() {
  try {
    return localStorage.getItem('jwt_token') || '';
  } catch {
    return '';
  }
}

/**
 * PUBLIC_INTERFACE
 * apiRequest
 * Performs a JSON fetch to the backend with optional auth.
 * @param {string} path - API path starting with /
 * @param {object} options - fetch options: method, body, headers, auth
 * @returns {Promise<{ok:boolean,status:number,data:any,error?:string}>}
 */
export async function apiRequest(path, options = {}) {
  const url = `${BASE_URL}${path}`;

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  // Attach token if present or if auth explicitly true
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const fetchOptions = {
    method: options.method || 'GET',
    headers,
  };

  if (options.body) {
    fetchOptions.body = JSON.stringify(options.body);
  }

  try {
    const res = await fetch(url, fetchOptions);
    const contentType = res.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const payload = isJson ? await res.json() : await res.text();

    if (!res.ok) {
      return { ok: false, status: res.status, data: payload, error: (payload && payload.detail) || 'Request failed' };
    }
    return { ok: true, status: res.status, data: payload };
  } catch (err) {
    return { ok: false, status: 0, data: null, error: err?.message || 'Network error' };
  }
}

/**
 * PUBLIC_INTERFACE
 * setToken
 * Persists the JWT token to localStorage.
 */
export function setToken(token) {
  if (!token) return;
  try {
    localStorage.setItem('jwt_token', token);
  } catch {
    // ignore
  }
}

/**
 * PUBLIC_INTERFACE
 * clearToken
 * Removes stored JWT token.
 */
export function clearToken() {
  try {
    localStorage.removeItem('jwt_token');
  } catch {
    // ignore
  }
}
