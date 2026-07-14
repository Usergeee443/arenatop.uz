import { useState } from 'react';

export default function Faq({ items, renderAnswer }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="faq">
      {items.map((item, i) => {
        const open = openIndex === i;
        return (
          <div key={item.q} className={`faq__item${open ? ' is-open' : ''}`}>
            <button
              type="button"
              className="faq__btn"
              aria-expanded={open}
              onClick={() => setOpenIndex(open ? null : i)}
            >
              {item.q}
            </button>
            <div className="faq__panel">
              <div>
                {renderAnswer ? renderAnswer(item) : <p>{item.a}</p>}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
