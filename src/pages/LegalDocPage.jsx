import { useEffect, useState } from 'react';
import { api } from '../api/client';
import AppHeader from '../components/layout/AppHeader';
import PageMeta from '../components/layout/PageMeta';

function renderContent(text) {
  if (!text) return null;
  return text.split(/\n\n+/).map((block, i) => {
    const lines = block.split('\n').filter(Boolean);
    if (lines.every((l) => l.trim().startsWith('*') || l.trim().startsWith('•') || l.trim().startsWith('-'))) {
      return (
        <ul key={i} className="legal-doc__list">
          {lines.map((l) => (
            <li key={l}>{l.replace(/^[\*\•\-]\s*/, '')}</li>
          ))}
        </ul>
      );
    }
    const [first, ...rest] = lines;
    const isHeading = /^\d+\./.test(first.trim());
    return (
      <div key={i} className="legal-doc__block">
        {isHeading ? <h2>{first}</h2> : <p>{first}</p>}
        {rest.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    );
  });
}

export default function LegalDocPage({
  title,
  path,
  description,
  fetchPath,
  fallbackTitle,
  fallbackContent,
}) {
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(Boolean(fetchPath));
  const [error, setError] = useState('');

  useEffect(() => {
    if (!fetchPath) {
      setDoc({ title: fallbackTitle, content: fallbackContent, updated_at: null });
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    api(fetchPath)
      .then((data) => {
        if (!cancelled) setDoc(data);
      })
      .catch((err) => {
        if (!cancelled) {
          if (fallbackContent) {
            setDoc({ title: fallbackTitle, content: fallbackContent, updated_at: null });
          } else {
            setError(err.message || 'Hujjat yuklanmadi');
          }
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [fetchPath, fallbackTitle, fallbackContent]);

  return (
    <>
      <PageMeta title={`${title} — ArenaTop`} description={description} path={path} />
      <AppHeader />
      <section className="app-page">
        <div className="container legal-doc">
          {loading && <p className="app-muted">Yuklanmoqda…</p>}
          {error && <p className="auth-error">{error}</p>}
          {doc && (
            <>
              <span className="eyebrow">Huquqiy</span>
              <h1 className="display-title">{doc.title || title}</h1>
              {doc.updated_at && (
                <p className="legal-doc__updated">
                  Yangilangan: {new Date(doc.updated_at).toLocaleDateString('uz-UZ')}
                </p>
              )}
              <div className="legal-doc__body">{renderContent(doc.content)}</div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
