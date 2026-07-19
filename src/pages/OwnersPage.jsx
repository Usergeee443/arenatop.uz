import AppHeader from '../components/layout/AppHeader';
import PageMeta from '../components/layout/PageMeta';
import Reveal from '../components/ui/Reveal';
import { arenaReviews } from '../data/arenaContent';
import {
  BUSINESS_APP_STORE,
  BUSINESS_PLAY_STORE,
  TELEGRAM_SUPPORT,
  TELEGRAM_SUPPORT_HANDLE,
} from '../constants/links';

const BUSINESS_LOGO = '/assets/BUSINESS.png';

/* 2-sektion: 10 ta afzallik — har biri alohida, o'z aurasi bilan */
const perks = [
  {
    color: '#B1FC40',
    title: '24/7 onlayn bron',
    text: 'Bo‘sh soatlaringiz kechayu kunduz ochiq. Siz uxlaganingizda ham bron tushadi.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    color: '#4FC3F7',
    title: 'Oldindan to‘lov',
    text: 'Payme va Click orqali. Pul bron paytidayoq kafolatlanadi.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <path d="M3 10h18" strokeLinecap="round" />
        <path d="M7 15h4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    color: '#FFB74D',
    title: 'Kelmay qolish deyarli yo‘q',
    text: 'Oldindan to‘lagan mijoz keladi. “Band edi, kelmadi” muammosi unutiladi.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" strokeLinejoin="round" />
        <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    color: '#BA68C8',
    title: 'Jonli jadval',
    text: 'Barcha bronlar bitta kalendarda. Daftar-qalam davri tugadi.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M3 9h18M8 3v4M16 3v4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    color: '#4DD0E1',
    title: 'Statistika va hisobot',
    text: 'Daromad, bandlik, eng ko‘p band soatlar — hammasi grafikalarda.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <path d="M4 20V10M10 20V4M16 20v-7M21 20H3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    color: '#F06292',
    title: 'Yangi mijozlar oqimi',
    text: 'ArenaTop’da maydon izlayotganlar sizni topadi va tanlaydi.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <circle cx="9" cy="8" r="3.2" />
        <path d="M3.5 19c.6-3 2.9-4.5 5.5-4.5s4.9 1.5 5.5 4.5" strokeLinecap="round" />
        <path d="M16 5.5a3 3 0 010 5.5M20.5 19c-.4-2.2-1.7-3.6-3.5-4.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    color: '#E5B22A',
    title: 'Narx sizning qo‘lingizda',
    text: 'Soatlik narx, chegirma va ish vaqtini istalgan payt o‘zingiz o‘zgartirasiz.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <path d="M12 3l8.5 8.5a2 2 0 010 2.8L15 19.8a2 2 0 01-2.8 0L3.7 11.3V3H12z" strokeLinejoin="round" />
        <circle cx="8" cy="8" r="1.4" />
      </svg>
    ),
  },
  {
    color: '#81C784',
    title: 'Doimiy mijozlar bazasi',
    text: 'Kim, qachon, necha marta o‘ynagani — mijozlaringizni taniysiz.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <path d="M12 20s-7-4.5-7-10a4 4 0 017-2.5A4 4 0 0119 10c0 5.5-7 10-7 10z" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    color: '#FF8A65',
    title: 'Qo‘ng‘iroqlarsiz ish',
    text: '“Bo‘sh vaqt bormi?” degan qo‘ng‘iroqlar o‘rniga — tayyor bronlar.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <path d="M8 3H5a2 2 0 00-2 2c0 9 7 16 16 16a2 2 0 002-2v-3l-4-2-2 2c-2.5-1.2-4.8-3.5-6-6l2-2-3-5z" strokeLinejoin="round" />
        <path d="M4 4l16 16" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    color: '#7986CB',
    title: 'Doimiy qo‘llab-quvvatlash',
    text: 'Savol tug‘ilsa — jamoamiz Telegram orqali doim aloqada.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <path d="M4 13a8 8 0 0116 0" strokeLinecap="round" />
        <rect x="3" y="13" width="4" height="6" rx="1.6" />
        <rect x="17" y="13" width="4" height="6" rx="1.6" />
        <path d="M20 19a3 3 0 01-3 3h-3" strokeLinecap="round" />
      </svg>
    ),
  },
];

/* 3-sektion: oldin / keyin */
const before = [
  'Qo‘ng‘iroqlarga soatlab vaqt ketadi',
  'Jadval daftar va qalamda',
  'Mijoz “keladi” deb kelmay qoladi',
  'Bo‘sh soatlarni hech kim ko‘rmaydi',
];
const after = [
  'Bronlar 24/7 avtomatik tushadi',
  'Jadval telefonda, doim yonda',
  'Oldindan to‘lov — mijoz albatta keladi',
  'Bo‘sh soatlar minglab izlovchiga ochiq',
];
const resultStats = [
  { value: '+38%', label: 'bandlik o‘sishi' },
  { value: '−70%', label: 'qo‘ng‘iroqlar' },
  { value: '24/7', label: 'onlayn bron' },
];

/* 5-sektion: ulanish qadamlari */
const steps = [
  { n: '1', title: 'Ilovani yuklab oling', text: 'ArenaTop Biznes — App Store va Google Play’da bepul.' },
  { n: '2', title: 'Ro‘yxatdan o‘ting', text: 'Telefon raqamingiz bilan bir daqiqada kirasiz.' },
  { n: '3', title: 'Stadionni qo‘shing', text: 'Rasmlar, narx va ish vaqtini kiriting.' },
  { n: '4', title: 'Bronlar boshlanadi', text: 'Tekshiruvdan so‘ng maydoningiz saytda jonli bo‘ladi.' },
];

