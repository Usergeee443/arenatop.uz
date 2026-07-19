import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { calculatePayment, createBooking, createPayment, getPaymentMethods } from '../../api/bookings';
import { getCourtSlots } from '../../api/courts';
import { useAuth } from '../../context/AuthContext';
import {
  addDaysISO,
  courtImage,
  formatPrice,
  formatTime,
  todayISO,
} from '../../utils/format';

function dateChip(iso) {
  const d = new Date(`${iso}T12:00:00`);
  const isToday = iso === todayISO();
  return {
    weekday: isToday ? 'Bugun' : d.toLocaleDateString('uz-UZ', { weekday: 'long' }),
    day: d.getDate(),
    monthShort: d.toLocaleDateString('uz-UZ', { month: 'short' }),
  };
}

function formatSlotSummary(iso, slots) {
  if (!slots.length) return '';
  const d = new Date(`${iso}T12:00:00`);
  const datePart = d.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', weekday: 'long' });
  const start = formatTime(slots[0].start_time);
  const end = formatTime(slots[slots.length - 1].end_time);
  return `${start} - ${end}, ${datePart}`;
}

function IconLock() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17 9h-1V7a4 4 0 10-8 0v2H7a2 2 0 00-2 2v8a2 2 0 002 2h10a2 2 0 002-2v-8a2 2 0 00-2-2zm-7-2a2 2 0 114 0v2h-4V7zm7 12H7v-8h10v8z" />
    </svg>
  );
}

function IconPencil() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 20h9" strokeLinecap="round" />
      <path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4 12.5-12.5z" strokeLinejoin="round" />
    </svg>
  );
}

