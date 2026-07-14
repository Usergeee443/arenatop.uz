import { Link } from 'react-router-dom';
import AppHeader from '../components/layout/AppHeader';
import PageMeta from '../components/layout/PageMeta';

export default function TermsPage() {
  return (
    <>
      <PageMeta
        title="Foydalanish shartlari — ArenaTop"
        description="ArenaTop foydalanish shartlari. Tez orada to‘liq matn joylashtiriladi."
        path="/terms"
      />
      <AppHeader />

      <section className="legal">
        <div className="container legal__inner">
          <span className="eyebrow">Huquqiy</span>
          <h1 className="display-title">Foydalanish shartlari</h1>
          <p className="legal__status">Tez kunda</p>
          <p className="display-lead">
            ArenaTop xizmatidan foydalanish shartlari hozircha tayyorlanmoqda. To‘liq matn tez orada ushbu
            sahifada e’lon qilinadi.
          </p>
          <div className="legal__actions">
            <Link to="/" className="btn btn--primary">
              Bosh sahifaga qaytish
            </Link>
            <Link to="/privacy" className="btn btn--ghost">
              Maxfiylik siyosati
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
