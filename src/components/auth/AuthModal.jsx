import { useEffect, useState } from 'react';
import { initiateAuth, loginOtp, normalizePhone, register, sendOtp } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';

export default function AuthModal() {
  const { authOpen, closeAuth, refreshUser, authIntent } = useAuth();
  const [step, setStep] = useState('phone'); // phone | otp | register
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [userExists, setUserExists] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authOpen) {
      setStep('phone');
      setPhone('');
      setOtp('');
      setName('');
      setError('');
      setBusy(false);
    }
  }, [authOpen]);

  if (!authOpen) return null;

  const onSendPhone = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const normalized = normalizePhone(phone);
      if (normalized.length !== 12) throw new Error('Telefon raqamini to‘g‘ri kiriting (90 123 45 67)');
      const init = await initiateAuth(normalized);
      setUserExists(Boolean(init.user_exists));
      await sendOtp(normalized);
      setStep(init.user_exists ? 'otp' : 'register');
    } catch (err) {
      setError(err.message || 'Xatolik yuz berdi');
    } finally {
      setBusy(false);
    }
  };

  const onVerify = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const normalized = normalizePhone(phone);
      if (step === 'register') {
        if (name.trim().length < 2) throw new Error('Ismingizni kiriting');
        await register({ phone_number: normalized, otp_code: otp, name: name.trim() });
      } else {
        await loginOtp(normalized, otp);
      }
      await refreshUser();
      closeAuth();
      if (typeof authIntent === 'function') authIntent();
    } catch (err) {
      setError(err.message || 'Tasdiqlashda xatolik');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="dl is-open" aria-hidden="false">
      <button type="button" className="dl__backdrop" aria-label="Yopish" onClick={closeAuth} />
      <div className="dl__panel auth-panel" role="dialog" aria-modal="true" aria-label="Kirish">
        <div className="dl__header">
          <div className="dl__title">{step === 'phone' ? 'Kirish' : 'Tasdiqlash'}</div>
          <button type="button" className="dl__close" aria-label="Yopish" onClick={closeAuth}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="dl__content">
          <p className="dl__lead">
            {step === 'phone'
              ? 'Telefon raqamingizga SMS kod yuboramiz.'
              : userExists
                ? 'SMS dagi kodni kiriting.'
                : 'Yangi akkaunt uchun ism va SMS kodni kiriting.'}
          </p>

          {step === 'phone' ? (
            <form className="auth-form" onSubmit={onSendPhone}>
              <label className="auth-label">
                Telefon
                <div className="auth-phone">
                  <span>+998</span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    placeholder="90 123 45 67"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </label>
              {error && <p className="auth-error">{error}</p>}
              <button type="submit" className="btn btn--primary btn--lg" disabled={busy}>
                {busy ? 'Yuborilmoqda…' : 'Kod olish'}
              </button>
            </form>
          ) : (
            <form className="auth-form" onSubmit={onVerify}>
              {!userExists && (
                <label className="auth-label">
                  Ism
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ismingiz"
                    required
                  />
                </label>
              )}
              <label className="auth-label">
                SMS kod
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="1234"
                  required
                />
              </label>
              {error && <p className="auth-error">{error}</p>}
              <button type="submit" className="btn btn--primary btn--lg" disabled={busy}>
                {busy ? 'Tekshirilmoqda…' : 'Davom etish'}
              </button>
              <button type="button" className="btn btn--ghost" onClick={() => setStep('phone')}>
                Raqamni o‘zgartirish
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
