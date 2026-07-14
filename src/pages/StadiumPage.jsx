import { Link, useParams } from 'react-router-dom';
import Header from '../components/layout/Header';
import PageMeta from '../components/layout/PageMeta';
import { homeArenas } from '../data/homeContent';
import { useDownload } from '../context/DownloadContext';

export default function StadiumPage() {
  const { slug } = useParams();
  const { openDownload } = useDownload();
  const arena = homeArenas.find((a) => a.slug === slug);

  if (!arena) {
    return (
      <>
        <Header variant="consumer" />
        <section className="legal">
          <div className="container legal__inner">
            <h1 className="display-title">Stadion topilmadi</h1>
            <p className="display-lead">Bu arena hozircha ro‘yxatda yo‘q.</p>
            <Link to="/" className="btn btn--primary">
              Bosh sahifa
            </Link>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageMeta
        title={`${arena.name} — ArenaTop`}
        description={`${arena.name} · ${arena.city}. ArenaTop orqali onlayn bron qiling.`}
        path={`/stadion/${arena.slug}`}
      />
      <Header variant="consumer" />

      <section className="stadium-hero">
        <img src={arena.image} alt={arena.name} className="stadium-hero__bg" />
        <div className="stadium-hero__overlay" />
        <div className="container stadium-hero__content">
          <p className="hero__eyebrow">
            {arena.city} · {arena.sport}
          </p>
          <h1 className="display-title display-title--light">{arena.name}</h1>
          <p className="display-lead display-lead--light">
            Bo‘sh vaqtlarni ko‘ring va ArenaTop ilovasi orqali bir bosishda bron qiling.
          </p>
          <div className="hero__actions">
            <button type="button" className="btn btn--primary btn--lg" onClick={openDownload}>
              Ilovani yuklab olish
            </button>
            <Link to="/" className="btn btn--ghost-light btn--lg">
              Bosh sahifa
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
