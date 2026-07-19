import { Link } from 'react-router-dom';
import PageMeta from '../components/layout/PageMeta';
import { APP_STORE, PLAY_STORE } from '../constants/links';

const LOGO = '/assets/image_2026-01-14_11-08-19.png';

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
            <a href={APP_STORE} target="_blank" rel="noopener noreferrer" className="download-page__badge" aria-label="App Store">
              <img
                src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                alt="Download on the App Store"
                width="160"
                height="54"
                loading="lazy"
              />
            </a>
            <a href={PLAY_STORE} target="_blank" rel="noopener noreferrer" className="download-page__badge" aria-label="Google Play">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Get it on Google Play"
                width="180"
                height="54"
                loading="lazy"
              />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
