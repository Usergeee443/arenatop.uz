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
