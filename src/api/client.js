const API_BASE = import.meta.env.VITE_API_BASE || 'https://api.arenatop.uz/v1';

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

function buildUrl(path, query) {
  const url = new URL(path.startsWith('http') ? path : `${API_BASE}${path}`);
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return;
      url.searchParams.set(key, String(value));
    });
  }
  return url.toString();
}

async function tryRefresh() {
  const refresh = getRefreshToken();
  if (!refresh) return false;
  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
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

  let res = await fetch(buildUrl(path, query), opts);

  if (res.status === 401 && auth) {
    const ok = await tryRefresh();
    if (ok) {
      opts.headers.Authorization = `Bearer ${getAccessToken()}`;
      res = await fetch(buildUrl(path, query), opts);
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
