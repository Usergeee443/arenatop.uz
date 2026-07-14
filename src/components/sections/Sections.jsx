function Stars() {
  return (
    <div className="review__stars" aria-label="5 yulduzdan 5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function ShowcaseRow({ badge, eyebrow, title, text, image, imageAlt, variant, reverse, items }) {
  const mediaClass = [
    'showcase__media',
    variant === 'cerulean' ? 'showcase__media--cerulean' : '',
    variant === 'light' ? 'showcase__media--light' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const badgeStyle =
    variant === 'light'
      ? { color: 'var(--elephant)', background: 'rgba(11,46,52,0.08)' }
      : undefined;

  return (
    <div className={`showcase__row${reverse ? ' showcase__row--reverse' : ''}`}>
      <div className={mediaClass}>
        <span className="showcase__media-badge" style={badgeStyle}>
          {badge}
        </span>
        <img src={image} alt={imageAlt} loading="lazy" />
      </div>
      <div className="showcase__copy">
        <span className="eyebrow">{eyebrow}</span>
        <h2 dangerouslySetInnerHTML={{ __html: title.replace(/\n/g, '<br>') }} />
        <p>{text}</p>
        <ul className="showcase__list">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function ReviewsGrid({ reviews }) {
  return (
    <div className="reviews__grid">
      {reviews.map((r) => (
        <article key={r.name} className="review">
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
  );
}

export function StatsGrid({ stats }) {
  return (
    <div className="stats__grid">
      {stats.map((s) => (
        <div key={s.label} className="stat">
          <div className="stat__value">{s.value}</div>
          <div className="stat__label">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

export function TilesGrid({ tiles }) {
  return (
    <div className="tiles">
      {tiles.map((tile) => (
        <div key={tile.title} className="tile">
          <span className="tile__icon" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="9" />
            </svg>
          </span>
          <h3 className="tile__title">{tile.title}</h3>
          <p className="tile__text">{tile.text}</p>
        </div>
      ))}
    </div>
  );
}

export function SectionHeader({ eyebrow, title, lead }) {
  return (
    <div className="section-header">
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="display-title">{title}</h2>
      {lead && <p className="display-lead" style={{ marginInline: 'auto' }}>{lead}</p>}
    </div>
  );
}
