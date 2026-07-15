/**
 * API base URL resolution.
 * Production / Vercel: always same-origin `/v1` (proxied by /api/v1/[...path].js).
 * Absolute http(s) env is only used when explicitly set (e.g. local without proxy).
 */
function resolveApiBase() {
  const raw = import.meta.env.VITE_API_BASE;
  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (/^https?:\/\//i.test(trimmed)) return trimmed.replace(/\/$/, '');
  }
  // Relative — works with Vite proxy (dev) and Vercel /api/v1 serverless (prod)
  return '/v1';
}

const API_BASE = resolveApiBase();

const TOKEN_KEY = 'arenatop_access';
const REFRESH_KEY = 'arenatop_refresh';

export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY);
}

export function setTokens({ access_token, refresh_token }) {
  if (access_token) localStorage.setItem(TOKEN_KEY, access_token);
  if (refresh_token) localStorage.setItem(REFRESH_KEY, refresh_token);
}

export function clearTokens() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

/** Build fetch URL without `new URL()` for relative bases (avoids Invalid URL). */
function buildUrl(path, query) {
  const base = String(API_BASE || '/v1').replace(/\/$/, '');
  let urlString;

  if (/^https?:\/\//i.test(path)) {
    urlString = path;
  } else {
    const suffix = path.startsWith('/') ? path : `/${path}`;
    const joined = `${base}${suffix}`;
    if (/^https?:\/\//i.test(joined)) {
      urlString = joined;
    } else {
      urlString = joined.startsWith('/') ? joined : `/${joined}`;
    }
  }

  if (query) {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return;
      params.set(key, String(value));
    });
    const qs = params.toString();
    if (qs) urlString += (urlString.includes('?') ? '&' : '?') + qs;
  }

  return urlString;
}

async function tryRefresh() {
  const refresh = getRefreshToken();
  if (!refresh) return false;
  try {
    const res = await fetch(buildUrl('/auth/refresh'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refresh }),
    });
    if (!res.ok) {
      clearTokens();
      return false;
    }
    const data = await res.json();
    setTokens(data);
    return true;
  } catch {
    clearTokens();
    return false;
  }
}

export async function api(path, { method = 'GET', query, body, auth = false, headers = {} } = {}) {
  const opts = {
    method,
    headers: { ...headers },
  };

  if (body !== undefined) {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(body);
  }

  if (auth) {
    const token = getAccessToken();
    if (token) opts.headers.Authorization = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(buildUrl(path, query), opts);
  } catch {
    throw new Error('Serverga ulanib bo‘lmadi. Internetni tekshiring yoki keyinroq urinib ko‘ring.');
  }

  if (res.status === 401 && auth) {
    const ok = await tryRefresh();
    if (ok) {
      opts.headers.Authorization = `Bearer ${getAccessToken()}`;
      try {
        res = await fetch(buildUrl(path, query), opts);
      } catch {
        throw new Error('Serverga ulanib bo‘lmadi. Internetni tekshiring yoki keyinroq urinib ko‘ring.');
      }
    }
  }

  if (res.status === 204) return null;

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { detail: text };
  }

  if (!res.ok) {
    const detail = data?.detail;
    const message = Array.isArray(detail)
      ? detail.map((d) => d.msg || JSON.stringify(d)).join(', ')
      : typeof detail === 'string'
        ? detail
        : detail
          ? JSON.stringify(detail)
          : `Xato ${res.status}`;
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

export { API_BASE };
