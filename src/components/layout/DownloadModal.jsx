import { APP_STORE, PLAY_STORE } from '../../constants/links';
import { useDownload } from '../../context/DownloadContext';

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M3 20.5V3.5C3 2.91 3.34 2.39 3.84 2.15L13.69 12 3.84 21.85C3.34 21.6 3 21.09 3 20.5zM16.81 15.12L6.05 21.34l9.49-9.49L16.81 15.12zM20.16 10.81c.34.27.34.73 0 1L16.81 14.15 15.54 11.88 20.16 10.81zM6.05 2.66l10.76 6.22-2.27 1.45L6.05 2.66z" />
    </svg>
  );
}

export default function DownloadModal() {
  const { open, closeDownload } = useDownload();

  if (!open) return null;

  return (
    <div className={`dl${open ? ' is-open' : ''}`} aria-hidden={!open}>
      <button type="button" className="dl__backdrop" aria-label="Yopish" onClick={closeDownload} />
      <div className="dl__panel" role="dialog" aria-modal="true" aria-label="Ilovani yuklab olish">
        <div className="dl__header">
          <div className="dl__title">Ilovani yuklab olish</div>
          <button type="button" className="dl__close" aria-label="Yopish" onClick={closeDownload}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="dl__content">
          <p className="dl__lead">ArenaTop mobil ilovasini rasmiy do‘konlardan yuklab oling.</p>
          <div className="dl__stores">
            <a href={APP_STORE} className="store" target="_blank" rel="noopener noreferrer">
              <span className="store__ico"><AppleIcon /></span>
              <span>
                <span className="store__top">Yuklash</span>
                <span className="store__name">App Store</span>
              </span>
            </a>
            <a href={PLAY_STORE} className="store" target="_blank" rel="noopener noreferrer">
              <span className="store__ico"><PlayIcon /></span>
              <span>
                <span className="store__top">Yuklash</span>
                <span className="store__name">Google Play</span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
