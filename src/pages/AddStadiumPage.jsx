import { Link } from 'react-router-dom';
import AppHeader from '../components/layout/AppHeader';
import PageMeta from '../components/layout/PageMeta';
import { EMAIL, PHONE, PHONE_DISPLAY } from '../constants/links';

export default function AddStadiumPage() {
  return (
    <>
      <PageMeta
        title="Stadion qo‘shish — ArenaTop"
        description="Maydoningizni ArenaTop ga ulang."
        path="/stadion-qoshish"
      />
      <AppHeader />

      <section className="app-page">
        <div className="container" style={{ maxWidth: 760 }}>
          <span className="eyebrow">Biznes</span>
          <h1 className="display-title">Stadioningizni ArenaTop ga qo‘shing</h1>
          <p className="display-lead">
            Onlayn bronlar, mijozlar va moliya — bitta tizimda. Ulanish uchun jamoamiz bilan bog‘laning yoki
            Biznes sahifasidan demo oling.
          </p>

          <ul className="add-stadium__list">
            <li>Real-time jadval va bron tasdiqlash</li>
            <li>Onlayn to‘lov (Payme / Click)</li>
            <li>SMS eslatmalar va hisobotlar</li>
          </ul>

          <div className="help-actions">
            <Link to="/arena" className="btn btn--primary btn--lg">
              Biznes sahifasi
            </Link>
            <a href={`mailto:${EMAIL}?subject=Stadion%20qoshish`} className="btn btn--ghost btn--lg">
              {EMAIL}
            </a>
            <a href={`tel:${PHONE}`} className="btn btn--ghost btn--lg">
              {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
