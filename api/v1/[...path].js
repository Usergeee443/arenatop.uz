/**
 * Same-origin proxy for ArenaTop API.
 * Browser → /v1/* → this function → https://api.arenatop.uz/v1/*
 * Avoids CORS and avoids browser new URL() issues with relative bases.
 */
export default async function handler(req, res) {
  try {
    const pathPart = req.query.path;
    const pathStr = Array.isArray(pathPart) ? pathPart.join('/') : pathPart || '';
    const target = new URL(`https://api.arenatop.uz/v1/${pathStr}`);

    // Forward query params except the catch-all "path"
    for (const [key, value] of Object.entries(req.query)) {
      if (key === 'path') continue;
      if (Array.isArray(value)) value.forEach((v) => target.searchParams.append(key, v));
      else if (value != null) target.searchParams.set(key, String(value));
    }

    const headers = { Accept: 'application/json' };
    if (req.headers.authorization) headers.Authorization = req.headers.authorization;
    if (req.headers['content-type']) headers['Content-Type'] = req.headers['content-type'];

    const init = { method: req.method, headers };
    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body != null) {
      init.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    }

    const upstream = await fetch(target.toString(), init);
    const text = await upstream.text();

    res.status(upstream.status);
    const ct = upstream.headers.get('content-type');
    if (ct) res.setHeader('Content-Type', ct);
    const total = upstream.headers.get('x-total-count');
    if (total) res.setHeader('X-Total-Count', total);
    res.send(text);
  } catch (err) {
    res.status(502).json({
      detail: err?.message || 'API proxy xatosi',
    });
  }
}
