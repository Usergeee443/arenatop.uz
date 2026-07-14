import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  createPaymentCard,
  deletePaymentCard,
  listPaymentCards,
  updatePaymentCard,
} from '../api/paymentCards';
import ProfileGate from '../components/profile/ProfileGate';
import { useAuth } from '../context/AuthContext';
import { maskCard } from '../utils/format';

export default function PaymentCardsPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    card_number: '',
    card_holder_name: '',
    label: '',
    is_default: false,
  });

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listPaymentCards();
      setCards(Array.isArray(data) ? data : data?.items || []);
    } catch (err) {
      setError(err.message || 'Kartalarni yuklab bo‘lmadi');
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

  const onAdd = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await createPaymentCard({
        card_number: form.card_number.replace(/\s/g, ''),
        card_holder_name: form.card_holder_name.trim(),
        label: form.label.trim() || null,
        is_default: form.is_default,
      });
      setForm({ card_number: '', card_holder_name: '', label: '', is_default: false });
      await load();
    } catch (err) {
      setError(err.message || 'Karta qo‘shilmadi');
    } finally {
      setBusy(false);
    }
  };

  const onDefault = async (id) => {
    try {
      await updatePaymentCard(id, { is_default: true });
      await load();
    } catch (err) {
      alert(err.message || 'Yangilab bo‘lmadi');
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm('Kartani o‘chirasizmi?')) return;
    try {
      await deletePaymentCard(id);
      await load();
    } catch (err) {
      alert(err.message || 'O‘chirib bo‘lmadi');
    }
  };

  return (
    <ProfileGate
      title="To‘lov kartalari"
      description="Qaytarish uchun saqlangan kartalar."
      path="/profil/kartalar"
    >
      <p className="profile-back">
        <Link to="/profil" className="text-link">← Profil</Link>
      </p>

      {loading && <p className="app-muted">Yuklanmoqda…</p>}
      {error && <p className="auth-error">{error}</p>}

      {!loading && cards.length === 0 && (
        <p className="app-muted">Hali karta yo‘q. Qaytarish uchun kartani qo‘shing.</p>
      )}

      <div className="profile-list">
        {cards.map((card) => (
          <article key={card.id} className="profile-list__item">
            <div>
              <strong>{card.label || 'Karta'}</strong>
              <p>{maskCard(card.card_number)}</p>
              <p className="app-muted">{card.card_holder_name}</p>
              {card.is_default && <span className="profile-badge">Asosiy</span>}
            </div>
            <div className="profile-list__actions">
              {!card.is_default && (
                <button type="button" className="btn btn--ghost btn--sm" onClick={() => onDefault(card.id)}>
                  Asosiy qilish
                </button>
              )}
              <button type="button" className="btn btn--ghost btn--sm" onClick={() => onDelete(card.id)}>
                O‘chirish
              </button>
            </div>
          </article>
        ))}
      </div>

      <form className="auth-form profile-form" onSubmit={onAdd}>
        <h2 className="profile-form__title">Yangi karta</h2>
        <label className="auth-label">
          Karta raqami
          <input
            type="text"
            inputMode="numeric"
            autoComplete="cc-number"
            value={form.card_number}
            onChange={(e) => setForm((f) => ({ ...f, card_number: e.target.value }))}
            placeholder="8600••••••••1234"
            required
            minLength={16}
            maxLength={19}
          />
        </label>
        <label className="auth-label">
          Egasi
          <input
            type="text"
            value={form.card_holder_name}
            onChange={(e) => setForm((f) => ({ ...f, card_holder_name: e.target.value }))}
            required
            minLength={2}
          />
        </label>
        <label className="auth-label">
          Nom (ixtiyoriy)
          <input
            type="text"
            value={form.label}
            onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
            maxLength={64}
          />
        </label>
        <label className="profile-check">
          <input
            type="checkbox"
            checked={form.is_default}
            onChange={(e) => setForm((f) => ({ ...f, is_default: e.target.checked }))}
          />
          Asosiy karta
        </label>
        <button type="submit" className="btn btn--primary" disabled={busy}>
          {busy ? 'Qo‘shilmoqda…' : 'Karta qo‘shish'}
        </button>
      </form>
    </ProfileGate>
  );
}
