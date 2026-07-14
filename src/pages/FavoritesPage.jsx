import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSavedCourts } from '../api/users';
import CourtCard from '../components/courts/CourtCard';
import AppHeader from '../components/layout/AppHeader';
import PageMeta from '../components/layout/PageMeta';
import { useAuth } from '../context/AuthContext';

export default function FavoritesPage() {
  const { isAuthenticated, loading: authLoading, openAuth } = useAuth();
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getSavedCourts({ limit: 50 });
      setCourts(Array.isArray(data) ? data : data?.items || []);
    } catch (err) {
      setError(err.message || 'Sevimlilarni yuklab bo‘lmadi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      setLoading(false);
      setCourts([]);
      return;
    }
    load();
  }, [isAuthenticated, authLoading]);

  return (
    <>
      <PageMeta title="Sevimli — ArenaTop" description="Saqlangan maydonlaringiz." path="/sevimlilar" />
      <AppHeader />

      <section className="app-page">
        <div className="container">
          <div className="app-page__head">
            <div>
              <span className="eyebrow">Kabinet</span>
              <h1 className="display-title">Sevimli</h1>
            </div>
          </div>

          {!authLoading && !isAuthenticated && (
            <div className="book-success">
              <p>Sevimlilarni ko‘rish uchun tizimga kiring.</p>
              <button type="button" className="btn btn--primary" onClick={() => openAuth()}>
                Kirish
              </button>
            </div>
          )}

          {loading && <p className="app-muted">Yuklanmoqda…</p>}
          {error && <p className="auth-error">{error}</p>}

          {!loading && isAuthenticated && courts.length === 0 && (
            <p className="app-muted">
              Hali sevimli maydon yo‘q.{' '}
              <Link to="/" className="text-link">
                Maydonlarni ko‘rish
              </Link>
            </p>
          )}

          <div className="court-grid">
            {courts.map((court) => (
              <CourtCard
                key={court.id}
                court={court}
                saved
                onSavedChange={(id, saved) => {
                  if (!saved) setCourts((prev) => prev.filter((c) => c.id !== id));
                }}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
