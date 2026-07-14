import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { cancelBooking, listMyBookings } from '../api/bookings';
import AppHeader from '../components/layout/AppHeader';
import PageMeta from '../components/layout/PageMeta';
import { useAuth } from '../context/AuthContext';
import { formatPrice, formatTime } from '../utils/format';

export default function BookingsPage() {
  const { isAuthenticated, loading: authLoading, openAuth } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listMyBookings({ limit: 50 });
      setBookings(Array.isArray(data) ? data : data?.items || []);
    } catch (err) {
      setError(err.message || 'Bronlarni yuklab bo‘lmadi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    load();
  }, [isAuthenticated, authLoading]);

  const onCancel = async (id) => {
    if (!window.confirm('Bronni bekor qilasizmi?')) return;
    try {
      await cancelBooking(id);
      await load();
    } catch (err) {
      alert(err.message || 'Bekor qilib bo‘lmadi');
    }
  };

  return (
    <>
      <PageMeta title="Mening bronlarim — ArenaTop" description="ArenaTop bronlaringiz." path="/bronlarim" />
      <AppHeader />

      <section className="app-page">
        <div className="container" style={{ maxWidth: 880 }}>
          <span className="eyebrow">Kabinet</span>
          <h1 className="display-title">Mening bronlarim</h1>

          {!authLoading && !isAuthenticated && (
            <div className="book-success" style={{ marginTop: '1.5rem' }}>
              <p>Bronlaringizni ko‘rish uchun tizimga kiring.</p>
              <button type="button" className="btn btn--primary" onClick={() => openAuth()}>
                Kirish
              </button>
            </div>
          )}

          {loading && <p className="app-muted">Yuklanmoqda…</p>}
          {error && <p className="auth-error">{error}</p>}

          {!loading && isAuthenticated && bookings.length === 0 && (
            <p className="app-muted">
              Hali bron yo‘q. <Link to="/maydonlar" className="text-link">Maydonlarni ko‘rish</Link>
            </p>
          )}

          <div className="booking-list">
            {bookings.map((b) => (
              <article key={b.id} className="booking-card">
                <div>
                  <div className="booking-card__code">{b.booking_code}</div>
                  <div className="booking-card__meta">
                    {b.date} · {formatTime(b.start_time)} · {b.duration_hours} soat
                  </div>
                  <div className="booking-card__meta">Status: {b.status}</div>
                  <div className="booking-card__price">{formatPrice(b.total_price)}</div>
                </div>
                {['pending', 'confirmed', 'awaiting_payment'].includes(String(b.status).toLowerCase()) && (
                  <button type="button" className="btn btn--ghost btn--sm" onClick={() => onCancel(b.id)}>
                    Bekor qilish
                  </button>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
