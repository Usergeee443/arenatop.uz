import { useEffect, useState } from 'react';
import { getCategories, listCourts } from '../api/courts';
import CourtCard from '../components/courts/CourtCard';
import AppHeader from '../components/layout/AppHeader';
import PageMeta from '../components/layout/PageMeta';

export default function CourtsPage() {
  const [courts, setCourts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [qInput, setQInput] = useState('');
  const [q, setQ] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setQ(qInput.trim()), 350);
    return () => clearTimeout(t);
  }, [qInput]);

  useEffect(() => {
    getCategories()
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    listCourts({
      limit: 60,
      q: q || undefined,
      category_id: categoryId || undefined,
      sort_by: sortBy || undefined,
    })
      .then((data) => {
        if (!cancelled) setCourts(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Maydonlarni yuklab bo‘lmadi');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [categoryId, q, sortBy]);

  const searchProps = {
    qInput,
    setQInput,
    categoryId,
    setCategoryId,
    sortBy,
    setSortBy,
    categories,
  };

  return (
    <>
      <PageMeta
        title="ArenaTop — Sport maydonlarini bron qilish"
        description="Maydon qidiring, vaqt tanlang va onlayn bron qiling."
        path="/"
      />
      <AppHeader search={searchProps} />

      <section className="app-page app-page--home">
        <div className="container">
          {!loading && !error && (
            <div className="app-page__meta">{courts.length} ta maydon</div>
          )}

          {loading && <p className="app-muted">Yuklanmoqda…</p>}
          {error && <p className="auth-error">{error}</p>}
          {!loading && !error && courts.length === 0 && (
            <p className="app-muted">Hech narsa topilmadi.</p>
          )}

          <div className="court-grid">
            {courts.map((court) => (
              <CourtCard key={court.id} court={court} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
