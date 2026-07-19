import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listCourts } from '../api/courts';
import Header from '../components/layout/Header';
import PageMeta from '../components/layout/PageMeta';
import DownloadCta, { HomeFaqAnswer } from '../components/sections/CtaSections';
import FeatureScroll from '../components/sections/FeatureScroll';
import { ArenasMarquee, OwnerTeaser, ReviewsMarquee } from '../components/sections/Marquees';
import { SectionHeader } from '../components/sections/Sections';
import Faq from '../components/ui/Faq';
import Reveal from '../components/ui/Reveal';
import {
  homeArenas,
  homeFaq,
  homeReviews,
  homeShowcase,
  ownerTeasers,
} from '../data/homeContent';
import useHashScroll from '../hooks/useHashScroll';

const HERO_PHONE = encodeURI('/assets/iPhone 15 Pro Max.png');

export default function HomePage() {
  const [arenas, setArenas] = useState(homeArenas);
  useHashScroll();

  useEffect(() => {
    listCourts({ limit: 12, sort_by: 'rating' })
      .then((data) => {
        if (Array.isArray(data) && data.length) setArenas(data);
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <PageMeta
        title="ArenaTop ilova — Sport maydonlarini bron qilish"
        description="ArenaTop mobil ilova va imkoniyatlar."
        path="/ilova"
      />
      <Header variant="consumer" />

      <section className="hero hero--home hero--fullscreen" id="home">
        <div className="container hero__shell">
          <div className="hero__grid hero__grid--minimal">
            <div className="hero__content">
              <p className="hero__eyebrow">Mobil ilova</p>
              <h1 className="hero__title">
                ArenaTop ni
                <span className="accent"> telefoningizga oling</span>
              </h1>
              <p className="hero__lead">Yoki saytda darhol bron qiling — login, qidiruv va to‘lov hammasi bor.</p>
              <div className="hero__actions">
                <Link to="/" className="btn btn--primary btn--lg">
                  Saytda bron qilish
                </Link>
                <Link to="/yuklab-olish" className="btn btn--ghost-light btn--lg">
                  Yuklab olish
                </Link>
              </div>
            </div>
            <div className="hero__visual">
              <div className="hero__device hero__device--bare">
                <img src={HERO_PHONE} alt="ArenaTop ilova ekrani" width="340" height="700" loading="eager" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <FeatureScroll items={homeShowcase} />

      <section className="section section--arenas" id="arenas">
        <div className="container">
          <Reveal>
            <SectionHeader eyebrow="Arenalar" title="Bizda mavjud arenalar" lead="Tanlang va onlayn bron qiling." />
          </Reveal>
          <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
            <Link to="/" className="btn btn--ghost">
              Barcha maydonlar
            </Link>
          </div>
        </div>
        <ArenasMarquee arenas={arenas} />
      </section>

      <OwnerTeaser reviews={ownerTeasers} />

      <section className="section section--tinted" id="reviews">
        <div className="container">
          <Reveal>
            <SectionHeader eyebrow="Fikrlar" title="Foydalanuvchilar nima deydi?" />
          </Reveal>
        </div>
        <ReviewsMarquee reviews={homeReviews} />
      </section>

      <section className="section" id="faq">
        <div className="container">
          <Reveal>
            <SectionHeader eyebrow="Savol-javob" title="Tez-tez so‘raladigan savollar" />
          </Reveal>
          <Reveal>
            <Faq items={homeFaq} renderAnswer={(item) => <HomeFaqAnswer item={item} />} />
          </Reveal>
        </div>
      </section>

      <DownloadCta />
    </>
  );
}
