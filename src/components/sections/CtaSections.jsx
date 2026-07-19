import { Link } from 'react-router-dom';
import { APP_STORE, EMAIL, PLAY_STORE } from '../../constants/links';

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

export default function DownloadCta() {
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=0&data=${encodeURIComponent(APP_STORE)}`;

  return (
    <section className="section" id="download">
      <div className="container">
        <div className="cta">
          <div className="cta__copy">
            <span className="eyebrow eyebrow--light">Yuklab olish</span>
            <h2 className="display-title display-title--light">
              Ilovani
              <br />
              telefoningizga oling
            </h2>
            <p className="display-lead display-lead--light">
              Rasmiy do‘konlardan yuklab oling yoki QR-kodni skanerlang.
            </p>
            <div className="cta__stores">
              <a href={APP_STORE} className="store" target="_blank" rel="noopener noreferrer" aria-label="App Store">
                <span className="store__ico"><AppleIcon /></span>
                <span>
                  <span className="store__top">Yuklab olish</span>
                  <span className="store__name">App Store</span>
                </span>
              </a>
              <a href={PLAY_STORE} className="store" target="_blank" rel="noopener noreferrer" aria-label="Google Play">
                <span className="store__ico"><PlayIcon /></span>
                <span>
                  <span className="store__top">Yuklab olish</span>
                  <span className="store__name">Google Play</span>
                </span>
              </a>
            </div>
          </div>
          <div className="cta__visual">
            <div className="cta__qr" aria-label="QR kod orqali yuklab olish">
              <img src={qr} alt="App Store QR kod" width="180" height="180" loading="lazy" />
            </div>
            <div className="cta__qr-caption">Telefon kamerasi bilan skaner qiling</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ContactCta() {
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=0&data=${encodeURIComponent(`mailto:${EMAIL}`)}`;

  return (
    <section className="section" id="contact">
      <div className="container">
        <div className="cta">
          <div className="cta__copy">
            <span className="eyebrow eyebrow--light">Bog‘laning</span>
            <h2 className="display-title display-title--light">
              Demo olish uchun
              <br />
              bir qator yozing
            </h2>
            <p className="display-lead display-lead--light">
              Email yoki telefon orqali jamoamiz 24 soat ichida bog‘lanadi va tizimni namoyish qiladi.
            </p>
            <div className="cta__stores">
              <a href={`mailto:${EMAIL}`} className="store" aria-label="Email yuborish">
                <span className="store__ico">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </span>
                <span>
                  <span className="store__top">Email</span>
                  <span className="store__name">{EMAIL}</span>
                </span>
              </a>
              <a href="tel:+998901234567" className="store" aria-label="Telefon qilish">
                <span className="store__ico">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </span>
                <span>
                  <span className="store__top">Qo‘ng‘iroq</span>
                  <span className="store__name">+998 90 123 45 67</span>
                </span>
              </a>
            </div>
          </div>
          <div className="cta__visual">
            <div className="cta__qr" aria-label="Email QR kod">
              <img src={qr} alt="Email QR kod" width="180" height="180" loading="lazy" />
            </div>
            <div className="cta__qr-caption">QR skanerlab yozing</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomeFaqAnswer({ item }) {
  if (item.a === 'store-links') {
    return (
      <p>
        Ha — ArenaTop ilovasini{' '}
        <a href={APP_STORE} target="_blank" rel="noopener noreferrer" className="text-link">
          App Store
        </a>{' '}
        dan va{' '}
        <a href={PLAY_STORE} target="_blank" rel="noopener noreferrer" className="text-link">
          Google Play
        </a>{' '}
        dan yuklab olish mumkin.{' '}
        <Link to="/yuklab-olish" className="text-link">
          Yuklab olish
        </Link>
      </p>
    );
  }

  if (item.a === 'arena-contact') {
    return (
      <p>
        <Link to="/stadioni-borlar" className="text-link">
          Stadioni borlar uchun
        </Link>{' '}
        sahifasiga kiring yoki{' '}
        <a href={`mailto:${EMAIL}`} className="text-link">
          {EMAIL}
        </a>{' '}
        ga yozing — jamoamiz sizni ulashga yordam beradi.
      </p>
    );
  }

  return <p>{item.a}</p>;
}
