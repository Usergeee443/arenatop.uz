import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listCourts } from '../api/courts';
import AppHeader from '../components/layout/AppHeader';
import PageMeta from '../components/layout/PageMeta';
import Reveal from '../components/ui/Reveal';
import {
  aboutFacts,
  aboutMission,
  aboutOwnerReviews,
  aboutStats,
  aboutStory,
  aboutTeam,
  aboutUserReviews,
  aboutValues,
} from '../data/aboutContent';
import {
  EMAIL,
  INSTAGRAM,
  INSTAGRAM_HANDLE,
  OSCo,
  PHONE,
  PHONE_DISPLAY,
  TELEGRAM,
  TELEGRAM_HANDLE,
  TELEGRAM_SUPPORT,
  TELEGRAM_SUPPORT_HANDLE,
} from '../constants/links';

export default function AboutPage() {
  const [courtCount, setCourtCount] = useState(null);

  useEffect(() => {
    listCourts({ limit: 100 })
      .then((data) => setCourtCount(Array.isArray(data) ? data.length : null))
      .catch(() => setCourtCount(null));
  }, []);

  const stats = aboutStats.map((s) =>
    s.liveKey === 'courts' && courtCount != null
      ? { ...s, value: String(courtCount) }
      : s.liveKey === 'courts'
        ? { ...s, value: '—' }
        : s
  );

  return (
    <>
      <PageMeta
        title="Biz haqimizda — ArenaTop"
        description="ArenaTop — O‘zbekistonda sport maydonlarini onlayn bron qilish platformasi. Maqsad, jamoa, statistika va aloqa."
        path="/biz-haqimizda"
      />
      <AppHeader />

      <div className="ab">
        <section className="ab-hero">
          <div className="container ab-hero__inner">
            <p className="ab-kicker">Kompaniya</p>
            <h1>Biz haqimizda</h1>
            <p className="ab-hero__lead">
              ArenaTop — O‘zbekistondagi sport maydonlari va zallarni qidirish, bron qilish va to‘lash
              uchun yaratilgan platforma. 2025-yilda ishga tushganimizdan beri foydalanuvchilar va
              stadion egalari uchun sportni rejalashtirishni osonlashtiramiz.
            </p>
          </div>
        </section>

        <section className="ab-stats">
          <div className="container ab-stats__grid">
            {stats.map((s) => (
              <Reveal key={s.label}>
                <div className="ab-stat">
                  <strong>{s.value}</strong>
                  <span>{s.label}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="ab-section">
          <div className="container ab-split">
            <Reveal>
              <p className="ab-kicker">{aboutMission.title}</p>
              <h2 className="ab-title">Sportni hamma uchun qulay qilish</h2>
            </Reveal>
            <Reveal delay={80}>
              <p className="ab-text">{aboutMission.text}</p>
              <ul className="ab-facts">
                {aboutFacts.map((f) => (
                  <li key={f.label}>
                    <span>{f.label}</span>
                    <strong>{f.value}</strong>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        <section className="ab-section ab-section--soft">
          <div className="container">
            <Reveal>
              <p className="ab-kicker">Tarix</p>
              <h2 className="ab-title">Qanday boshlandi</h2>
            </Reveal>
            <ol className="ab-timeline">
              {aboutStory.map((item, i) => (
                <Reveal key={item.title} delay={i * 90}>
                  <li className="ab-timeline__item">
                    <span className="ab-timeline__year">{item.year}</span>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        <section className="ab-section">
          <div className="container">
            <Reveal>
              <p className="ab-kicker">Qadriyatlar</p>
              <h2 className="ab-title">Nimalarga ishonamiz</h2>
            </Reveal>
            <div className="ab-values">
              {aboutValues.map((v, i) => (
                <Reveal key={v.title} delay={i * 70}>
                  <article className="ab-value">
                    <h3>{v.title}</h3>
                    <p>{v.text}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="ab-section ab-section--dark">
          <div className="container">
            <Reveal>
              <p className="ab-kicker ab-kicker--light">Kimlar uchun</p>
              <h2 className="ab-title ab-title--light">Ikki tomon — bitta platforma</h2>
            </Reveal>
            <div className="ab-audience">
              <Reveal>
                <article>
                  <h3>Foydalanuvchilar</h3>
                  <p>
                    Yaqinidagi maydonni toping, bo‘sh vaqtni ko‘ring, onlayn to‘lang va o‘ynang. Sharhlar
                    va reytinglar tanlovni osonlashtiradi.
                  </p>
                  <Link to="/" className="btn btn--primary btn--sm">
                    Maydonlarni ko‘rish
                  </Link>
                </article>
              </Reveal>
              <Reveal delay={100}>
                <article>
                  <h3>Stadion egalari</h3>
                  <p>
                    100% bepul ulaning. Onlayn bron, oldindan to‘lov va jadval — ArenaTop Biznes
                    ilovasida.
                  </p>
                  <Link to="/stadioni-borlar" className="btn btn--ghost-light btn--sm">
                    Batafsil
                  </Link>
                </article>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="ab-section">
          <div className="container">
            <Reveal>
              <p className="ab-kicker">Sharhlar</p>
              <h2 className="ab-title">Foydalanuvchilar nima deydi</h2>
            </Reveal>
            <div className="ab-reviews">
              {aboutUserReviews.map((r, i) => (
                <Reveal key={r.name} delay={i * 80}>
                  <figure className="ab-review">
                    <blockquote>“{r.text}”</blockquote>
                    <figcaption>
                      <span className="ab-review__avatar">{r.initials}</span>
                      <span>
                        <strong>{r.name}</strong>
                        <em>{r.role}</em>
                      </span>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>

            <Reveal>
              <h3 className="ab-subtitle">Stadion egalari</h3>
            </Reveal>
            <div className="ab-reviews">
              {aboutOwnerReviews.map((r, i) => (
                <Reveal key={r.name} delay={i * 80}>
                  <figure className="ab-review ab-review--owner">
                    <blockquote>“{r.text}”</blockquote>
                    <figcaption>
                      <span className="ab-review__avatar">{r.initials}</span>
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

        <section className="ab-section ab-section--soft">
          <div className="container">
            <Reveal>
              <p className="ab-kicker">Jamoa</p>
              <h2 className="ab-title">Bizning jamoa</h2>
              <p className="ab-text ab-text--narrow">
                Kichik, lekin jiddiy jamoa. Mahsulot, texnika, hamkorlik va yordam — bitta maqsad
                atrofida.
              </p>
            </Reveal>
            <div className="ab-team">
              {aboutTeam.map((m, i) => (
                <Reveal key={m.role} delay={i * 70}>
                  <article className="ab-team__card">
                    <h3>{m.role}</h3>
                    <p>{m.text}</p>
                  </article>
                </Reveal>
              ))}
            </div>
            <Reveal>
              <p className="ab-dev">
                Ishlab chiqaruvchi:{' '}
                <a href={OSCo} target="_blank" rel="noopener noreferrer">
                  Osco
                </a>
              </p>
            </Reveal>
          </div>
        </section>

        <section className="ab-section">
          <div className="container ab-contact">
            <Reveal>
              <p className="ab-kicker">Aloqa</p>
              <h2 className="ab-title">Biz bilan bog‘laning</h2>
              <p className="ab-text">
                Savol, taklif yoki hamkorlik — yozing. Tez javob beramiz.
              </p>
            </Reveal>
            <div className="ab-contact__grid">
              <a href={`mailto:${EMAIL}`} className="ab-contact__item">
                <span>Email</span>
                <strong>{EMAIL}</strong>
              </a>
              <a href={`tel:${PHONE}`} className="ab-contact__item">
                <span>Telefon</span>
                <strong>{PHONE_DISPLAY}</strong>
              </a>
              <a href={TELEGRAM} target="_blank" rel="noopener noreferrer" className="ab-contact__item">
                <span>Telegram</span>
                <strong>{TELEGRAM_HANDLE}</strong>
              </a>
              <a
                href={TELEGRAM_SUPPORT}
                target="_blank"
                rel="noopener noreferrer"
                className="ab-contact__item"
              >
                <span>Yordam</span>
                <strong>{TELEGRAM_SUPPORT_HANDLE}</strong>
              </a>
              <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="ab-contact__item">
                <span>Instagram</span>
                <strong>{INSTAGRAM_HANDLE}</strong>
              </a>
            </div>

            <div className="ab-contact__actions">
              <Link to="/" className="btn btn--primary">
                Maydonlarni ko‘rish
              </Link>
              <Link to="/xarita" className="btn btn--ghost">
                Xarita
              </Link>
              <Link to="/yuklab-olish" className="btn btn--ghost">
                Ilovani yuklash
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
