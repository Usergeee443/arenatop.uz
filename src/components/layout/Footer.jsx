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

export default function Footer() {
  return (
    <footer className="footer footer--app footer--compact">
      <div className="container">
        <div className="footer-c">
          <div className="footer-c__brand">
            <Link to="/" className="footer-c__logo" aria-label="ArenaTop">
              <img src={LOGO} alt="ArenaTop" />
            </Link>
            <p className="footer-c__tag">Sport maydonlarini bron qilish platformasi.</p>
            <div className="footer-c__socials">
              <a href={TELEGRAM} target="_blank" rel="noopener noreferrer">
                Telegram {TELEGRAM_HANDLE}
              </a>
              <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer">
                Instagram {INSTAGRAM_HANDLE}
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
              <Link to="/ilova">Ilova</Link>
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

        <div className="footer-c__bottom">
          <span>© {new Date().getFullYear()} ArenaTop</span>
          <span>
            Ishlab chiqqan <a href={OSCo} target="_blank" rel="noopener noreferrer">Osco</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
