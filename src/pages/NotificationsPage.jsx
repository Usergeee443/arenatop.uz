import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '../api/users';
import ProfileGate from '../components/profile/ProfileGate';
import { useAuth } from '../context/AuthContext';
import { formatDateTime } from '../utils/format';

export default function NotificationsPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listNotifications();
      setItems(Array.isArray(data) ? data : data?.items || []);
    } catch (err) {
      setError(err.message || 'Bildirishnomalarni yuklab bo‘lmadi');
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

  const onRead = async (id) => {
    try {
      await markNotificationRead(id);
      setItems((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    } catch (err) {
      alert(err.message || 'Belgilab bo‘lmadi');
    }
  };

  const onReadAll = async () => {
    setBusy(true);
    try {
      await markAllNotificationsRead();
      setItems((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (err) {
      alert(err.message || 'Belgilab bo‘lmadi');
    } finally {
      setBusy(false);
    }
  };

  const unread = items.some((n) => !n.is_read);

  return (
    <ProfileGate
      title="Bildirishnomalar"
      description="Xabarlar va eslatmalar."
      path="/profil/bildirishnomalar"
    >
      <p className="profile-back">
        <Link to="/profil" className="text-link">← Profil</Link>
      </p>

      {unread && (
        <div className="profile-toolbar">
          <button type="button" className="btn btn--ghost btn--sm" onClick={onReadAll} disabled={busy}>
            {busy ? '…' : 'Hammasini o‘qilgan qilish'}
          </button>
        </div>
      )}

      {loading && <p className="app-muted">Yuklanmoqda…</p>}
      {error && <p className="auth-error">{error}</p>}

      {!loading && items.length === 0 && (
        <p className="app-muted">Hali bildirishnoma yo‘q.</p>
      )}

      <div className="profile-list">
        {items.map((n) => (
          <article
            key={n.id}
            className={`profile-list__item profile-list__item--stack${!n.is_read ? ' is-unread' : ''}`}
          >
            <div className="profile-list__row">
              <strong>{n.title}</strong>
              {!n.is_read && <span className="profile-badge">Yangi</span>}
            </div>
            <p>{n.body}</p>
            <p className="app-muted">{formatDateTime(n.created_at)}</p>
            {!n.is_read && (
              <button type="button" className="btn btn--ghost btn--sm" onClick={() => onRead(n.id)}>
                O‘qildi
              </button>
            )}
          </article>
        ))}
      </div>
    </ProfileGate>
  );
}
