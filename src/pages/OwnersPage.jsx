import { Link } from 'react-router-dom';
import AppHeader from '../components/layout/AppHeader';
import PageMeta from '../components/layout/PageMeta';
import { EMAIL, PHONE, PHONE_DISPLAY, TELEGRAM, TELEGRAM_HANDLE } from '../constants/links';

const benefits = [
  {
    title: 'Onlayn bron',
    text: 'Mijozlar 24/7 bron qiladi. Qo‘ng‘iroq va daftar kerak emas.',
  },
  {
    title: 'Jonli jadval',
    text: 'Bo‘sh va band vaqtlar real vaqtda — konfliktlar kamayadi.',
  },
  {
    title: 'To‘lovlar',
    text: 'Payme va Click orqali oldindan to‘lov. Pul shaffof keladi.',
  },
  {
    title: 'SMS eslatma',
    text: 'Bron haqida avtomatik xabar — “no-show” kamayadi.',
  },
  {
    title: 'Hisobotlar',
    text: 'Kunlik va oylik daromad, bandlik statistikasi bir joyda.',
  },
  {
    title: 'Ko‘p maydon',
    text: 'Bir necha zal yoki kortni bitta kabinetdan boshqaring.',
  },
];

const steps = [
  {
    n: '01',
    title: 'Ariza qoldiring',
    text: 'Email yoki Telegram orqali maydoningiz haqida yozing.',
  },
  {
    n: '02',
    title: 'Profil sozlanadi',
    text: 'Jamoamiz maydon, narx, jadval va rasmlarni tizimga kiritadi.',
  },
  {
    n: '03',
    title: 'Bron ochiladi',
    text: 'Maydoningiz ArenaTop da ko‘rinadi — mijozlar onlayn bron qiladi.',
  },
];

export default function OwnersPage() {
  return (
    <>
      <PageMeta
        title="Stadioni borlar uchun — ArenaTop"
        description="Maydoningizni ArenaTop ga ulang: onlayn bron, to‘lov, SMS va hisobotlar."
        path="/stadioni-borlar"
      />
      <AppHeader />

      <section className="app-page owners-page">
        <div className="container owners-page__wrap">
          <span className="eyebrow">Stadion egalari</span>
          <h1 className="display-title">Stadioni borlar uchun</h1>
          <p className="display-lead">
            Maydoningizni ArenaTop ga ulang. Bronlar, to‘lovlar, mijozlar va hisobotlar — bitta tizimda.
            Qo‘ng‘iroq va qog‘oz ishidan voz keching.
          </p>

          <div className="owners-hero-cta">
            <a href={`mailto:${EMAIL}?subject=Stadion%20ulash`} className="btn btn--primary btn--lg">
              Ulash uchun yozing
            </a>
            <a href={TELEGRAM} target="_blank" rel="noopener noreferrer" className="btn btn--ghost btn--lg">
              Telegram {TELEGRAM_HANDLE}
            </a>
          </div>

          <div className="owners-stats">
            <div><strong>+38%</strong><span>o‘rtacha bandlik</span></div>
            <div><strong>−70%</strong><span>qo‘ng‘iroqlar</span></div>
            <div><strong>24/7</strong><span>onlayn bron</span></div>
            <div><strong>5 min</strong><span>ulanish</span></div>
          </div>

          <h2 className="owners-h2">Nima olasiz?</h2>
          <div className="owners-grid">
            {benefits.map((b) => (
              <article key={b.title}>
                <h3>{b.title}</h3>
                <p>{b.text}</p>
              </article>
            ))}
          </div>

          <div className="owners-visual">
            <img src="/assets/BUSINESS.png" alt="ArenaTop stadion kabineti" loading="lazy" />
            <img src="/assets/BUSINESS 2.png" alt="ArenaTop moliya hisobotlari" loading="lazy" />
          </div>

          <h2 className="owners-h2">Qanday qo‘shilish mumkin?</h2>
          <div className="owners-steps">
            {steps.map((s) => (
              <article key={s.n}>
                <span>{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </article>
            ))}
          </div>

          <div className="owners-contact">
            <h2>Bog‘lanish</h2>
            <p>Ulanish yoki demo uchun quyidagi kanallar orqali murojaat qiling.</p>
            <div className="help-actions">
              <a href={`mailto:${EMAIL}?subject=Stadion%20ulash`} className="btn btn--primary">
                {EMAIL}
              </a>
              <a href={`tel:${PHONE}`} className="btn btn--ghost">
                {PHONE_DISPLAY}
              </a>
              <a href={TELEGRAM} target="_blank" rel="noopener noreferrer" className="btn btn--ghost">
                {TELEGRAM_HANDLE}
              </a>
            </div>
            <p className="app-muted" style={{ marginTop: '1rem' }}>
              <Link to="/yordam" className="text-link">Yordam</Link>
              {' · '}
              <Link to="/" className="text-link">Maydonlarni ko‘rish</Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
