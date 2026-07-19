import AppHeader from '../layout/AppHeader';
import PageMeta from '../layout/PageMeta';
import AuthRequired from '../ui/AuthRequired';
import { useAuth } from '../../context/AuthContext';

export default function ProfileGate({ title, description, path, children, maxWidth = 720 }) {
  const { isAuthenticated, loading, openAuth } = useAuth();

  return (
    <>
      <PageMeta title={`${title} — ArenaTop`} description={description} path={path} />
      <AppHeader />

      <section className="app-page profile-subpage">
        <div className="container" style={{ maxWidth }}>
          <h1 className="profile-subpage__title">{title}</h1>

          {loading && <p className="app-muted">Yuklanmoqda…</p>}

          {!loading && !isAuthenticated && (
            <AuthRequired
              message="Bu bo‘limni ko‘rish uchun tizimga kiring."
              onLogin={() => openAuth()}
            />
          )}

          {!loading && isAuthenticated && children}
        </div>
      </section>
    </>
  );
}
