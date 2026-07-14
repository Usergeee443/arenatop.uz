import { useEffect } from 'react';
import { SITE } from '../../constants/links';

export default function PageMeta({ title, description, path = '/' }) {
  useEffect(() => {
    document.title = title;

    const setMeta = (selector, attr, value) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        const [key, name] = attr === 'property' ? ['property', selector.slice(12, -2)] : ['name', selector.slice(6, -2)];
        el.setAttribute(key, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', value);
    };

    const url = `${SITE}${path === '/' ? '' : path}`;
    const image = `${SITE}/assets/image_2026-01-14_11-07-56.png`;

    setMeta('meta[name="description"]', 'name', description);
    setMeta('meta[property="og:title"]', 'property', title);
    setMeta('meta[property="og:description"]', 'property', description);
    setMeta('meta[property="og:url"]', 'property', url);
    setMeta('meta[property="og:image"]', 'property', image);
    setMeta('meta[name="twitter:title"]', 'name', title);
    setMeta('meta[name="twitter:description"]', 'name', description);
    setMeta('meta[name="twitter:image"]', 'name', image);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url;
  }, [title, description, path]);

  return null;
}
