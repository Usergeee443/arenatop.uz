import Header from '../components/layout/Header';
import PageMeta from '../components/layout/PageMeta';
import { ContactCta } from '../components/sections/CtaSections';
import FeatureScroll from '../components/sections/FeatureScroll';
import { ReviewsMarquee } from '../components/sections/Marquees';
import { SectionHeader } from '../components/sections/Sections';
import Faq from '../components/ui/Faq';
import Reveal from '../components/ui/Reveal';
import {
  arenaFaq,
  arenaModules,
  arenaReviews,
  arenaShowcase,
  arenaStats,
} from '../data/arenaContent';
import useHashScroll from '../hooks/useHashScroll';

export default function ArenaPage() {
  useHashScroll();

  return (
    <>
      <PageMeta
        title="Arenalarga — ArenaTop Biznes"
        description="ArenaTop Biznes — sport maydonlari uchun CRM: bronlar, mijozlar, moliya va SMS."
        path="/arena"
      />
      <Header variant="business" />

      <section className="hero hero--biz hero--fullscreen" id="home">
        <div className="container hero__shell">
          <div className="hero__grid hero__grid--minimal">
            <div className="hero__content">
              <p className="hero__eyebrow">ArenaTop Biznes</p>
              <h1 className="hero__title">
                Maydoningiz uchun
                <span className="accent"> aqlli CRM</span>
              </h1>
              <p className="hero__lead">
                Bronlar, mijozlar va moliya — bitta tizimda. Bandlikni oshiring, qog‘oz ishidan voz keching.
              </p>
              <div className="hero__actions">
                <a href="#contact" className="btn btn--primary btn--lg">
                  Demo olish
                </a>
                <a href="#features" className="btn btn--ghost-light btn--lg">
                  Imkoniyatlar
                </a>
              </div>
            </div>
            <div className="hero__visual">
              <div className="hero__device hero__device--bare">
                <img
                  src="/assets/BUSINESS.png"
                  alt="ArenaTop Biznes ekrani"
                  width="340"
                  height="700"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <FeatureScroll items={arenaShowcase} />

      <section className="section section--tinted">
        <div className="container">
          <Reveal>
            <SectionHeader
              eyebrow="Modullar"
              title="Biznesingiz uchun to‘liq to‘plam"
              lead="Kichik zaldan multi-maydon kompleksigacha — tizim sizga moslashadi."
            />
          </Reveal>
          <Reveal>
            <div className="tiles tiles--biz">
              {arenaModules.map((m) => (
                <div key={m.title} className="tile">
                  <h3 className="tile__title">{m.title}</h3>
                  <p className="tile__text">{m.text}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="stats">
        <div className="container">
          <div className="stats__grid">
            {arenaStats.map((s) => (
              <div key={s.label} className="stat">
                <div className="stat__value">{s.value}</div>
                <div className="stat__label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="reviews">
        <div className="container">
          <Reveal>
            <SectionHeader eyebrow="Fikrlar" title="Arena egalari nima deydi?" />
          </Reveal>
        </div>
        <ReviewsMarquee reviews={arenaReviews} />
      </section>

      <section className="section section--tinted" id="faq">
        <div className="container">
          <Reveal>
            <SectionHeader eyebrow="Savol-javob" title="Arenalar uchun" />
          </Reveal>
          <Reveal>
            <Faq items={arenaFaq} />
          </Reveal>
        </div>
      </section>

      <ContactCta />
    </>
  );
}
