import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { calculatePayment, createBooking, createPayment, getPaymentMethods } from '../api/bookings';
import { createReview, getCourt, getCourtReviews, getCourtSlots } from '../api/courts';
import { checkSavedStatus, saveCourt, unsaveCourt } from '../api/users';
import AppHeader from '../components/layout/AppHeader';
import PageMeta from '../components/layout/PageMeta';
import { useAuth } from '../context/AuthContext';
import { useMediaQuery } from '../hooks/useMediaQuery';
import {
  addDaysISO,
  courtImage,
  formatDateUz,
  formatPrice,
  formatTime,
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
  const [selected, setSelected] = useState([]);
  const [pricing, setPricing] = useState(null);
  const [payMethod, setPayMethod] = useState('payme');
  const [methods, setMethods] = useState({ payme: true, click: true });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsOpen, setSlotsOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewBusy, setReviewBusy] = useState(false);

  const slotsRef = useRef(null);
  const touchX = useRef(null);

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
  const dates = useMemo(() => Array.from({ length: 7 }, (_, i) => addDaysISO(todayISO(), i)), []);

  const gallery = useMemo(() => {
    if (!court) return [];
    const imgs = (court.images || []).map((i) => i.image_url).filter(Boolean);
    const cover = courtImage(court);
    return [...new Set([cover, ...imgs].filter(Boolean))];
  }, [court]);

  const selectedSlots = useMemo(
    () => slots.filter((s) => selected.includes(s.id)).sort((a, b) => String(a.start_time).localeCompare(String(b.start_time))),
    [slots, selected]
  );

  const freeCount = useMemo(
    () => slots.filter((s) => !s.is_booked && !s.is_blocked).length,
    [slots]
  );

  useEffect(() => {
    if (!isMobile) setSlotsOpen(true);
  }, [isMobile]);

  useEffect(() => {
    getPaymentMethods()
      .then((res) => {
        setMethods({
          payme: res?.payme !== false,
          click: res?.click !== false,
        });
      })
      .catch(() => {});
  }, []);

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
    setSelected([]);
    setPricing(null);
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

  useEffect(() => {
    if (!id || selected.length === 0) {
      setPricing(null);
      return;
    }
    let cancelled = false;
    calculatePayment({ court_id: id, slot_count: selected.length, slot_date: date })
      .then((data) => {
        if (!cancelled) setPricing(data);
      })
      .catch(() => {
        if (!cancelled) setPricing(null);
      });
    return () => {
      cancelled = true;
    };
  }, [id, selected, date]);

  const toggleSlot = (slot) => {
    if (slot.is_booked || slot.is_blocked) return;
    setSelected((prev) => {
      const exists = prev.includes(slot.id);
      if (exists) return prev.filter((x) => x !== slot.id);
      if (prev.length >= 8) return prev;
      return [...prev, slot.id];
    });
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

  const book = async () => {
    setError('');
    setSuccess(null);
    if (selected.length === 0) {
      setSlotsOpen(true);
      setError('Kamida bitta vaqt tanlang');
      slotsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const run = async () => {
      setBusy(true);
      try {
        const booking = await createBooking({ court_id: id, time_slot_ids: selected });
        let paymentUrl = null;
        if (!pricing?.pay_at_venue_only) {
          try {
            const payment = await createPayment({
              booking_id: booking.id,
              method: payMethod,
              court_amount: pricing?.required_prepayment_amount || undefined,
            });
            paymentUrl = payment?.payment_url || null;
          } catch (payErr) {
            setError(payErr.message || 'To‘lov yaratilmadi, lekin bron saqlandi');
          }
        }
        setSuccess({ booking, paymentUrl });
        setSelected([]);
        const fresh = await getCourtSlots(id, date);
        setSlots(Array.isArray(fresh) ? fresh : []);
        if (paymentUrl) window.open(paymentUrl, '_blank', 'noopener,noreferrer');
      } catch (err) {
        setError(err.message || 'Bron qilib bo‘lmadi');
      } finally {
        setBusy(false);
      }
    };

    if (!isAuthenticated) {
      openAuth(run);
      return;
    }
    await run();
  };

  const onStickyBook = () => {
    if (!slotsOpen) {
      setSlotsOpen(true);
      slotsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    book();
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

  const bookingBlock = (
    <div className="court-m__book" id="bron" ref={slotsRef}>
      <h2 className="court-m__h2">Mavjudligi</h2>

      <div className="court-m__dates">
        {dates.map((d) => {
          const p = dateParts(d);
          return (
            <button
              key={d}
              type="button"
              className={`court-m__date${d === date ? ' is-active' : ''}`}
              onClick={() => {
                setDate(d);
                setSlotsOpen(true);
              }}
            >
              <em>{p.week}</em>
              <strong>
                {p.day} {p.month}
              </strong>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className="court-m__avail"
        onClick={() => setSlotsOpen((v) => !v)}
      >
        <span>
          <i className={`court-m__dot${freeCount > 0 ? ' is-free' : ''}`} />
          {slotsLoading
            ? 'Yuklanmoqda…'
            : freeCount > 0
              ? `${freeCount} ta bo‘sh joy`
              : 'Bo‘sh joy yo‘q'}
        </span>
        <span className="court-m__avail-link">
          {slotsOpen ? 'Yopish' : 'Slotlarni ko‘rish'} ›
        </span>
      </button>

      {slotsOpen && (
        <div className="court-m__slots-wrap">
          {slotsLoading ? (
            <p className="app-muted">Slotlar yuklanmoqda…</p>
          ) : slots.length === 0 ? (
            <div className="book-empty">Bu kunga slotlar yo‘q.</div>
          ) : (
            <div className="book-slots book-slots--v2">
              {slots.map((slot) => {
                const disabled = slot.is_booked || slot.is_blocked;
                const active = selected.includes(slot.id);
                return (
                  <button
                    key={slot.id}
                    type="button"
                    disabled={disabled}
                    className={`book-slot-v2${active ? ' is-active' : ''}${disabled ? ' is-disabled' : ''}`}
                    onClick={() => toggleSlot(slot)}
                  >
                    {formatTime(slot.start_time)}
                    <small>{formatTime(slot.end_time)}</small>
                  </button>
                );
              })}
            </div>
          )}

          {selectedSlots.length > 0 && (
            <div className="book-selected">
              <div className="book-selected__title">Tanlangan: {selectedSlots.length} soat</div>
              <div className="book-selected__times">
                {selectedSlots.map((s) => (
                  <span key={s.id}>
                    {formatTime(s.start_time)}–{formatTime(s.end_time)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {pricing && (
            <div className="book-price book-price--v2">
              <div>
                <span>Jami</span>
                <strong>{formatPrice(pricing.court_price)}</strong>
              </div>
              <div>
                <span>Oldindan to‘lov</span>
                <strong>{formatPrice(pricing.required_prepayment_amount || pricing.total_online)}</strong>
              </div>
            </div>
          )}

          {!pricing?.pay_at_venue_only && selected.length > 0 && (
            <div className="pay-methods pay-methods--v2">
              {methods.payme && (
                <button
                  type="button"
                  className={`pay-chip${payMethod === 'payme' ? ' is-active' : ''}`}
                  onClick={() => setPayMethod('payme')}
                >
                  Payme
                </button>
              )}
              {methods.click && (
                <button
                  type="button"
                  className={`pay-chip${payMethod === 'click' ? ' is-active' : ''}`}
                  onClick={() => setPayMethod('click')}
                >
                  Click
                </button>
              )}
            </div>
          )}

          {error && <p className="auth-error">{error}</p>}
          {success && (
            <div className="book-success">
              <p>
                Bron yaratildi: <strong>{success.booking.booking_code}</strong>
              </p>
              {success.paymentUrl && (
                <a href={success.paymentUrl} target="_blank" rel="noopener noreferrer" className="btn btn--primary btn--sm">
                  To‘lovni ochish
                </a>
              )}
              <Link to="/bronlarim" className="text-link">
                Mening bronlarim
              </Link>
            </div>
          )}

          {!isMobile && (
            <button
              type="button"
              className="btn btn--primary btn--lg book-cta"
              disabled={busy || selected.length === 0}
              onClick={book}
            >
              {busy ? 'Bron qilinmoqda…' : 'Bron qilish'}
            </button>
          )}
        </div>
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

      <section className="court-m">
        <div
          className="court-m__hero"
          onTouchStart={onHeroTouchStart}
          onTouchEnd={onHeroTouchEnd}
        >
          <img src={gallery[activeImage] || courtImage(court)} alt={court.name} />

          <button type="button" className="court-m__icon-btn court-m__back" aria-label="Orqaga" onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/'))}>
            ←
          </button>

          <div className="court-m__hero-actions">
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
              {isMobile && bookingBlock}

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

            {!isMobile && <aside className="court-m__aside">{bookingBlock}</aside>}
          </div>
        </div>

        {isMobile && (
          <div className="court-m__sticky">
            <button type="button" className="court-m__sticky-btn" disabled={busy} onClick={onStickyBook}>
              {busy
                ? 'Bron qilinmoqda…'
                : selected.length > 0
                  ? `Bron qilish · ${selected.length} soat`
                  : 'Bron qilish'}
            </button>
          </div>
        )}
      </section>
    </>
  );
}
