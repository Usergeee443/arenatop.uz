import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listMyPayments } from '../api/bookings';
import ProfileGate from '../components/profile/ProfileGate';
import { useAuth } from '../context/AuthContext';
import { formatDateTime, formatPrice } from '../utils/format';

export default function PaymentsHistoryPage() {
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
        const data = await listMyPayments();
        if (!cancelled) setItems(Array.isArray(data) ? data : data?.items || []);
      } catch (err) {
        if (!cancelled) setError(err.message || 'To‘lovlarni yuklab bo‘lmadi');
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
      title="To‘lovlar tarixi"
      description="ArenaTop to‘lovlaringiz."
      path="/profil/tolovlar"
    >
      <p className="profile-back">
        <Link to="/profil" className="text-link">← Profil</Link>
      </p>

      {loading && <p className="app-muted">Yuklanmoqda…</p>}
      {error && <p className="auth-error">{error}</p>}

      {!loading && items.length === 0 && (
        <p className="app-muted">Hali to‘lov yo‘q.</p>
      )}

      <div className="profile-list">
        {items.map((p) => (
          <article key={p.id} className="profile-list__item">
            <div>
              <strong>{p.court_name || p.booking_code}</strong>
              <p className="app-muted">
                {formatDateTime(p.completed_at || p.created_at)} · {String(p.method || '').toUpperCase()}
              </p>
              <p>
                Status: <strong>{p.status}</strong>
              </p>
              <p className="booking-card__price">{formatPrice(p.total_amount)}</p>
            </div>
            {p.payment_url && String(p.status).toLowerCase() !== 'paid' && (
              <a href={p.payment_url} target="_blank" rel="noopener noreferrer" className="btn btn--primary btn--sm">
                To‘lash
              </a>
            )}
          </article>
        ))}
      </div>
    </ProfileGate>
  );
}
