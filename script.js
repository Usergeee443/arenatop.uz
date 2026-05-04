// ===================================================================
// ARENA TOP — UI interactions
// ===================================================================

'use strict';

// -----------------------------------
// Preloader — first visit only.
// -----------------------------------
(function () {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    const hide = (immediate = false) => {
        preloader.classList.add('hidden');
        if (immediate) preloader.style.display = 'none';
        else setTimeout(() => (preloader.style.display = 'none'), 400);
    };

    const sameOrigin = (() => {
        try {
            return document.referrer && new URL(document.referrer).origin === window.location.origin;
        } catch {
            return false;
        }
    })();
    const visited = sessionStorage.getItem('arenaTopVisited') === '1';

    if (visited || sameOrigin) {
        hide(true);
    } else {
        window.addEventListener('load', () => setTimeout(() => hide(), 600));
    }
    sessionStorage.setItem('arenaTopVisited', '1');
})();

// -----------------------------------
// Navbar scroll state.
// -----------------------------------
(function () {
    const nav = document.getElementById('nav');
    if (!nav) return;
    const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
})();

// -----------------------------------
// Mobile drawer.
// -----------------------------------
(function () {
    const btn = document.getElementById('navMenu');
    const drawer = document.getElementById('navDrawer');
    if (!btn || !drawer) return;

    const setOpen = (open) => {
        btn.classList.toggle('is-open', open);
        drawer.classList.toggle('is-open', open);
        btn.setAttribute('aria-expanded', String(open));
        drawer.setAttribute('aria-hidden', String(!open));
        document.body.style.overflow = open ? 'hidden' : '';
    };

    btn.addEventListener('click', () => setOpen(!drawer.classList.contains('is-open')));
    drawer.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
    window.addEventListener('resize', () => {
        if (window.innerWidth > 720) setOpen(false);
    });
})();

// -----------------------------------
// Smooth anchor scrolling with nav offset.
// -----------------------------------
document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
        if (a.hasAttribute('data-download-open')) return;
        const hash = a.getAttribute('href');
        if (!hash || hash === '#') return;
        const t = document.querySelector(hash);
        if (!t) return;
        e.preventDefault();
        const navH = getComputedStyle(document.documentElement).getPropertyValue('--nav-h');
        const offset = t.getBoundingClientRect().top + window.scrollY - (parseInt(navH, 10) || 64) - 16;
        window.scrollTo({ top: offset, behavior: 'smooth' });
    });
});

// -----------------------------------
// Smooth page transitions between internal pages.
// -----------------------------------
document.addEventListener('click', (e) => {
    const a = e.target?.closest?.('a');
    if (!a) return;
    if (a.target === '_blank' || a.hasAttribute('download')) return;

    const href = a.getAttribute('href');
    if (!href) return;
    if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;

    let url;
    try {
        url = new URL(href, window.location.href);
    } catch {
        return;
    }
    if (url.origin !== window.location.origin) return;
    if (url.pathname === window.location.pathname && url.hash) return;

    e.preventDefault();
    document.documentElement.classList.add('page-leave');
    setTimeout(() => (window.location.href = url.href), 160);
});

// -----------------------------------
// FAQ accordion.
// -----------------------------------
document.querySelectorAll('.faq__item').forEach((item) => {
    const btn = item.querySelector('.faq__btn');
    if (!btn) return;
    btn.addEventListener('click', () => {
        const open = item.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', String(open));
    });
});

// -----------------------------------
// Reveal on scroll.
// -----------------------------------
(function () {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    if (!('IntersectionObserver' in window)) {
        els.forEach((el) => el.classList.add('is-in'));
        return;
    }

    const io = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-in');
                    io.unobserve(entry.target);
                }
            });
        },
        { rootMargin: '0px 0px -80px 0px', threshold: 0.05 }
    );

    els.forEach((el) => io.observe(el));
})();

// -----------------------------------
// Download modal (desktop) / bottomsheet (mobile).
// -----------------------------------
(function () {
    const sheet = document.getElementById('downloadSheet');
    if (!sheet) return;

    const panel = sheet.querySelector('.dl__panel');
    const closeEls = sheet.querySelectorAll('[data-download-close]');
    const openEls = document.querySelectorAll('[data-download-open]');

    let lastActive = null;

    const setOpen = (open) => {
        sheet.classList.toggle('is-open', open);
        sheet.setAttribute('aria-hidden', String(!open));
        document.body.style.overflow = open ? 'hidden' : '';

        if (open) {
            lastActive = document.activeElement;
            setTimeout(() => {
                const focusTarget =
                    sheet.querySelector('[data-download-close]') ||
                    sheet.querySelector('a,button,[tabindex]:not([tabindex="-1"])');
                focusTarget?.focus?.();
            }, 0);
        } else {
            const toFocus = lastActive;
            lastActive = null;
            setTimeout(() => toFocus?.focus?.(), 0);
        }
    };

    openEls.forEach((el) => {
        el.addEventListener('click', (e) => {
            e.preventDefault?.();
            setOpen(true);
        });
    });

    closeEls.forEach((el) => el.addEventListener('click', () => setOpen(false)));

    sheet.addEventListener('click', (e) => {
        // Safety: if someone clicks outside panel but not on backdrop.
        if (!panel) return;
        if (e.target === sheet) setOpen(false);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sheet.classList.contains('is-open')) setOpen(false);
    });
})();

