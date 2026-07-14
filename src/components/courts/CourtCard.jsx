import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { checkSavedStatus, saveCourt, unsaveCourt } from '../../api/users';
import { useAuth } from '../../context/AuthContext';
import { courtImage, formatPrice } from '../../utils/format';

export default function CourtCard({ court, saved: savedProp, onSavedChange }) {
  const { isAuthenticated, openAuth } = useAuth();
  const [saved, setSaved] = useState(Boolean(savedProp));
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setSaved(Boolean(savedProp));
  }, [savedProp]);

  useEffect(() => {
    if (!isAuthenticated || savedProp !== undefined) return;
    let cancelled = false;
    checkSavedStatus(court.id)
      .then((res) => {
        if (!cancelled) setSaved(Boolean(res?.is_saved ?? res?.saved ?? res));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [court.id, isAuthenticated, savedProp]);

  const toggleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      openAuth();
      return;
    }
    setBusy(true);
    try {
      if (saved) {
        await unsaveCourt(court.id);
        setSaved(false);
        onSavedChange?.(court.id, false);
      } else {
        await saveCourt(court.id);
        setSaved(true);
        onSavedChange?.(court.id, true);
      }
    } catch (err) {
      alert(err.message || 'Saqlab bo‘lmadi');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Link to={`/maydon/${court.id}`} className="court-card">
      <div className="court-card__media">
        <img src={courtImage(court)} alt={court.name} loading="lazy" />
        <button
          type="button"
          className={`court-card__fav${saved ? ' is-saved' : ''}`}
          aria-label={saved ? 'Sevimlidan olib tashlash' : 'Sevimlilarga qo‘shish'}
          disabled={busy}
          onClick={toggleSave}
        >
          ♥
        </button>
      </div>
      <div className="court-card__body">
        <div className="court-card__top">
          <h3>{court.name}</h3>
          <span className="court-card__rating">★ {Number(court.rating || 0).toFixed(1)}</span>
        </div>
        <p className="court-card__loc">{court.location_name}</p>
        <div className="court-card__meta">
          <span>{court.category?.name || 'Sport'}</span>
          <strong>{formatPrice(court.price_per_hour)} / soat</strong>
        </div>
      </div>
    </Link>
  );
}