export default function OwnersPage() {
  return (
    <>
      <PageMeta
        title="Stadioni borlar uchun — ArenaTop"
        description="Maydoningizni ArenaTop ga 100% bepul ulang. Onlayn bron, oldindan to‘lov va boshqaruv."
        path="/stadioni-borlar"
      />
      <AppHeader />

      <div className="ow">
        {/* 1 — Hero: faqat katta yozuv + kichik izoh */}
        <section className="ow-hero">
          <div className="ow-hero__wash" aria-hidden="true" />
          <div className="container ow-hero__inner">
            <h1 className="ow-hero__title">
              <span>100% bepulga</span>
              stadioningizni kuchaytiring
            </h1>
            <p className="ow-hero__fine">
              Ulanish bepul. Oylik to‘lov yo‘q. Komissiya yo‘q. Yashirin shartlar yo‘q —
              ArenaTop’dan foydalanish stadion egalari uchun to‘liq va doimiy bepul.
            </p>
            <span className="ow-hero__scroll" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
        </section>

        {/* 2 — Nima olasiz: 10 ta afzallik, har biri alohida */}
        <section className="ow-perks">
          <div className="container">
            <Reveal>
              <p className="ow-kicker">Nima olasiz</p>
              <h2 className="ow-section-title">10 ta sabab</h2>
            </Reveal>
          </div>

          {perks.map((p, i) => (
            <div key={p.title} className="ow-perk" style={{ '--aura': p.color }}>
              <div className="container ow-perk__inner">
                <Reveal className="ow-perk__reveal">
                  <span className="ow-perk__index" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="ow-perk__ico">
                    <span className="ow-perk__aura" aria-hidden="true" />
                    {p.icon}
                  </span>
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                </Reveal>
              </div>
            </div>
          ))}
        </section>

        {/* 3 — Natijalar: oldin va keyin */}
        <section className="ow-results">
          <div className="container">
            <Reveal>
              <p className="ow-kicker ow-kicker--light">Natijalar</p>
              <h2 className="ow-section-title ow-section-title--light">Ulanishdan oldin va keyin</h2>
            </Reveal>

            <div className="ow-compare">
              <Reveal>
                <div className="ow-compare__col ow-compare__col--before">
                  <h3>Oldin</h3>
                  <ul>
                    {before.map((t) => (
                      <li key={t}>
                        <span aria-hidden="true">—</span>
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
              <Reveal delay={120}>
                <div className="ow-compare__col ow-compare__col--after">
                  <h3>Keyin</h3>
                  <ul>
                    {after.map((t) => (
                      <li key={t}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>

            <div className="ow-results__stats">
              {resultStats.map((s, i) => (
                <Reveal key={s.label} delay={i * 100}>
                  <div className="ow-results__stat">
                    <strong>{s.value}</strong>
                    <span>{s.label}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 4 — Stadion egalarining fikrlari */}
        <section className="ow-voices">
          <div className="container">
            <Reveal>
              <p className="ow-kicker">Fikrlar</p>
              <h2 className="ow-section-title">Stadion egalari nima deydi</h2>
            </Reveal>

            <div className="ow-voices__grid">
              {arenaReviews.map((r, i) => (
                <Reveal key={r.name} delay={i * 90}>
                  <figure className="ow-voice">
                    <blockquote>{r.text}</blockquote>
                    <figcaption>
                      <span className="ow-voice__avatar">{r.initials}</span>
                      <span>
                        <strong>{r.name}</strong>
                        <em>{r.role}</em>
                      </span>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 5 — Qanday ulanish */}
        <section className="ow-how">
          <div className="container">
            <Reveal>
              <p className="ow-kicker">Ulanish</p>
              <h2 className="ow-section-title">To‘rt qadam kifoya</h2>
            </Reveal>

            <ol className="ow-steps">
              {steps.map((s, i) => (
                <Reveal key={s.n} delay={i * 110}>
                  <li className="ow-step">
                    <span className="ow-step__n">{s.n}</span>
                    <h3>{s.title}</h3>
                    <p>{s.text}</p>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* 6 — Ulanish: Biznes ilova + support */}
        <section className="ow-join">
          <div className="container ow-join__inner">
            <Reveal>
              <img
                src={BUSINESS_LOGO}
                alt="ArenaTop Biznes"
                className="ow-join__logo"
                width="520"
                height="292"
                loading="lazy"
              />
              <h2>ArenaTop Biznes ilovasini yuklab oling</h2>
              <p>Stadioningizni ulash uchun bizning biznes ilovamiz kerak bo‘ladi — bepul yuklab oling.</p>

              <div className="ow-join__stores">
                <a href={BUSINESS_APP_STORE} target="_blank" rel="noopener noreferrer" aria-label="App Store">
                  <img
                    src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                    alt="Download on the App Store"
                    width="160"
                    height="54"
                    loading="lazy"
                  />
                </a>
                <a href={BUSINESS_PLAY_STORE} target="_blank" rel="noopener noreferrer" aria-label="Google Play">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                    alt="Get it on Google Play"
                    width="180"
                    height="54"
                    loading="lazy"
                  />
                </a>
              </div>

              <div className="ow-join__support">
                <p>Ulay olmadingizmi yoki savolingiz bormi?</p>
                <a href={TELEGRAM_SUPPORT} target="_blank" rel="noopener noreferrer" className="btn btn--ghost-light">
                  Telegram: {TELEGRAM_SUPPORT_HANDLE}
                </a>
              </div>
            </Reveal>
          </div>
        </section>
      </div>
    </>
  );
}
