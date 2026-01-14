// ===================================
// ARENA TOP - Main JavaScript
// ===================================

'use strict';

// ===================================
// Preloader
// ===================================

window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.classList.add('hidden');
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }, 1500);
});

// ===================================
// Navigation
// ===================================

const navbar = document.getElementById('navbar');
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const navLinkItems = document.querySelectorAll('.nav-link, .btn-download');

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinkItems.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
    }
});

// ===================================
// Smooth Scroll
// ===================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===================================
// Stats Counter Animation
// ===================================

const animateCounter = (element, target, duration = 2000) => {
    let start = 0;
    const increment = target / (duration / 16);
    const isLarge = target >= 10000;

    const updateCounter = () => {
        start += increment;
        if (start < target) {
            if (isLarge) {
                const thousands = Math.floor(start / 1000);
                element.textContent = thousands + 'K+';
            } else {
                element.textContent = Math.floor(start) + '+';
            }
            requestAnimationFrame(updateCounter);
        } else {
            if (isLarge) {
                const thousands = Math.floor(target / 1000);
                element.textContent = thousands + 'K+';
            } else {
                element.textContent = target + '+';
            }
        }
    };

    updateCounter();
};

// ===================================
// Intersection Observer for Animations
// ===================================

const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
};

// Observer for scroll animations
const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = entry.target.getAttribute('data-delay') || 0;
            setTimeout(() => {
                entry.target.classList.add('aos-animate');
            }, delay);
            scrollObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all animated elements
document.querySelectorAll('.feature-card, .biznes-card, .contact-card').forEach(el => {
    scrollObserver.observe(el);
});

// Observer for stats counter
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach((stat, index) => {
                const target = parseInt(stat.getAttribute('data-target'));
                setTimeout(() => {
                    animateCounter(stat, target, 2000);
                }, index * 200);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

// ===================================
// Parallax Effect
// ===================================

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroPattern = document.querySelector('.hero-pattern');

    if (heroPattern && scrolled < window.innerHeight) {
        heroPattern.style.transform = `translateX(${-50 + scrolled * 0.1}%) rotate(-10deg)`;
    }
});

// ===================================
// Button Hover Effects
// ===================================

const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .store-btn');
buttons.forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
    });

    btn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// ===================================
// Feature Cards Hover Effect
// ===================================

const featureCards = document.querySelectorAll('.feature-card');
featureCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        const number = this.querySelector('.feature-number');
        if (number) {
            number.style.transform = 'scale(1.1) rotate(-5deg)';
        }
    });

    card.addEventListener('mouseleave', function() {
        const number = this.querySelector('.feature-number');
        if (number) {
            number.style.transform = 'scale(1) rotate(0)';
        }
    });
});

// ===================================
// Active Navigation Link
// ===================================

const sections = document.querySelectorAll('section[id]');

const setActiveNavLink = () => {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            if (navLink) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.style.color = '';
                });
                navLink.style.color = 'var(--green-yellow)';
            }
        }
    });
};

window.addEventListener('scroll', setActiveNavLink);

// ===================================
// Scroll Indicator
// ===================================

const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 200) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.visibility = 'hidden';
        } else {
            scrollIndicator.style.opacity = '1';
            scrollIndicator.style.visibility = 'visible';
        }
    });
}

// ===================================
// Cursor Custom Effect (Optional)
// ===================================

const createCursorEffect = () => {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        width: 20px;
        height: 20px;
        border: 2px solid var(--green-yellow);
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.2s ease;
        display: none;
    `;
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        cursor.style.display = 'block';
    });

    // Enlarge cursor on hoverable elements
    const hoverElements = document.querySelectorAll('a, button, .feature-card, .biznes-card, .contact-card');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(2)';
            cursor.style.borderColor = 'var(--green-yellow)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
        });
    });
};

// Uncomment to enable custom cursor (only on desktop)
// if (window.innerWidth > 768) {
//     createCursorEffect();
// }

// ===================================
// Performance Optimization
// ===================================

// Debounce function for scroll events
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Throttle function for scroll events
const throttle = (func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// ===================================
// Console Message
// ===================================

console.log(
    '%c ARENA TOP ',
    'background: #B1FC40; color: #0B2E34; font-size: 24px; font-weight: bold; padding: 10px 20px; border-radius: 5px;'
);

console.log(
    '%c Sport maydonlarini bron qilish uchun №1 ilova O\'zbekistonda ',
    'color: #2A8B9C; font-size: 14px; padding: 5px;'
);

console.log(
    '%c Developed with ❤️ ',
    'color: #B1FC40; font-size: 12px; padding: 5px;'
);

// ===================================
// Easter Egg - Konami Code
// ===================================

let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑ ↑ ↓ ↓ ← → ← → B A

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.keyCode);
    konamiCode = konamiCode.slice(-10);

    if (konamiCode.join(',') === konamiSequence.join(',')) {
        document.body.style.animation = 'rainbow 2s infinite';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 5000);

        console.log('%c 🎉 SECRET UNLOCKED! 🎉 ', 'background: #B1FC40; color: #0B2E34; font-size: 20px; font-weight: bold; padding: 10px;');
    }
});

// Rainbow animation for easter egg
const style = document.createElement('style');
style.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(style);

// ===================================
// Initialize
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('Arena Top website loaded successfully!');

    // Set initial nav state
    setActiveNavLink();

    // Add transition class to body after page load
    document.body.style.transition = 'filter 0.3s ease';
});

// ===================================
// Service Worker Registration (Optional)
// ===================================

// if ('serviceWorker' in navigator) {
//     window.addEventListener('load', () => {
//         navigator.serviceWorker.register('/sw.js')
//             .then(registration => {
//                 console.log('SW registered:', registration);
//             })
//             .catch(error => {
//                 console.log('SW registration failed:', error);
//             });
//     });
// }
