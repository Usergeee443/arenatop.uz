import { Link } from 'react-router-dom';
import AppHeader from '../components/layout/AppHeader';
import PageMeta from '../components/layout/PageMeta';

export default function PrivacyPage() {
  return (
    <>
      <PageMeta
        title="Maxfiylik siyosati — ArenaTop"
        description="ArenaTop maxfiylik siyosati. Tez orada to‘liq matn joylashtiriladi."
        path="/privacy"
      />
      <AppHeader />

      <section className="legal">
        <div className="container legal__inner">
          <span className="eyebrow">Huquqiy</span>
          <h1 className="display-title">Maxfiylik siyosati</h1>
          <p className="legal__status">Tez kunda</p>
          <p className="display-lead">
            Shaxsiy ma’lumotlaringizni qanday to‘plash, saqlash va himoya qilishimiz haqidagi siyosat hozircha
            tayyorlanmoqda. To‘liq matn tez orada ushbu sahifada e’lon qilinadi.
          </p>
          <div className="legal__actions">
            <Link to="/" className="btn btn--primary">
              Bosh sahifaga qaytish
            </Link>
            <Link to="/terms" className="btn btn--ghost">
              Foydalanish shartlari
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
