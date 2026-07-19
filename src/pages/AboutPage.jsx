import { Link } from 'react-router-dom';
import AppHeader from '../components/layout/AppHeader';
import PageMeta from '../components/layout/PageMeta';
import { EMAIL, PHONE_DISPLAY, TELEGRAM } from '../constants/links';

export default function AboutPage() {
  return (
    <>
      <PageMeta
        title="Biz haqimizda — ArenaTop"
        description="ArenaTop — O‘zbekistonda sport maydonlarini onlayn bron qilish platformasi."
        path="/biz-haqimizda"
      />
      <AppHeader />

      <section className="app-page">
        <div className="container" style={{ maxWidth: 760 }}>
          <span className="eyebrow">Kompaniya</span>
          <h1 className="display-title">Biz haqimizda</h1>
          <p className="display-lead">
            ArenaTop — O‘zbekistondagi sport maydonlari va zallarni qidirish, bron qilish va to‘lash uchun
            yaratilgan platforma. Maqsadimiz sportni rejalashtirishni sodda, shaffof va tez qilish.
          </p>

          <div className="about-grid">
            <article>
              <h3>Foydalanuvchilar uchun</h3>
              <p>Yaqinidagi maydonni toping, bo‘sh vaqtni ko‘ring va bir necha bosishda bron qiling.</p>
            </article>
            <article>
              <h3>Stadion egalari uchun</h3>
              <p>Onlayn bronlar, to‘lovlar va mijozlar — bitta tizimda. Bandlikni oshiring.</p>
            </article>
            <article>
              <h3>Ishonch</h3>
              <p>Haqiqiy sharhlar, shaffof narxlar va himoyalangan to‘lovlar.</p>
            </article>
          </div>

          <div className="help-actions">
            <Link to="/" className="btn btn--primary">
              Maydonlarni ko‘rish
            </Link>
            <Link to="/stadioni-borlar" className="btn btn--ghost">
              Stadioni borlar uchun
            </Link>
            <Link to="/yuklab-olish" className="btn btn--ghost">
              Ilovani yuklash
            </Link>
          </div>

          <p className="app-muted" style={{ marginTop: '2rem' }}>
            Aloqa: <a href={`mailto:${EMAIL}`}>{EMAIL}</a> · {PHONE_DISPLAY} ·{' '}
            <a href={TELEGRAM} target="_blank" rel="noopener noreferrer">
              Telegram
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
