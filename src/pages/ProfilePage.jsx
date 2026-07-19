import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { patchMe } from '../api/users';
import AppHeader from '../components/layout/AppHeader';
import PageMeta from '../components/layout/PageMeta';
import AuthRequired from '../components/ui/AuthRequired';
import { useAuth } from '../context/AuthContext';

const MENU = [
  { to: '/bronlarim', label: 'Bronlarim' },
  { to: '/sevimlilar', label: 'Sevimlilar' },
  { to: '/profil/kartalar', label: 'To‘lov kartalari' },
  { to: '/profil/qaytarishlar', label: 'Qaytarish so‘rovlarim' },
  { to: '/profil/tolovlar', label: 'To‘lovlar tarixi' },
  { to: '/profil/sharhlar', label: 'Mening sharhlarim' },
  { to: '/profil/bildirishnomalar', label: 'Bildirishnomalar' },
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

      <section className="app-page profile-page">
        <div className="container profile-page__wrap">
          {loading && <p className="app-muted">Yuklanmoqda…</p>}

          {!loading && !isAuthenticated && (
            <AuthRequired
              message="Profilni ko‘rish uchun tizimga kiring."
              onLogin={() => openAuth()}
            />
          )}

          {isAuthenticated && user && (
            <div className="profile-layout">
              <div className="profile-card profile-card--compact">
                <div className="profile-card__top">
                  <div className="profile-card__avatar">
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt="" />
                    ) : (
                      <span>{(user.name || 'A').slice(0, 1).toUpperCase()}</span>
                    )}
                  </div>
                  <div>
                    <p className="profile-card__name">{user.name || 'Foydalanuvchi'}</p>
                    <p className="profile-card__phone">+{user.phone_number}</p>
                  </div>
                </div>

                <form className="auth-form" onSubmit={onSave}>
                  <label className="auth-label">
                    Ism
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required minLength={2} />
                  </label>
                  {error && <p className="auth-error">{error}</p>}
                  {msg && <p className="app-muted">{msg}</p>}
                  <button type="submit" className="btn btn--primary btn--sm" disabled={busy}>
                    {busy ? 'Saqlanmoqda…' : 'Saqlash'}
                  </button>
                </form>
              </div>

              <nav className="profile-menu" aria-label="Profil bo‘limlari">
                {MENU.map((item) => (
                  <Link key={item.to} to={item.to} className="profile-menu__item profile-menu__item--slim">
                    <strong>{item.label}</strong>
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
