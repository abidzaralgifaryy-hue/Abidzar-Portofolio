/* ==================================================================
   ADIZAREL — PORTFOLIO SCRIPT (v4)
   Smooth scroll + scroll-spy + nav shadow + fade-in reveal + slider
   ================================================================== */

// 1. SMOOTH SCROLL FOR NAV LINKS
const navLinks = document.querySelectorAll('.nav-link[data-nav]');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (!targetSection) return;

        e.preventDefault();
        const headerOffset = 70;
        const elementPosition = targetSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    });
});

// 2. SCROLL-SPY — highlight nav link for section in view
const sections = Array.from(navLinks)
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

const setActiveLink = (id) => {
    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
    });
};

if ('IntersectionObserver' in window && sections.length) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setActiveLink(entry.target.id);
            }
        });
    }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

    sections.forEach(section => observer.observe(section));
}

// 3. NAV SHADOW ON SCROLL
const siteNav = document.getElementById('siteNav');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        siteNav.classList.add('scrolled');
    } else {
        siteNav.classList.remove('scrolled');
    }
});

// 4. FADE-IN ON SCROLL (subtle reveal)
const fadeElements = document.querySelectorAll('.about-paper, .id-card, .sticky-notes, .software-panel, .work-stack');
if ('IntersectionObserver' in window) {
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    fadeElements.forEach(el => {
        el.classList.add('fade-in');
        fadeObserver.observe(el);
    });
}

// 5. POSTER SLIDER NAVIGATION
const slider = document.getElementById('posterSlider');
const prevBtn = document.getElementById('posterPrev');
const nextBtn = document.getElementById('posterNext');

if (slider && prevBtn && nextBtn) {
    const cardWidth = slider.querySelector('.poster-card').offsetWidth + 20; // + gap
    prevBtn.addEventListener('click', () => {
        slider.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    });
    nextBtn.addEventListener('click', () => {
        slider.scrollBy({ left: cardWidth, behavior: 'smooth' });
    });
}
