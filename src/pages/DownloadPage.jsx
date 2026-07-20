import { Link } from 'react-router-dom';
import PageMeta from '../components/layout/PageMeta';
import { APP_STORE, PLAY_STORE } from '../constants/links';

const LOGO = '/assets/image_2026-01-14_11-08-19.png';

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="currentColor">
      <path d="M16.37 12.66c-.03-2.58 2.1-3.82 2.2-3.88-1.2-1.76-3.07-2-3.73-2.03-1.59-.16-3.1.94-3.9.94-.81 0-2.05-.92-3.37-.89-1.73.03-3.33 1.01-4.22 2.56-1.81 3.14-.46 7.78 1.29 10.33.86 1.25 1.88 2.65 3.22 2.6 1.3-.05 1.79-.84 3.36-.84 1.56 0 2.01.84 3.38.81 1.4-.02 2.28-1.27 3.13-2.53.98-1.44 1.38-2.83 1.41-2.9-.03-.01-2.69-1.03-2.72-4.09zM14.5 5.6c.71-.86 1.19-2.05 1.06-3.24-1.02.04-2.26.68-2.99 1.54-.66.76-1.23 1.98-1.08 3.14 1.14.09 2.3-.58 3.01-1.44z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="currentColor">
      <path d="M3.61 1.81L13.79 12 3.61 22.19a1 1 0 01-.61-.92V2.73a1 1 0 01.61-.92zm10.89 10.89l2.3 2.3-10.93 6.34 8.63-8.64zm3.2-3.2l2.8 1.63a1 1 0 010 1.73l-2.8 1.63L15.21 12l2.49-2.5zM5.86 2.66L16.8 8.99l-2.3 2.3-8.64-8.63z" />
    </svg>
  );
}

export default function DownloadPage() {
  return (
    <>
      <PageMeta
        title="Yuklab olish — ArenaTop"
        description="ArenaTop ilovasini App Store yoki Google Play dan yuklab oling."
        path="/yuklab-olish"
      />

      <header className="dl-nav">
        <div className="container dl-nav__inner">
          <Link to="/" className="dl-nav__logo" aria-label="ArenaTop">
            <img src={LOGO} alt="ArenaTop" />
          </Link>
          <Link to="/" className="btn btn--primary btn--sm">
            Saytga o‘tish
          </Link>
        </div>
      </header>

      <section className="app-page download-page">
        <div className="container download-page__wrap">
          <div className="download-page__hero">
            <h1>Ilovani yuklab olish</h1>
            <p>Maydon qidirish, bron va to‘lov — telefoningizda tez va qulay.</p>
          </div>

          <div className="download-page__stores">
            <a href={APP_STORE} target="_blank" rel="noopener noreferrer" className="dl-store-btn">
              <AppleIcon />
              <span>
                <small>Yuklab oling</small>
                <strong>App Store</strong>
              </span>
            </a>
            <a href={PLAY_STORE} target="_blank" rel="noopener noreferrer" className="dl-store-btn">
              <PlayIcon />
              <span>
                <small>Yuklab oling</small>
                <strong>Google Play</strong>
              </span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
