import { Link, NavLink, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDownload } from '../../context/DownloadContext';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { IconAbout, IconDownload, IconHelp, IconStadium } from '../ui/MiniIcons';

const LOGO = '/assets/image_2026-01-14_11-08-19.png';

function SearchIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}

function FilterIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M4 5h16M7 12h10M10 19h4" strokeLinecap="round" />
    </svg>
  );
}

export default function AppHeader({ search }) {
  const { user, isAuthenticated, openAuth } = useAuth();
  const { openDownload } = useDownload();
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width: 959px)');
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const lastY = useRef(0);
  const searchPanelRef = useRef(null);
  const searchInputRef = useRef(null);

  const hasSearch = Boolean(search);
  const filtersActive = hasSearch && (Boolean(search.categoryId) || search.sortBy !== 'rating');
  const searchBusy = hasSearch && Boolean(search.qInput?.trim() || filtersActive);

  useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
    setFilterOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (!searchOpen) return undefined;
    const t = setTimeout(() => searchInputRef.current?.focus(), 80);
    return () => clearTimeout(t);
  }, [searchOpen]);

  useEffect(() => {
    // Mobilda header scroll bilan yashirilmasin
    if (isMobile) {
      setHidden(false);
      document.documentElement.classList.remove('nav-hidden');
      return undefined;
    }

    lastY.current = window.scrollY;

    const onScroll = () => {
      if (open) {
        setHidden(false);
        return;
      }

      const y = window.scrollY;
      const delta = y - lastY.current;

      if (y < 48) {
        setHidden(false);
      } else if (delta > 8) {
        setHidden(true);
      } else if (delta < -8) {
        setHidden(false);
      }

      lastY.current = y;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [open, isMobile]);

  useEffect(() => {
    if (isMobile) {
      document.documentElement.classList.remove('nav-hidden');
      return undefined;
    }
    document.documentElement.classList.toggle('nav-hidden', hidden && !open);
    return () => document.documentElement.classList.remove('nav-hidden');
  }, [hidden, open, isMobile]);

  const closeSearch = () => {
    setSearchOpen(false);
    setFilterOpen(false);
  };

  return (
    <>
      <header className={`app-nav${!isMobile && hidden && !open ? ' is-hidden' : ''}${searchOpen ? ' is-search-open' : ''}`} role="banner">
        <div className="app-nav__top">
          <div className="container">
            <div className="app-nav__mini">
              <Link to="/stadioni-borlar" className="app-nav__mini-btn">
                <IconStadium />
                <span>Stadioni borlar uchun</span>
              </Link>
              <Link to="/yordam" className="app-nav__mini-btn">
                <IconHelp />
                <span>Yordam</span>
              </Link>
              <Link to="/biz-haqimizda" className="app-nav__mini-btn">
                <IconAbout />
                <span>Biz haqimizda</span>
              </Link>
              <button type="button" className="app-nav__mini-btn" onClick={openDownload}>
                <IconDownload />
                <span>Yuklab olish</span>
              </button>
            </div>
          </div>
        </div>

        <div className="app-nav__main">
          <div className="container app-nav__main-inner">
            <Link to="/" className="app-nav__logo" aria-label="ArenaTop">
              <img src={LOGO} alt="ArenaTop" />
            </Link>

            <nav className="app-nav__tabs" aria-label="Asosiy">
              <NavLink to="/" end className={({ isActive }) => `app-nav__tab${isActive ? ' is-active' : ''}`}>
                Maydonlar
              </NavLink>
              <NavLink to="/bronlarim" className={({ isActive }) => `app-nav__tab${isActive ? ' is-active' : ''}`}>
                Bronlarim
              </NavLink>
              <NavLink to="/sevimlilar" className={({ isActive }) => `app-nav__tab${isActive ? ' is-active' : ''}`}>
                Sevimli
              </NavLink>
              <NavLink to="/profil" className={({ isActive }) => `app-nav__tab${isActive ? ' is-active' : ''}`}>
                Profil
              </NavLink>
            </nav>

            <div className="app-nav__actions">
              {hasSearch && (
                <button
                  type="button"
                  className={`app-nav__search-btn${searchOpen || searchBusy ? ' is-active' : ''}`}
                  aria-label={searchOpen ? 'Qidiruvni yopish' : 'Qidiruv'}
                  aria-expanded={searchOpen}
                  onClick={() => {
                    if (searchOpen) closeSearch();
                    else setSearchOpen(true);
                  }}
                >
                  {searchOpen ? <span className="app-nav__search-x">×</span> : <SearchIcon />}
                  {searchBusy && !searchOpen && <span className="app-nav__search-dot" />}
                </button>
              )}

              {!isMobile && (
                isAuthenticated ? (
                  <Link to="/profil" className="app-nav__user">
                    {user?.name || 'Profil'}
                  </Link>
                ) : (
                  <button type="button" className="btn btn--primary btn--sm" onClick={() => openAuth()}>
                    Kirish
                  </button>
                )
              )}

              <button
                type="button"
                className={`app-nav__burger${open ? ' is-open' : ''}`}
                aria-label={open ? 'Yopish' : 'Menyu'}
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
              >
                <span />
              </button>
            </div>
          </div>
        </div>

        {hasSearch && (
          <div
            ref={searchPanelRef}
            className={`app-nav__search-panel${searchOpen ? ' is-open' : ''}`}
            aria-hidden={!searchOpen}
          >
            <div className="container">
              <div className="search-bar">
                <input
                  ref={searchInputRef}
                  className="search-bar__input"
                  type="search"
                  placeholder="Qidiruv…"
                  value={search.qInput}
                  onChange={(e) => search.setQInput(e.target.value)}
                  aria-label="Maydon qidirish"
                />
                <button
                  type="button"
                  className={`search-bar__filter${filtersActive ? ' is-active' : ''}${filterOpen ? ' is-open' : ''}`}
                  aria-label="Filterlar"
                  aria-expanded={filterOpen}
                  onClick={() => setFilterOpen((v) => !v)}
                >
                  <FilterIcon />
                  {filtersActive && <span className="search-bar__dot" />}
                </button>
              </div>

              {filterOpen && (
                <div className="filter-sheet">
                  <label className="auth-label">
                    Tur
                    <select
                      value={search.categoryId}
                      onChange={(e) => search.setCategoryId(e.target.value)}
                      aria-label="Tur"
                    >
                      <option value="">Barcha turlar</option>
                      {search.categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="auth-label">
                    Saralash
                    <select
                      value={search.sortBy}
                      onChange={(e) => search.setSortBy(e.target.value)}
                      aria-label="Saralash"
                    >
                      <option value="rating">Reyting</option>
                      <option value="price_asc">Narx ↑</option>
                      <option value="price_desc">Narx ↓</option>
                      <option value="name">Nom</option>
                    </select>
                  </label>
                  <div className="filter-sheet__actions">
                    <button
                      type="button"
                      className="btn btn--ghost btn--sm"
                      onClick={() => {
                        search.setCategoryId('');
                        search.setSortBy('rating');
                      }}
                    >
                      Tozalash
                    </button>
                    <button type="button" className="btn btn--primary btn--sm" onClick={() => setFilterOpen(false)}>
                      Qo‘llash
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      <div className={`app-nav__drawer${open ? ' is-open' : ''}`} aria-hidden={!open}>
        <button
          type="button"
          className="app-nav__drawer-close"
          aria-label="Yopish"
          onClick={() => setOpen(false)}
        >
          ×
        </button>

        <nav className="app-nav__drawer-main" aria-label="Asosiy menyu">
          <NavLink to="/" end className={({ isActive }) => `app-nav__drawer-btn${isActive ? ' is-active' : ''}`} onClick={() => setOpen(false)}>
            Maydonlar
          </NavLink>
          <NavLink to="/bronlarim" className={({ isActive }) => `app-nav__drawer-btn${isActive ? ' is-active' : ''}`} onClick={() => setOpen(false)}>
            Bronlarim
          </NavLink>
          <NavLink to="/sevimlilar" className={({ isActive }) => `app-nav__drawer-btn${isActive ? ' is-active' : ''}`} onClick={() => setOpen(false)}>
            Sevimli
          </NavLink>
          <NavLink to="/profil" className={({ isActive }) => `app-nav__drawer-btn${isActive ? ' is-active' : ''}`} onClick={() => setOpen(false)}>
            Profil
          </NavLink>
        </nav>

        <div className="app-nav__drawer-extra">
          <Link to="/stadioni-borlar" className="app-nav__drawer-chip" onClick={() => setOpen(false)}>
            <IconStadium size={16} />
            <span>Stadioni borlar</span>
          </Link>
          <Link to="/yordam" className="app-nav__drawer-chip" onClick={() => setOpen(false)}>
            <IconHelp size={16} />
            <span>Yordam</span>
          </Link>
          <Link to="/biz-haqimizda" className="app-nav__drawer-chip" onClick={() => setOpen(false)}>
            <IconAbout size={16} />
            <span>Biz haqimizda</span>
          </Link>
          <button type="button" className="app-nav__drawer-chip" onClick={() => { setOpen(false); openDownload(); }}>
            <IconDownload size={16} />
            <span>Yuklab olish</span>
          </button>
        </div>

        {!isAuthenticated ? (
          <button type="button" className="btn btn--primary btn--lg app-nav__drawer-auth" onClick={() => { setOpen(false); openAuth(); }}>
            Kirish
          </button>
        ) : (
          <Link to="/profil" className="btn btn--ghost btn--lg app-nav__drawer-auth" onClick={() => setOpen(false)}>
            {user?.name || 'Profil'}
          </Link>
        )}
      </div>
    </>
  );
}
