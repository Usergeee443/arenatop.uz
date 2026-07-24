import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCourt, listCourts } from '../api/courts';
import AppHeader from '../components/layout/AppHeader';
import PageMeta from '../components/layout/PageMeta';
import CourtsMap from '../components/map/CourtsMap';
import { courtImage, formatPrice } from '../utils/format';

export default function MapPage() {
  const [courts, setCourts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError('');
      try {
        const list = await listCourts({ limit: 100, sort_by: 'rating' });
        const items = Array.isArray(list) ? list : [];
        const details = await Promise.all(
          items.map((c) =>
            getCourt(c.id)
              .then((detail) => ({ ...c, ...detail }))
              .catch(() => null)
          )
        );
        if (cancelled) return;

        const withCoords = details.filter(
          (c) =>
            c &&
            Number.isFinite(Number(c.latitude)) &&
            Number.isFinite(Number(c.longitude))
        );
        setCourts(withCoords);
        setSelected(withCoords[0] || null);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Xaritani yuklab bo‘lmadi');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <PageMeta
        title="Xarita — ArenaTop"
        description="ArenaTopdagi stadionlar manzillarini xaritada ko‘ring."
        path="/xarita"
      />
      <AppHeader />

      <section className="map-page">
        <div className="map-page__stage">
          {loading && (
            <div className="map-page__status">
              <p>Xarita yuklanmoqda…</p>
            </div>
          )}
          {error && (
            <div className="map-page__status">
              <p className="auth-error">{error}</p>
            </div>
          )}
          {!loading && !error && courts.length === 0 && (
            <div className="map-page__status">
              <p>Xaritada ko‘rsatish uchun manzilli maydon yo‘q.</p>
            </div>
          )}
          {!loading && !error && courts.length > 0 && (
            <CourtsMap courts={courts} selectedId={selected?.id} onSelect={setSelected} />
          )}
        </div>

        {selected && (
          <aside className="map-page__card">
            <img src={courtImage(selected)} alt="" className="map-page__card-img" />
            <div className="map-page__card-body">
              <div className="map-page__card-meta">
                <span>{selected.category?.name || 'Sport'}</span>
                {selected.rating != null && (
                  <span>★ {Number(selected.rating).toFixed(1)}</span>
                )}
              </div>
              <h2>{selected.name}</h2>
              <p>{selected.location_name}</p>
              <strong>{formatPrice(selected.price_per_hour)} / soat</strong>
              <Link to={`/maydon/${selected.id}`} className="btn btn--primary btn--sm">
                Maydonni ko‘rish
              </Link>
            </div>
          </aside>
        )}
      </section>
    </>
  );
}
