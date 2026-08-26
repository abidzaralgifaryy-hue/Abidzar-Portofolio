/* ==================================================================
   ADIZAREL — PORTFOLIO SCRIPT
   ================================================================== */

// 1. SMOOTH SCROLL FOR NAV LINKS
const navLinks = document.querySelectorAll('.nav-link[data-nav]');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (!targetSection) return;

        e.preventDefault();
        const headerOffset = 90;
        const elementPosition = targetSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    });
});

// 2. SCROLL-SPY — highlight the nav link for the section in view
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
