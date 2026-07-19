import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

export default function Header({ variant = 'consumer' }) {
  const { user, isAuthenticated, openAuth } = useAuth();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  const isConsumer = variant === 'consumer';
  const homePath = '/ilova';
  const arenaPath = '/stadioni-borlar';

  const scrollTo = (id) => {
    setDrawerOpen(false);
    if (location.pathname !== homePath) return;
    const el = document.getElementById(id);
    if (el) {
      const offset = el.getBoundingClientRect().top + window.scrollY - 88;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  };

  const hashLink = (id, label) => {
    const base = isConsumer ? homePath : arenaPath;
    if (location.pathname === base) {
      return (
        <button type="button" className="nav__drawer-link" onClick={() => scrollTo(id)}>
          {label}
        </button>
      );
    }
    return (
      <Link to={`${base}#${id}`} className="nav__drawer-link" onClick={() => setDrawerOpen(false)}>
        {label}
      </Link>
    );
  };

  return (
    <>
      <header className={`nav${scrolled ? ' is-scrolled' : ''}`} role="banner">
        <div className="container nav__inner">
          <Link to="/" className="nav__logo" aria-label="ArenaTop bosh sahifa">
            <img src="/assets/image_2026-01-14_11-08-19.png" alt="ArenaTop" className="nav__logo-desktop" />
            <img src="/assets/image_2026-01-14_11-08-19.png" alt="ArenaTop" className="nav__logo-mobile" />
          </Link>

          <nav className="nav__tabs" aria-label="Sahifalar">
            <NavLink to="/" end className={({ isActive }) => `nav__tab${isActive ? ' is-active' : ''}`}>
              Maydonlar
            </NavLink>
            <NavLink to="/stadioni-borlar" className={({ isActive }) => `nav__tab${isActive ? ' is-active' : ''}`}>
              Stadioni borlar uchun
            </NavLink>
          </nav>

          <div className="nav__actions">
            {isConsumer && (
              <>
                {isAuthenticated ? (
                  <Link to="/profil" className="nav__text-link">
                    {user?.name ? user.name.split(' ')[0] : 'Profil'}
                  </Link>
                ) : (
                  <button type="button" className="nav__text-link" onClick={() => openAuth()}>
                    Kirish
                  </button>
                )}
                <Link to="/yuklab-olish" className="nav__cta" aria-label="Yuklab olish">
                  <span className="nav__cta-text">Yuklab olish</span>
                  <span className="nav__cta-icon"><DownloadIcon /></span>
                </Link>
              </>
            )}
            {!isConsumer && (
              <a href="#contact" className="nav__cta" aria-label="Bog‘lanish">
                <span className="nav__cta-text">Bog‘lanish</span>
                <span className="nav__cta-icon"><MailIcon /></span>
              </a>
            )}
            <button
              type="button"
              className={`nav__menu${drawerOpen ? ' is-open' : ''}`}
              aria-label="Menyu"
              aria-expanded={drawerOpen}
              onClick={() => setDrawerOpen((v) => !v)}
            >
              <span />
            </button>
          </div>
        </div>
      </header>

      <div className={`nav__drawer${drawerOpen ? ' is-open' : ''}`} aria-hidden={!drawerOpen}>
        <Link to="/" onClick={() => setDrawerOpen(false)}>Maydonlar</Link>
        <Link to="/stadioni-borlar" onClick={() => setDrawerOpen(false)}>Stadioni borlar uchun</Link>
        <Link to="/ilova" onClick={() => setDrawerOpen(false)}>Ilova</Link>
        {isConsumer ? (
          <>
            <Link to="/bronlarim" className="nav__drawer-link" onClick={() => setDrawerOpen(false)}>
              Mening bronlarim
            </Link>
            {hashLink('features', 'Imkoniyatlar')}
            {isAuthenticated ? (
              <Link to="/profil" className="btn btn--ghost btn--lg" onClick={() => setDrawerOpen(false)}>
                Profil
              </Link>
            ) : (
              <button type="button" className="btn btn--primary btn--lg" onClick={() => { setDrawerOpen(false); openAuth(); }}>
                Kirish
              </button>
            )}
            <Link to="/yuklab-olish" className="btn btn--ghost btn--lg" onClick={() => setDrawerOpen(false)}>
              Yuklab olish
            </Link>
          </>
        ) : (
          <>
            {hashLink('features', 'Imkoniyatlar')}
            <a href="#contact" className="btn btn--primary btn--lg" onClick={() => setDrawerOpen(false)}>
              Bog‘lanish
            </a>
          </>
        )}
      </div>
    </>
  );
}
