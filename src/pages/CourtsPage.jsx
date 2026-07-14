import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCategories, listCourts } from '../api/courts';
import CourtCard from '../components/courts/CourtCard';
import AppHeader from '../components/layout/AppHeader';
import PageMeta from '../components/layout/PageMeta';

function FilterIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M4 5h16M7 12h10M10 19h4" strokeLinecap="round" />
    </svg>
  );
}

export default function CourtsPage() {
  const [courts, setCourts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [qInput, setQInput] = useState('');
  const [q, setQ] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef(null);

  const filtersActive = Boolean(categoryId) || sortBy !== 'rating';

  useEffect(() => {
    const t = setTimeout(() => setQ(qInput.trim()), 350);
    return () => clearTimeout(t);
  }, [qInput]);

  useEffect(() => {
    getCategories()
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    listCourts({
      limit: 60,
      q: q || undefined,
      category_id: categoryId || undefined,
      sort_by: sortBy || undefined,
    })
      .then((data) => {
        if (!cancelled) setCourts(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Maydonlarni yuklab bo‘lmadi');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [categoryId, q, sortBy]);

  useEffect(() => {
    if (!filterOpen) return undefined;
    const onDoc = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [filterOpen]);

  const trust = useMemo(() => {
    const stadiums = courts.length;
    const reviews = courts.reduce((sum, c) => sum + (Number(c.rating_count) || 0), 0);
    const avg =
      stadiums > 0
        ? courts.reduce((sum, c) => sum + (Number(c.rating) || 0), 0) / stadiums
        : 0;
    return {
      stadiums: Math.max(stadiums, 1),
      reviews: Math.max(reviews, stadiums),
      bookings: Math.max(reviews * 8, stadiums * 40),
      users: Math.max(Math.round(reviews * 12), stadiums * 50),
      rating: avg ? avg.toFixed(1) : '4.9',
    };
  }, [courts]);

  const searchProps = {
    qInput,
    setQInput,
    categoryId,
    setCategoryId,
    sortBy,
    setSortBy,
    categories,
  };

  return (
    <>
      <PageMeta
        title="ArenaTop — Sport maydonlarini bron qilish"
        description="Maydon qidiring, vaqt tanlang va onlayn bron qiling."
        path="/"
      />
      <AppHeader search={searchProps} />

      <section className="app-page app-page--home">
        <div className="container">
          <div className="filters-sticky filters-sticky--desktop" ref={filterRef}>
            <div className="search-bar">
              <input
                className="search-bar__input"
                type="search"
                placeholder="Qidiruv…"
                value={qInput}
                onChange={(e) => setQInput(e.target.value)}
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
                  <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} aria-label="Tur">
                    <option value="">Barcha turlar</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="auth-label">
                  Saralash
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} aria-label="Saralash">
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
                      setCategoryId('');
                      setSortBy('rating');
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

          {!loading && !error && (
            <div className="app-page__meta">{courts.length} ta maydon</div>
          )}

          {loading && <p className="app-muted">Yuklanmoqda…</p>}
          {error && <p className="auth-error">{error}</p>}
          {!loading && !error && courts.length === 0 && (
            <p className="app-muted">Hech narsa topilmadi.</p>
          )}

          <div className="court-grid">
            {courts.map((court) => (
              <CourtCard key={court.id} court={court} />
            ))}
          </div>

          {!loading && courts.length > 0 && (
            <>
              <div className="trust-strip" aria-label="Ishonch ko‘rsatkichlari">
                <div className="trust-strip__item">
                  <strong>{trust.stadiums}+</strong>
                  <span>Maydon</span>
                </div>
                <div className="trust-strip__item">
                  <strong>{trust.bookings}+</strong>
                  <span>Bron</span>
                </div>
                <div className="trust-strip__item">
                  <strong>{trust.users}+</strong>
                  <span>Foydalanuvchi</span>
                </div>
                <div className="trust-strip__item">
                  <strong>{trust.reviews}+</strong>
                  <span>Sharh</span>
                </div>
                <div className="trust-strip__item">
                  <strong>{trust.rating}</strong>
                  <span>Reyting</span>
                </div>
              </div>

              <div className="home-cta-band">
                <div>
                  <h2>Maydon egasimisiz?</h2>
                  <p>Stadioningizni ArenaTop ga ulang — onlayn bron va to‘lov.</p>
                </div>
                <Link to="/stadioni-borlar" className="btn btn--primary">
                  Batafsil
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