// -----------------------------------
// Hero’dagi bitta telefon + scroll-galereya (1-slayd: avval rasm, keyin matn).
// -----------------------------------
(function () {
    const track = document.querySelector('[data-scroll-gallery-track]');
    const pin = document.querySelector('[data-scroll-gallery-pin]');
    const hero = document.querySelector('.hero.hero--home');
    if (!track || !pin) return;

    const panels = Array.from(track.querySelectorAll('[data-scroll-gallery-panel]'));
    const dots = Array.from(track.querySelectorAll('.scroll-gallery__dot'));

    const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
    const Q = 0.25;

    const resetDefaults = () => {
        pin.style.setProperty('--story-img-shift', '0');
        pin.style.setProperty('--story-txt0', '0');
        pin.style.setProperty('--story-bg', '0');
        pin.dataset.step = '0';
        pin.dataset.layout = 'shift';
        if (hero) hero.style.setProperty('--story-dim', '0');
        document.body.classList.remove('is-story-pinned');
        panels.forEach((panel, i) => {
            panel.classList.toggle('is-active', i === 0);
            panel.setAttribute('aria-hidden', i === 0 ? 'false' : 'true');
        });
        dots.forEach((d, i) => d.classList.toggle('is-on', i === 0));
    };

    const sync = () => {
        const rect = track.getBoundingClientRect();
        const viewH = window.innerHeight;
        const maxScroll = track.offsetHeight - viewH;

        if (maxScroll <= 0) {
            resetDefaults();
            return;
        }

        const scrolled = clamp(-rect.top, 0, maxScroll);
        const p = scrolled / maxScroll;

        if (hero) {
            const inOrPast = rect.top < viewH && rect.bottom > 0;
            if (inOrPast) hero.style.setProperty('--story-dim', String(Math.min(1, p * 1.15)));
            else if (rect.bottom < 0) hero.style.setProperty('--story-dim', '1');
            else hero.style.setProperty('--story-dim', '0');
        }

        pin.style.setProperty('--story-bg', String(Math.min(1, p * 1.6)));

        const pinned = rect.top <= 0.5 && rect.bottom >= viewH - 0.5;
        document.body.classList.toggle('is-story-pinned', pinned);

        let active = 0;
        let dotIdx = 0;

        if (p < Q) {
            const t = p / Q;
            const imgShift = clamp(t * 2, 0, 1);
            const txt0 = t > 0.5 ? clamp((t - 0.5) * 2, 0, 1) : 0;
            pin.style.setProperty('--story-img-shift', String(imgShift));
            pin.style.setProperty('--story-txt0', String(txt0));
            pin.dataset.step = '0';
            pin.dataset.layout = t < 0.5 ? 'shift' : 'reveal';
            active = 0;
            dotIdx = 0;
        } else if (p < 2 * Q) {
            pin.style.setProperty('--story-img-shift', '1');
            pin.style.setProperty('--story-txt0', '1');
            pin.dataset.step = '1';
            pin.dataset.layout = 'split';
            active = 1;
            dotIdx = 1;
        } else if (p < 3 * Q) {
            pin.style.setProperty('--story-img-shift', '1');
            pin.style.setProperty('--story-txt0', '1');
            pin.dataset.step = '2';
            pin.dataset.layout = 'split';
            active = 2;
            dotIdx = 2;
        } else {
            pin.style.setProperty('--story-img-shift', '1');
            pin.style.setProperty('--story-txt0', '1');
            pin.dataset.step = '3';
            pin.dataset.layout = 'split';
            active = 3;
            dotIdx = 3;
        }

        panels.forEach((panel, i) => {
            const on = i === active;
            panel.classList.toggle('is-active', on);
            panel.setAttribute('aria-hidden', on ? 'false' : 'true');
        });
        dots.forEach((d, i) => d.classList.toggle('is-on', i === dotIdx));
    };

    let ticking = false;
    const onScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            sync();
            ticking = false;
        });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', sync, { passive: true });
    sync();
})();
