import { useEffect, useState } from 'react';

export default function Preloader() {
  const [show, setShow] = useState(
    () => typeof sessionStorage !== 'undefined' && sessionStorage.getItem('arenaTopVisited') !== '1'
  );

  useEffect(() => {
    if (!show) return;

    const t = setTimeout(() => {
      setShow(false);
      try {
        sessionStorage.setItem('arenaTopVisited', '1');
      } catch {
        /* ignore */
      }
    }, 600);

    return () => clearTimeout(t);
  }, [show]);

  if (!show) return null;

  return (
    <div className="preloader" aria-hidden="true">
      <img src="/assets/image_2026-01-14_11-08-19.png" alt="" className="preloader__logo" />
    </div>
  );
}
