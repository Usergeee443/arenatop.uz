import { Link } from 'react-router-dom';
import {
  APP_STORE,
  EMAIL,
  INSTAGRAM,
  INSTAGRAM_HANDLE,
  OSCo,
  PHONE,
  PHONE_DISPLAY,
  PLAY_STORE,
  TELEGRAM,
  TELEGRAM_HANDLE,
} from '../../constants/links';

const LOGO = '/assets/image_2026-01-14_11-08-19.png';
const OSCO_LOGO = encodeURI('/assets/Logo tr.png');

function IconTelegram({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.3-.07-.45-.51-.19l-9.48 6-4.1-1.3c-.88-.27-.89-.86.19-1.28L18.9 5.4c.73-.33 1.5.17 1.22 1.28l-2.55 12.02c-.18.84-.7 1.04-1.42.65l-3.93-2.9-1.89 1.82c-.22.22-.4.4-.82.4z" />
    </svg>
  );
}

function IconInstagram({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="footer footer--app footer--compact site-footer">
      <div className="container">
        <div className="footer-c footer-c--desktop">
          <div className="footer-c__brand">
            <Link to="/" className="footer-c__logo" aria-label="ArenaTop">
              <img src={LOGO} alt="ArenaTop" />
            </Link>
            <p className="footer-c__tag">Sport maydonlarini bron qilish platformasi.</p>
            <div className="footer-c__socials">
              <a href={TELEGRAM} target="_blank" rel="noopener noreferrer">
                Telegram · {TELEGRAM_HANDLE}
              </a>
              <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer">
                Instagram · {INSTAGRAM_HANDLE}
              </a>
            </div>
          </div>

          <div className="footer-c__cols">
            <div>
              <h4>Menyu</h4>
              <Link to="/">Maydonlar</Link>
              <Link to="/bronlarim">Bronlarim</Link>
              <Link to="/sevimlilar">Sevimli</Link>
              <Link to="/profil">Profil</Link>
            </div>
            <div>
              <h4>Yordam</h4>
              <Link to="/stadioni-borlar">Stadioni borlar uchun</Link>
              <Link to="/yordam">Yordam</Link>
              <Link to="/biz-haqimizda">Biz haqimizda</Link>
              <Link to="/yuklab-olish">Yuklab olish</Link>
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
              <a href={`tel:${PHONE}`}>{PHONE_DISPLAY}</a>
            </div>
            <div>
              <h4>Hujjatlar</h4>
              <Link to="/oferta">Oferta</Link>
              <Link to="/privacy">Maxfiylik siyosati</Link>
              <a href={APP_STORE} target="_blank" rel="noopener noreferrer">App Store</a>
              <a href={PLAY_STORE} target="_blank" rel="noopener noreferrer">Google Play</a>
            </div>
          </div>
        </div>

        <div className="footer-m">
          <div className="footer-m__row">
            <Link to="/" className="footer-m__brand" aria-label="ArenaTop">
              <img src={LOGO} alt="ArenaTop" />
            </Link>
            <div className="footer-m__social">
              <a href={TELEGRAM} target="_blank" rel="noopener noreferrer" aria-label="Telegram">
                <IconTelegram size={18} />
              </a>
              <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <IconInstagram size={18} />
              </a>
            </div>
          </div>
          <div className="footer-m__links">
            <Link to="/yordam">Yordam</Link>
            <Link to="/stadioni-borlar">Stadion</Link>
            <Link to="/yuklab-olish">Ilova</Link>
            <Link to="/oferta">Oferta</Link>
          </div>
          <div className="footer-m__copy">
            <span>© {new Date().getFullYear()} ArenaTop</span>
            <a href={OSCo} target="_blank" rel="noopener noreferrer" className="footer-osco" aria-label="Osco">
              <img src={OSCO_LOGO} alt="Osco" />
            </a>
          </div>
        </div>

        <div className="footer-c__bottom footer-c__bottom--desktop">
          <span>© {new Date().getFullYear()} ArenaTop</span>
          <a href={OSCo} target="_blank" rel="noopener noreferrer" className="footer-osco" aria-label="Osco">
            <img src={OSCO_LOGO} alt="Osco" />
          </a>
        </div>
      </div>
    </footer>
  );
}
