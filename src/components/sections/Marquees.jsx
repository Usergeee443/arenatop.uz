import { Link } from 'react-router-dom';

function Stars() {
  return (
    <div className="review__stars" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export function ReviewsMarquee({ reviews }) {
  const loop = [...reviews, ...reviews];

  return (
    <div className="marquee" aria-label="Foydalanuvchi fikrlari">
      <div className="marquee__track marquee__track--reviews">
        {loop.map((r, i) => (
          <article key={`${r.name}-${i}`} className="marquee__card review review--card">
            <Stars />
            <p className="review__text">“{r.text}”</p>
            <div className="review__author">
              <span className="review__avatar">{r.initials}</span>
              <div>
                <div className="review__name">{r.name}</div>
                <div className="review__role">{r.role}</div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export function ArenasMarquee({ arenas }) {
  if (!arenas?.length) {
    return <p className="app-muted" style={{ textAlign: 'center', padding: '1rem' }}>Maydonlar yuklanmoqda…</p>;
  }

  const loop = [...arenas, ...arenas];

  return (
    <div className="marquee marquee--arenas" aria-label="Mavjud arenalar">
      <div className="marquee__track marquee__track--arenas">
        {loop.map((arena, i) => {
          const id = arena.id || arena.slug;
          const image = arena.cover_image_url || arena.image;
          const to = arena.id ? `/maydon/${arena.id}` : `/stadion/${arena.slug}`;
          return (
            <div key={`${id}-${i}`} className="arena-card">
              <div className="arena-card__media">
                <img src={image} alt={arena.name} loading="lazy" />
              </div>
              <Link to={to} className="btn btn--primary arena-card__btn">
                {arena.name}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function OwnerTeaser({ reviews }) {
  return (
    <section className="section owner-teaser">
      <div className="container">
        <div className="owner-teaser__grid">
          <div className="owner-teaser__copy">
            <span className="eyebrow">Arena egalari</span>
            <h2 className="display-title">Stadionlar nima deydi?</h2>
            <p className="display-lead">
              ArenaTop bilan bronlar, mijozlar va moliya bitta tizimda. Maydoningizni raqamlashtiring.
            </p>
            <Link to="/stadioni-borlar" className="btn btn--primary btn--lg">
              Stadioni borlar uchun
            </Link>
          </div>
          <div className="owner-teaser__list">
            {reviews.map((r) => (
              <article key={r.name} className="owner-teaser__item">
                <p>“{r.text}”</p>
                <div className="review__author">
                  <span className="review__avatar">{r.initials}</span>
                  <div>
                    <div className="review__name">{r.name}</div>
                    <div className="review__role">{r.role}</div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
