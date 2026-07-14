import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const DownloadContext = createContext(null);

export function DownloadProvider({ children }) {
  const [open, setOpen] = useState(false);

  const openDownload = useCallback(() => setOpen(true), []);
  const closeDownload = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') closeDownload();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, closeDownload]);

  const value = useMemo(
    () => ({ open, openDownload, closeDownload }),
    [open, openDownload, closeDownload]
  );

  return (
    <DownloadContext.Provider value={value}>{children}</DownloadContext.Provider>
  );
}

export function useDownload() {
  const ctx = useContext(DownloadContext);
  if (!ctx) throw new Error('useDownload must be used within DownloadProvider');
  return ctx;
}
