import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listMyReviews } from '../api/users';
import ProfileGate from '../components/profile/ProfileGate';
import { useAuth } from '../context/AuthContext';
import { formatDateTime } from '../utils/format';

export default function MyReviewsPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const data = await listMyReviews();
        if (!cancelled) setItems(Array.isArray(data) ? data : data?.items || []);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Sharhlarni yuklab bo‘lmadi');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, authLoading]);

  return (
    <ProfileGate
      title="Mening sharhlarim"
      description="Siz yozgan baholar."
      path="/profil/sharhlar"
    >
      <p className="profile-back">
        <Link to="/profil" className="text-link">← Profil</Link>
      </p>

      {loading && <p className="app-muted">Yuklanmoqda…</p>}
      {error && <p className="auth-error">{error}</p>}

      {!loading && items.length === 0 && (
        <p className="app-muted">Hali sharh yo‘q.</p>
      )}

      <div className="profile-list">
        {items.map((r) => (
          <article key={r.id} className="profile-list__item profile-list__item--stack">
            <div className="profile-list__row">
              <strong>{r.court_name || 'Maydon'}</strong>
              <span>★ {r.rating}</span>
            </div>
            {r.comment && <p>{r.comment}</p>}
            <p className="app-muted">{formatDateTime(r.created_at)}</p>
            {r.admin_reply && (
              <div className="profile-reply">
                <strong>Javob</strong>
                <p>{r.admin_reply}</p>
              </div>
            )}
            {r.court_id && (
              <Link to={`/maydon/${r.court_id}`} className="text-link">
                Maydonni ochish
              </Link>
            )}
          </article>
        ))}
      </div>
    </ProfileGate>
  );
}
