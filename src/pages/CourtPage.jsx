import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { createReview, getCourt, getCourtReviews, getCourtSlots } from '../api/courts';
import { checkSavedStatus, saveCourt, unsaveCourt } from '../api/users';
import BookingFlow from '../components/booking/BookingFlow';
import AppHeader from '../components/layout/AppHeader';
import PageMeta from '../components/layout/PageMeta';
import { useAuth } from '../context/AuthContext';
import { useMediaQuery } from '../hooks/useMediaQuery';
import {
  addDaysISO,
  courtImage,
  formatPrice,
  todayISO,
} from '../utils/format';

function dateParts(iso) {
  const d = new Date(`${iso}T12:00:00`);
  const isToday = iso === todayISO();
  return {
    day: d.getDate(),
    week: isToday ? 'Bugun' : d.toLocaleDateString('uz-UZ', { weekday: 'short' }),
    month: d.toLocaleDateString('uz-UZ', { month: 'short' }),
  };
}

export default function CourtPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, openAuth } = useAuth();
  const isMobile = useMediaQuery('(max-width: 959px)');

  const [court, setCourt] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [date, setDate] = useState(todayISO());
  const [slots, setSlots] = useState([]);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [error, setError] = useState('');
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewBusy, setReviewBusy] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);

  const touchX = useRef(null);

  const dates = useMemo(() => Array.from({ length: 7 }, (_, i) => addDaysISO(todayISO(), i)), []);

  const gallery = useMemo(() => {
    if (!court) return [];
    const imgs = (court.images || []).map((i) => i.image_url).filter(Boolean);
    const cover = courtImage(court);
    return [...new Set([cover, ...imgs].filter(Boolean))];
  }, [court]);

  const freeCount = useMemo(
    () => slots.filter((s) => !s.is_booked && !s.is_blocked).length,
    [slots]
  );

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setActiveImage(0);
    Promise.all([getCourt(id), getCourtReviews(id).catch(() => ({ items: [] }))])
      .then(([c, r]) => {
        if (cancelled) return;
        setCourt(c);
        setReviews(Array.isArray(r) ? r : r?.items || []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Maydon topilmadi');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (!isAuthenticated || !id) return;
    checkSavedStatus(id)
      .then((res) => setSaved(Boolean(res?.is_saved ?? res?.saved ?? res === true)))
      .catch(() => {});
  }, [id, isAuthenticated]);

  useEffect(() => {
    if (!id || !date) return;
    let cancelled = false;
    setSlotsLoading(true);
    getCourtSlots(id, date)
      .then((data) => {
        if (!cancelled) setSlots(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!cancelled) setSlots([]);
      })
      .finally(() => {
        if (!cancelled) setSlotsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id, date]);

  const onHeroTouchStart = (e) => {
    touchX.current = e.changedTouches[0]?.clientX ?? null;
  };

  const onHeroTouchEnd = (e) => {
    if (touchX.current == null || gallery.length < 2) return;
    const dx = (e.changedTouches[0]?.clientX ?? touchX.current) - touchX.current;
    if (Math.abs(dx) < 40) return;
    setActiveImage((i) => {
      if (dx < 0) return Math.min(gallery.length - 1, i + 1);
      return Math.max(0, i - 1);
    });
    touchX.current = null;
  };

  const toggleSave = async () => {
    if (!isAuthenticated) {
      openAuth();
      return;
    }
    try {
      if (saved) {
        await unsaveCourt(id);
        setSaved(false);
      } else {
        await saveCourt(id);
        setSaved(true);
      }
    } catch (err) {
      alert(err.message || 'Saqlab bo‘lmadi');
    }
  };

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: court?.name || 'ArenaTop', url });
      } else {
        await navigator.clipboard.writeText(url);
        alert('Havola nusxalandi');
      }
    } catch {
      /* cancelled */
    }
  };

  const refreshSlots = async () => {
    try {
      const fresh = await getCourtSlots(id, date);
      setSlots(Array.isArray(fresh) ? fresh : []);
    } catch {
      /* ignore */
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      openAuth();
      return;
    }
    setReviewBusy(true);
    try {
      await createReview(id, { rating: reviewRating, comment: reviewComment.trim() || null });
      const r = await getCourtReviews(id);
      setReviews(Array.isArray(r) ? r : r?.items || []);
      setReviewOpen(false);
      setReviewComment('');
      setReviewRating(5);
    } catch (err) {
      alert(err.message || 'Sharh yuborilmadi');
    } finally {
      setReviewBusy(false);
    }
  };

  if (loading) {
    return (
      <>
        {!isMobile && <AppHeader />}
        <section className="court-m court-m--loading">
          <div className="court-m__skel-hero" />
          <div className="container">
            <div className="court-m__skel-line" />
            <div className="court-m__skel-line court-m__skel-line--sm" />
          </div>
        </section>
      </>
    );
  }

  if (!court) {
    return (
      <>
        {!isMobile && <AppHeader />}
        <section className="app-page">
          <div className="container">
            <h1 className="display-title">Maydon topilmadi</h1>
            {error && <p className="auth-error">{error}</p>}
            <Link to="/" className="btn btn--primary">
              Maydonlarga qaytish
            </Link>
          </div>
        </section>
      </>
    );
  }

  const mapsUrl =
    court.latitude && court.longitude
      ? `https://www.google.com/maps?q=${court.latitude},${court.longitude}`
      : null;

  const availabilityPreview = (
    <div className="court-m__book" id="bron">
      <h2 className="court-m__h2">Mavjudligi</h2>

      <div className="court-m__dates">
        {dates.map((d) => {
          const p = dateParts(d);
          return (
            <button
              key={d}
              type="button"
              className={`court-m__date${d === date ? ' is-active' : ''}`}
              onClick={() => setDate(d)}
            >
              <em>{p.week}</em>
              <strong>
                {p.day} {p.month}
              </strong>
            </button>
          );
        })}
      </div>

      <button type="button" className="court-m__avail" onClick={() => setBookOpen(true)}>
        <span>
          <i className={`court-m__dot${freeCount > 0 ? ' is-free' : ''}`} />
          {slotsLoading
            ? 'Yuklanmoqda…'
            : freeCount > 0
              ? `${freeCount} ta bo‘sh`
              : 'Bo‘sh joy yo‘q'}
        </span>
        <span className="court-m__avail-link">Slotlarni ko‘rish ›</span>
      </button>

      {!isMobile && (
        <button
          type="button"
          className="btn btn--primary btn--lg book-cta"
          onClick={() => setBookOpen(true)}
        >
          Bron qilish
        </button>
      )}
    </div>
  );

  return (
    <>
      <PageMeta
        title={`${court.name} — ArenaTop`}
        description={`${court.name}. ${court.location_name}. Onlayn bron.`}
        path={`/maydon/${court.id}`}
      />
      {!isMobile && <AppHeader />}

      <section className={`court-m${bookOpen ? ' is-booking' : ''}`}>
        {!bookOpen && (
          <div className="court-m__float">
            <button
              type="button"
              className="court-m__icon-btn"
              aria-label="Orqaga"
              onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/'))}
            >
              ←
            </button>
            <div className="court-m__float-right">
              <button
                type="button"
                className={`court-m__icon-btn${saved ? ' is-saved' : ''}`}
                aria-label="Sevimli"
                onClick={toggleSave}
              >
                {saved ? '♥' : '♡'}
              </button>
              <button type="button" className="court-m__icon-btn" aria-label="Ulashish" onClick={share}>
                ↗
              </button>
            </div>
          </div>
        )}

        <div
          className="court-m__hero"
          onTouchStart={onHeroTouchStart}
          onTouchEnd={onHeroTouchEnd}
        >
          <img src={gallery[activeImage] || courtImage(court)} alt={court.name} />

          {gallery.length > 1 && (
            <>
              <div className="court-m__dots" aria-hidden="true">
                {gallery.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    className={`court-m__dot-btn${i === activeImage ? ' is-active' : ''}`}
                    onClick={() => setActiveImage(i)}
                  />
                ))}
              </div>
              <div className="court-m__counter">
                {activeImage + 1}/{gallery.length}
              </div>
            </>
          )}
        </div>

        <div className="container court-m__body">
          <div className="court-m__title-row">
            <h1>{court.name}</h1>
            <span className="court-m__cat">{court.category?.name || 'Sport'}</span>
          </div>

          <div className="court-m__meta-row">
            <div className="court-m__rating">
              ★ {Number(court.rating || 0).toFixed(1)}
              <span>({court.rating_count || 0} sharh)</span>
            </div>
            <div className="court-m__price">{formatPrice(court.price_per_hour)}/soat</div>
          </div>

          <ul className="court-m__info">
            <li>
              <span className="court-m__info-ico" aria-hidden="true">🕒</span>
              <span>Ish vaqti: {court.work_time || '—'}</span>
            </li>
            <li>
              <span className="court-m__info-ico" aria-hidden="true">📍</span>
              <span>{court.location_name}</span>
            </li>
            {mapsUrl && (
              <li>
                <span className="court-m__info-ico" aria-hidden="true">🗺️</span>
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                  Xaritada ko‘rish
                </a>
              </li>
            )}
          </ul>

          <div className="court-m__layout">
            <div className="court-m__main">
              {isMobile && availabilityPreview}

              {court.amenities?.length > 0 && (
                <section className="court-m__section">
                  <h2 className="court-m__h2">Qulayliklar</h2>
                  <ul className="court-tags court-tags--v2">
                    {court.amenities.map((a) => (
                      <li key={a.id}>{a.name || a.title}</li>
                    ))}
                  </ul>
                </section>
              )}

              <section className="court-m__section">
                <div className="court-m__section-head">
                  <h2 className="court-m__h2">Reytinglar va sharhlar</h2>
                  <button
                    type="button"
                    className="court-m__link"
                    onClick={() => {
                      if (!isAuthenticated) openAuth();
                      else setReviewOpen((v) => !v);
                    }}
                  >
                    Sharh qoldirish
                  </button>
                </div>

                {reviewOpen && (
                  <form className="court-m__review-form" onSubmit={submitReview}>
                    <label className="auth-label">
                      Baholash
                      <select value={reviewRating} onChange={(e) => setReviewRating(Number(e.target.value))}>
                        {[5, 4, 3, 2, 1].map((n) => (
                          <option key={n} value={n}>
                            {n} yulduz
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="auth-label">
                      Izoh
                      <input
                        type="text"
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Fikringiz…"
                        maxLength={1000}
                      />
                    </label>
                    <button type="submit" className="btn btn--primary btn--sm" disabled={reviewBusy}>
                      {reviewBusy ? 'Yuborilmoqda…' : 'Yuborish'}
                    </button>
                  </form>
                )}

                {reviews.length === 0 ? (
                  <p className="app-muted">Hali sharh yo‘q.</p>
                ) : (
                  <div className="court-m__reviews">
                    {reviews.slice(0, 8).map((r) => (
                      <article key={r.id} className="court-m__review">
                        <strong>★ {r.rating}</strong>
                        <p>{r.comment || r.text || r.content || '—'}</p>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            </div>

            {!isMobile && <aside className="court-m__aside">{availabilityPreview}</aside>}
          </div>
        </div>

        {isMobile && !bookOpen && (
          <div className="court-m__sticky">
            <button type="button" className="court-m__sticky-btn" onClick={() => setBookOpen(true)}>
              Bron qilish
            </button>
          </div>
        )}
      </section>

      <BookingFlow
        court={court}
        open={bookOpen}
        initialDate={date}
        onClose={() => setBookOpen(false)}
        onDone={refreshSlots}
      />
    </>
  );
}
