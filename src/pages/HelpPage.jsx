import { Link } from 'react-router-dom';
import AppHeader from '../components/layout/AppHeader';
import PageMeta from '../components/layout/PageMeta';
import Faq from '../components/ui/Faq';
import { APP_STORE, EMAIL, PHONE, PHONE_DISPLAY, PLAY_STORE, TELEGRAM } from '../constants/links';
import { useDownload } from '../context/DownloadContext';

const helpFaq = [
  {
    q: 'Qanday bron qilaman?',
    a: 'Maydonni tanlang, sanani va bo‘sh vaqtni belgilang, tizimga kiring va “Bron qilish” tugmasini bosing. Keyin onlayn to‘lovni yakunlang.',
  },
  {
    q: 'To‘lov qanday amalga oshadi?',
    a: 'Payme yoki Click orqali oldindan to‘lov. Ba’zi hollarda (shu kun) to‘lov joyida bo‘lishi mumkin.',
  },
  {
    q: 'Bronni bekor qilsam nima bo‘ladi?',
    a: 'Har bir maydonning bekor qilish oynasi bor. “Bronlarim” bo‘limidan bekor qilishingiz mumkin.',
  },
  {
    q: 'Stadion egasiman — qanday ulanaman?',
    a: '“Stadioni borlar uchun” sahifasiga o‘ting yoki info@arenatop.uz ga yozing.',
  },
];

export default function HelpPage() {
  const { openDownload } = useDownload();

  return (
    <>
      <PageMeta title="Yordam — ArenaTop" description="ArenaTop yordam markazi." path="/yordam" />
      <AppHeader />

      <section className="app-page">
        <div className="container" style={{ maxWidth: 800 }}>
          <span className="eyebrow">Yordam</span>
          <h1 className="display-title">Qanday yordam beramiz?</h1>
          <p className="display-lead">Bron, to‘lov va akkaunt bo‘yicha tez javoblar.</p>

          <div className="help-actions">
            <a href={`mailto:${EMAIL}`} className="btn btn--primary">
              Email: {EMAIL}
            </a>
            <a href={`tel:${PHONE}`} className="btn btn--ghost">
              {PHONE_DISPLAY}
            </a>
            <a href={TELEGRAM} target="_blank" rel="noopener noreferrer" className="btn btn--ghost">
              Telegram
            </a>
          </div>

          <div style={{ marginTop: '2.5rem' }}>
            <Faq items={helpFaq} />
          </div>

          <div className="help-apps">
            <h2>Mobil ilova</h2>
            <p className="app-muted">App Store va Google Play dan yuklab oling.</p>
            <div className="hero__actions">
              <button type="button" className="btn btn--primary" onClick={openDownload}>
                Yuklab olish
              </button>
              <a href={APP_STORE} target="_blank" rel="noopener noreferrer" className="btn btn--ghost">
                App Store
              </a>
              <a href={PLAY_STORE} target="_blank" rel="noopener noreferrer" className="btn btn--ghost">
                Google Play
              </a>
            </div>
          </div>

          <p style={{ marginTop: '2rem' }}>
            <Link to="/stadioni-borlar" className="text-link">
              Stadioni borlar uchun
            </Link>
            {' · '}
            <Link to="/oferta" className="text-link">
              Oferta
            </Link>
            {' · '}
            <Link to="/privacy" className="text-link">
              Maxfiylik
            </Link>
            {' · '}
            <Link to="/biz-haqimizda" className="text-link">
              Biz haqimizda
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