export default function BookingFlow({ court, open, initialDate, onClose, onDone }) {
  const { user, isAuthenticated, openAuth } = useAuth();
  const [step, setStep] = useState('slots');
  const [date, setDate] = useState(initialDate || todayISO());
  const [slots, setSlots] = useState([]);
  const [selected, setSelected] = useState([]);
  const [pricing, setPricing] = useState(null);
  const [payMethod, setPayMethod] = useState('payme');
  const [methods, setMethods] = useState({ payme: true, click: true });
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);
  const [bookName, setBookName] = useState('');
  const [nameDraft, setNameDraft] = useState('');
  const [nameSheetOpen, setNameSheetOpen] = useState(false);
  const [cancelSheetOpen, setCancelSheetOpen] = useState(false);

  const dates = useMemo(() => Array.from({ length: 14 }, (_, i) => addDaysISO(todayISO(), i)), []);
  const cancelHours = Number(court?.cancellation_window_hours ?? 1);
  const isToday = date === todayISO();
  const sameDayCashCourt = Boolean(court?.same_day_cash_only_enabled);
  const payAtVenueOnly = pricing
    ? Boolean(pricing.pay_at_venue_only)
    : sameDayCashCourt && isToday && selected.length > 0;

  const selectedSlots = useMemo(
    () =>
      slots
        .filter((s) => selected.includes(s.id))
        .sort((a, b) => String(a.start_time).localeCompare(String(b.start_time))),
    [slots, selected]
  );

  const courtPrice = pricing?.court_price ?? selected.length * Number(court?.price_per_hour || 0);
  const prepay = payAtVenueOnly
    ? 0
    : (pricing?.required_prepayment_amount ?? pricing?.total_online ?? 0);
  const atVenue = payAtVenueOnly
    ? (pricing?.cash_amount ?? courtPrice)
    : (pricing?.cash_amount ?? Math.max(0, Number(courtPrice) - Number(prepay || 0)));

  const displayName = bookName || user?.name || '—';

  useEffect(() => {
    if (!open) return undefined;
    setStep('slots');
    setDate(initialDate || todayISO());
    setSelected([]);
    setPricing(null);
    setError('');
    setSuccess(null);
    setNameSheetOpen(false);
    setCancelSheetOpen(false);
    setBookName(user?.name || '');
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open, initialDate, user?.name]);

  useEffect(() => {
    if (!open) return;
    getPaymentMethods()
      .then((res) => {
        setMethods({
          payme: res?.payme !== false,
          click: res?.click !== false,
        });
      })
      .catch(() => {});
  }, [open]);

  useEffect(() => {
    if (!open || !court?.id || !date) return undefined;
    let cancelled = false;
    setSlotsLoading(true);
    setSelected([]);
    setPricing(null);
    getCourtSlots(court.id, date)
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
  }, [open, court?.id, date]);

  useEffect(() => {
    if (!open || !court?.id || selected.length === 0) {
      setPricing(null);
      return undefined;
    }
    let cancelled = false;
    calculatePayment({ court_id: court.id, slot_count: selected.length, slot_date: date })
      .then((data) => {
        if (!cancelled) setPricing(data);
      })
      .catch(() => {
        if (!cancelled) setPricing(null);
      });
    return () => {
      cancelled = true;
    };
  }, [open, court?.id, selected, date]);

  if (!open || !court) return null;

  const toggleSlot = (slot) => {
    if (slot.is_booked || slot.is_blocked) return;
    setSelected((prev) => {
      const exists = prev.includes(slot.id);
      if (exists) return prev.filter((x) => x !== slot.id);
      if (prev.length >= 8) return prev;
      return [...prev, slot.id];
    });
  };

  const goConfirm = () => {
    if (selected.length === 0) {
      setError('Kamida bitta vaqt tanlang');
      return;
    }
    setError('');
    if (!isAuthenticated) {
      openAuth(() => setStep('confirm'));
      return;
    }
    setStep('confirm');
  };

  const goPayOrBook = () => {
    setError('');
    if (payAtVenueOnly) {
      submitBooking(null);
      return;
    }
    setStep('pay');
  };

  const submitBooking = async (method) => {
    setError('');
    const run = async () => {
      setBusy(true);
      try {
        const booking = await createBooking({
          court_id: court.id,
          time_slot_ids: selected,
        });
        let paymentUrl = null;
        if (method && !payAtVenueOnly) {
          try {
            const payment = await createPayment({
              booking_id: booking.id,
              method,
              court_amount: pricing?.required_prepayment_amount || undefined,
            });
            paymentUrl = payment?.payment_url || null;
          } catch (payErr) {
            setError(payErr.message || 'To‘lov yaratilmadi, lekin bron saqlandi');
          }
        }
        setSuccess({ booking, paymentUrl, payAtVenueOnly });
        setStep('success');
        onDone?.();
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

  const back = () => {
    setError('');
    if (nameSheetOpen) {
      setNameSheetOpen(false);
      return;
    }
    if (cancelSheetOpen) {
      setCancelSheetOpen(false);
      return;
    }
    if (step === 'slots') onClose();
    else if (step === 'confirm') setStep('slots');
    else if (step === 'pay') setStep('confirm');
    else onClose();
  };

  const saveBookName = (e) => {
    e.preventDefault();
    const next = nameDraft.trim();
    if (next.length < 2) {
      setError('Ism kamida 2 belgidan iborat bo‘lsin');
      return;
    }
    setBookName(next);
    setNameSheetOpen(false);
    setError('');
  };

  const title =
    step === 'slots'
      ? court.name
      : step === 'confirm'
        ? 'Tasdiqlash'
        : step === 'pay'
          ? 'To‘lov'
          : 'Tayyor';

  return (
    <div className="bf" role="dialog" aria-modal="true" aria-label="Bron qilish">
      <div className="bf__panel">
        <header className="bf__top">
          <button type="button" className="bf__back" aria-label="Orqaga" onClick={back}>
            ←
          </button>
          <div className="bf__top-text">
            <h1>{title}</h1>
            {step === 'pay' && (
              <p className="bf__top-price">{formatPrice(prepay || courtPrice)}</p>
            )}
          </div>
        </header>

        <div className="bf__body">
          {step === 'slots' && (
            <>
              <div className="bf-dates">
                {dates.map((d) => {
                  const p = dateChip(d);
                  return (
                    <button
                      key={d}
                      type="button"
                      className={`bf-date${d === date ? ' is-active' : ''}`}
                      onClick={() => setDate(d)}
                    >
                      <strong>
                        {p.day} {p.monthShort}
                      </strong>
                      <span>{p.weekday}</span>
                    </button>
                  );
                })}
              </div>

              {sameDayCashCourt && isToday && (
                <div className="bf-banner">
                  Bugungi bron — online to‘lovsiz. To‘lov maydonda naqd amalga oshiriladi.
                </div>
              )}

              <div className="bf-slots-head">
                <h2>Vaqtlarni tanlang</h2>
                <div className="bf-legend">
                  <span><i className="bf-legend__box" /> Bo‘sh</span>
                  <span><i className="bf-legend__box is-on" /> Tanlangan</span>
                  <span><i className="bf-legend__box is-off" /> Band</span>
                </div>
              </div>

              {slotsLoading ? (
                <p className="app-muted">Slotlar yuklanmoqda…</p>
              ) : slots.length === 0 ? (
                <div className="book-empty">Bu kunga slotlar yo‘q.</div>
              ) : (
                <div className="bf-slots">
                  {slots.map((slot) => {
                    const disabled = slot.is_booked || slot.is_blocked;
                    const active = selected.includes(slot.id);
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        disabled={disabled}
                        className={`bf-slot${active ? ' is-active' : ''}${disabled ? ' is-disabled' : ''}`}
                        onClick={() => toggleSlot(slot)}
                      >
                        {disabled && (
                          <span className="bf-slot__lock" aria-hidden="true">
                            <IconLock />
                          </span>
                        )}
                        <strong>
                          {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                        </strong>
                        {disabled ? (
                          <span className="bf-slot__band">Band</span>
                        ) : (
                          <span className="bf-slot__price">{formatPrice(court.price_per_hour)}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {error && <p className="auth-error">{error}</p>}
            </>
          )}

          {step === 'confirm' && (
            <>
              <article className="bf-summary">
                <img src={courtImage(court)} alt="" className="bf-summary__img" />
                <div className="bf-summary__body">
                  <h2>{court.name}</h2>
                  <p>{formatSlotSummary(date, selectedSlots)}</p>
                  <p className="bf-summary__price">{formatPrice(courtPrice)}</p>
                  <button type="button" className="bf-link" onClick={() => setStep('slots')}>
                    Tahrirlash
                  </button>
                </div>
              </article>

              <section className="bf-block">
                <div className="bf-block__head">
                  <h3>Aloqa ma’lumotlari</h3>
                  <button
                    type="button"
                    className="bf-icon-link"
                    aria-label="Ismni tahrirlash"
                    onClick={() => {
                      setNameDraft(bookName || user?.name || '');
                      setNameSheetOpen(true);
                    }}
                  >
                    <IconPencil />
                  </button>
                </div>
                <p>Ism: {displayName}</p>
                <p>Telefon: {user?.phone_number ? `+${user.phone_number}` : '—'}</p>
                {bookName && user?.name && bookName !== user.name && (
                  <p className="bf-note">Bu bron uchun ism — profilingiz o‘zgarmaydi.</p>
                )}
              </section>

              <section className="bf-block">
                <h3>Narx tafsilotlari</h3>
                <div className="bf-row">
                  <span>Stadion narxi</span>
                  <strong>{formatPrice(courtPrice)}</strong>
                </div>
              </section>

              <section className="bf-block">
                <h3>To‘lov bosqichi</h3>
                {payAtVenueOnly ? (
                  <>
                    <div className="bf-banner bf-banner--soft">
                      Online to‘lov yo‘q. To‘liq summa maydonda naqd to‘lanadi.
                    </div>
                    <div className="bf-row">
                      <span>Oldindan to‘lov</span>
                      <strong>{formatPrice(0)}</strong>
                    </div>
                    <div className="bf-row">
                      <span>Maydonda to‘lanadi</span>
                      <strong>{formatPrice(atVenue || courtPrice)}</strong>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bf-row">
                      <span>Oldindan to‘lov</span>
                      <strong>{formatPrice(prepay)}</strong>
                    </div>
                    <div className="bf-row">
                      <span>Maydonda to‘lanadi</span>
                      <strong>{formatPrice(atVenue)}</strong>
                    </div>
                  </>
                )}
              </section>

              <section className="bf-block">
                <h3>Bekor qilish siyosati</h3>
                <p className="bf-policy">
                  Foydalanuvchilar o‘yindan kamida {cancelHours} soat oldin bronni bepul bekor qilishi mumkin.{' '}
                  <button type="button" className="bf-link" onClick={() => setCancelSheetOpen(true)}>
                    Batafsil
                  </button>
                </p>
              </section>

              {error && <p className="auth-error">{error}</p>}
            </>
          )}

          {step === 'pay' && (
            <>
              <p className="bf-pay-hint">To‘lov tizimlaridan birini tanlang</p>
              <div className="bf-pay-grid">
                {methods.payme && (
                  <button
                    type="button"
                    className={`bf-pay-card${payMethod === 'payme' ? ' is-active' : ''}`}
                    disabled={busy}
                    onClick={() => {
                      setPayMethod('payme');
                      submitBooking('payme');
                    }}
                  >
                    <span className="bf-pay-logo bf-pay-logo--payme">
                      Pay<em>me</em>
                    </span>
                  </button>
                )}
                {methods.click && (
                  <button
                    type="button"
                    className={`bf-pay-card${payMethod === 'click' ? ' is-active' : ''}`}
                    disabled={busy}
                    onClick={() => {
                      setPayMethod('click');
                      submitBooking('click');
                    }}
                  >
                    <span className="bf-pay-logo bf-pay-logo--click">
                      <i /> click
                    </span>
                  </button>
                )}
              </div>
              {busy && <p className="app-muted" style={{ marginTop: '1rem' }}>Bron yaratilmoqda…</p>}
              {error && <p className="auth-error">{error}</p>}
            </>
          )}

          {step === 'success' && success && (
            <div className="bf-success">
              <h2>Bron yaratildi</h2>
              <p>
                Kod: <strong>{success.booking.booking_code}</strong>
              </p>
              {success.payAtVenueOnly && (
                <p className="bf-note">To‘lov maydonda naqd amalga oshiriladi.</p>
              )}
              {success.paymentUrl && (
                <a href={success.paymentUrl} target="_blank" rel="noopener noreferrer" className="btn btn--primary">
                  To‘lovni ochish
                </a>
              )}
              <Link to="/bronlarim" className="btn btn--ghost">
                Mening bronlarim
              </Link>
              <button type="button" className="bf-link" onClick={onClose}>
                Yopish
              </button>
            </div>
          )}
        </div>

        {step === 'slots' && (
          <div className="bf__foot">
            <button
              type="button"
              className="bf__cta"
              disabled={selected.length === 0}
              onClick={goConfirm}
            >
              Davom etish
            </button>
          </div>
        )}

        {step === 'confirm' && (
          <div className="bf__foot bf__foot--split">
            <div className="bf__foot-sum">
              <strong>{formatPrice(payAtVenueOnly ? (atVenue || courtPrice) : (prepay || courtPrice))}</strong>
              {payAtVenueOnly && <span className="bf__foot-hint">Maydonda</span>}
            </div>
            <button type="button" className="bf__cta bf__cta--sm" disabled={busy} onClick={goPayOrBook}>
              {busy ? '…' : 'Bron qilish'}
            </button>
          </div>
        )}
      </div>

      {nameSheetOpen && (
        <div className="bf-sheet" role="dialog" aria-label="Bron ismini tahrirlash">
          <button type="button" className="bf-sheet__backdrop" aria-label="Yopish" onClick={() => setNameSheetOpen(false)} />
          <div className="bf-sheet__panel">
            <div className="bf-sheet__handle" />
            <h3>Bron uchun ism</h3>
            <p className="bf-sheet__lead">Faqat shu bron uchun. Profil ismi o‘zgarmaydi.</p>
            <form onSubmit={saveBookName}>
              <label className="auth-label">
                Ism
                <input
                  type="text"
                  value={nameDraft}
                  onChange={(e) => setNameDraft(e.target.value)}
                  minLength={2}
                  required
                  autoFocus
                />
              </label>
              <button type="submit" className="btn btn--primary" style={{ width: '100%', marginTop: '0.75rem' }}>
                Saqlash
              </button>
            </form>
          </div>
        </div>
      )}

      {cancelSheetOpen && (
        <div className="bf-sheet" role="dialog" aria-label="Bekor qilish siyosati">
          <button type="button" className="bf-sheet__backdrop" aria-label="Yopish" onClick={() => setCancelSheetOpen(false)} />
          <div className="bf-sheet__panel">
            <div className="bf-sheet__handle" />
            <h3>Bekor qilish siyosati</h3>
            <div className="bf-cancel-card">
              <span className="bf-cancel-card__n">{cancelHours}</span>
              <div>
                <strong>soat</strong>
                <p>O‘yin boshlanishidan kamida shuncha soat oldin bepul bekor qilish mumkin.</p>
              </div>
            </div>
            <p className="bf-sheet__lead">
              Bu {court.name} uchun belgilangan muddat. Undan keyin bekor qilish shartlari boshqacha bo‘lishi mumkin.
            </p>
            <Link to="/oferta" className="bf-link" onClick={onClose}>
              Umumiy oferta →
            </Link>
            <button type="button" className="btn btn--ghost" style={{ width: '100%', marginTop: '1rem' }} onClick={() => setCancelSheetOpen(false)}>
              Yopish
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
