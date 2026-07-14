import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function useHashScroll(deps = []) {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const id = hash.replace('#', '');
    const timer = setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 88;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }, 80);
    return () => clearTimeout(timer);
  }, [pathname, hash, ...deps]);
}
