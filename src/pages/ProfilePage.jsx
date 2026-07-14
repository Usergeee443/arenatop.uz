import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { patchMe } from '../api/users';
import AppHeader from '../components/layout/AppHeader';
import PageMeta from '../components/layout/PageMeta';
import { useAuth } from '../context/AuthContext';

const MENU = [
  { to: '/bronlarim', label: 'Mening bronlarim', hint: 'Faol va o‘tgan bronlar' },
  { to: '/sevimlilar', label: 'Sevimlilar', hint: 'Saqlangan maydonlar' },
  { to: '/profil/kartalar', label: 'To‘lov kartalari', hint: 'Qaytarish uchun kartalar' },
  { to: '/profil/qaytarishlar', label: 'Qaytarish so‘rovlarim', hint: 'Pul qaytarish holati' },
  { to: '/profil/tolovlar', label: 'To‘lovlar tarixi', hint: 'Barcha to‘lovlar' },
  { to: '/profil/sharhlar', label: 'Mening sharhlarim', hint: 'Yozgan baholarim' },
  { to: '/profil/bildirishnomalar', label: 'Bildirishnomalar', hint: 'Xabarlar va eslatmalar' },
];

export default function ProfilePage() {
  const { user, isAuthenticated, loading, openAuth, refreshUser, logout } = useAuth();
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setName(user?.name || '');
  }, [user]);

  const onSave = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    setMsg('');
    try {
      await patchMe({ name: name.trim() });
      await refreshUser();
      setMsg('Saqlandi');
    } catch (err) {
      setError(err.message || 'Saqlab bo‘lmadi');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageMeta title="Profil — ArenaTop" description="Hisob sozlamalari." path="/profil" />
      <AppHeader />

      <section className="app-page">
        <div className="container" style={{ maxWidth: 640 }}>
          <span className="eyebrow">Kabinet</span>
          <h1 className="display-title">Profil</h1>

          {loading && <p className="app-muted">Yuklanmoqda…</p>}

          {!loading && !isAuthenticated && (
            <div className="book-success" style={{ marginTop: '1.25rem' }}>
              <p>Profilni ko‘rish uchun tizimga kiring.</p>
              <button type="button" className="btn btn--primary" onClick={() => openAuth()}>
                Kirish
              </button>
            </div>
          )}

          {isAuthenticated && user && (
            <div className="profile-stack">
              <div className="profile-card">
                <div className="profile-card__avatar">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt="" />
                  ) : (
                    <span>{(user.name || 'A').slice(0, 1).toUpperCase()}</span>
                  )}
                </div>
                <p className="profile-card__phone">+{user.phone_number}</p>

                <form className="auth-form" onSubmit={onSave}>
                  <label className="auth-label">
                    Ism
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required minLength={2} />
                  </label>
                  {error && <p className="auth-error">{error}</p>}
                  {msg && <p className="app-muted">{msg}</p>}
                  <button type="submit" className="btn btn--primary" disabled={busy}>
                    {busy ? 'Saqlanmoqda…' : 'Saqlash'}
                  </button>
                </form>
              </div>

              <nav className="profile-menu" aria-label="Profil bo‘limlari">
                {MENU.map((item) => (
                  <Link key={item.to} to={item.to} className="profile-menu__item">
                    <span>
                      <strong>{item.label}</strong>
                      <small>{item.hint}</small>
                    </span>
                    <span className="profile-menu__chev" aria-hidden="true">›</span>
                  </Link>
                ))}
              </nav>

              <button type="button" className="btn btn--ghost profile-logout" onClick={logout}>
                Chiqish
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
