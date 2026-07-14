import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listMyRefunds } from '../api/bookings';
import ProfileGate from '../components/profile/ProfileGate';
import { useAuth } from '../context/AuthContext';
import { formatPrice, formatTime, maskCard } from '../utils/format';

export default function RefundsPage() {
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
        const data = await listMyRefunds();
        if (!cancelled) setItems(Array.isArray(data) ? data : data?.items || []);
      } catch (err) {
        if (!cancelled) setError(err.message || 'So‘rovlarni yuklab bo‘lmadi');
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
      title="Qaytarish so‘rovlarim"
      description="Pul qaytarish so‘rovlari holati."
      path="/profil/qaytarishlar"
    >
      <p className="profile-back">
        <Link to="/profil" className="text-link">← Profil</Link>
      </p>

      {loading && <p className="app-muted">Yuklanmoqda…</p>}
      {error && <p className="auth-error">{error}</p>}

      {!loading && items.length === 0 && (
        <p className="app-muted">Hali qaytarish so‘rovi yo‘q.</p>
      )}

      <div className="profile-list">
        {items.map((b) => (
          <article key={b.id} className="profile-list__item">
            <div>
              <strong>{b.court_name || b.booking_code}</strong>
              <p className="app-muted">
                {b.date} · {formatTime(b.start_time)} · {b.booking_code}
              </p>
              <p>
                Status: <strong>{b.refund_status || b.status}</strong>
              </p>
              {(b.refundable_amount != null || b.total_price != null) && (
                <p>{formatPrice(b.refundable_amount ?? b.total_price)}</p>
              )}
              {b.refund_card_number && (
                <p className="app-muted">Karta: {maskCard(b.refund_card_number)}</p>
              )}
              {b.refund_note && <p className="app-muted">{b.refund_note}</p>}
            </div>
            {b.refund_receipt_url && (
              <a
                href={b.refund_receipt_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--ghost btn--sm"
              >
                Chek
              </a>
            )}
          </article>
        ))}
      </div>
    </ProfileGate>
  );
}
