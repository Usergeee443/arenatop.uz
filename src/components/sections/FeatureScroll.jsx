import { useEffect, useRef, useState } from 'react';

export default function FeatureScroll({ items }) {
  const wrapRef = useRef(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const onScroll = () => {
      const rect = wrap.getBoundingClientRect();
      const total = wrap.offsetHeight - window.innerHeight;
      if (total <= 0) return;
      const progress = Math.min(1, Math.max(0, -rect.top / total));
      const index = Math.min(items.length - 1, Math.floor(progress * items.length));
      setActive(index);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [items.length]);

  return (
    <section className="feat-scroll" id="features" ref={wrapRef} style={{ '--slides': items.length }}>
      <div className="feat-scroll__pin">
        <div className="container feat-scroll__inner">
          {items.map((item, i) => (
            <article
              key={item.eyebrow}
              className={`feat-scroll__slide${i === active ? ' is-active' : ''}${i < active ? ' is-passed' : ''}`}
              aria-hidden={i !== active}
            >
              <div className="feat-scroll__media">
                <span className="feat-scroll__badge">{item.badge}</span>
                <img src={item.image} alt={item.imageAlt} loading={i === 0 ? 'eager' : 'lazy'} />
              </div>
              <div className="feat-scroll__copy">
                <span className="eyebrow">{item.eyebrow}</span>
                <h2 className="feat-scroll__title">
                  {item.title.split('\n').map((line) => (
                    <span key={line}>
                      {line}
                      <br />
                    </span>
                  ))}
                </h2>
                <p className="feat-scroll__text">{item.text}</p>
              </div>
            </article>
          ))}

          <div className="feat-scroll__dots" aria-hidden="true">
            {items.map((item, i) => (
              <span key={item.badge} className={`feat-scroll__dot${i === active ? ' is-active' : ''}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
