import AppHeader from '../layout/AppHeader';
import PageMeta from '../layout/PageMeta';
import { useAuth } from '../../context/AuthContext';

export default function ProfileGate({ title, description, path, children, maxWidth = 720 }) {
  const { isAuthenticated, loading, openAuth } = useAuth();

  return (
    <>
      <PageMeta title={`${title} — ArenaTop`} description={description} path={path} />
      <AppHeader />

      <section className="app-page">
        <div className="container" style={{ maxWidth }}>
          <span className="eyebrow">Kabinet</span>
          <h1 className="display-title">{title}</h1>

          {loading && <p className="app-muted">Yuklanmoqda…</p>}

          {!loading && !isAuthenticated && (
            <div className="book-success" style={{ marginTop: '1.25rem' }}>
              <p>Bu bo‘limni ko‘rish uchun tizimga kiring.</p>
              <button type="button" className="btn btn--primary" onClick={() => openAuth()}>
                Kirish
              </button>
            </div>
          )}

          {!loading && isAuthenticated && children}
        </div>
      </section>
    </>
  );
}
