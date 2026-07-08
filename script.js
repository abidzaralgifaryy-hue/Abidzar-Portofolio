// ==================================================
// 1. DARK & LIGHT MODE SYSTEM
// ==================================================

const themeToggleBtn = document.getElementById('theme-toggle-btn');
const themeIcon = themeToggleBtn.querySelector('i');
const bodyElement = document.body;

// Fungsi untuk menerapkan tema
const setTheme = (theme) => {
    if (theme === 'dark') {
        bodyElement.classList.add('dark-mode');
        themeIcon.className = 'ph ph-sun';
        localStorage.setItem('theme', 'dark');
    } else {
        bodyElement.classList.remove('dark-mode');
        themeIcon.className = 'ph ph-moon';
        localStorage.setItem('theme', 'light');
    }
};

// Cek tema yang tersimpan
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    setTheme(savedTheme);
} else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    setTheme('dark');
}

// Event klik tombol tema
themeToggleBtn.addEventListener('click', () => {
    const isDark = bodyElement.classList.contains('dark-mode');
    setTheme(isDark ? 'light' : 'dark');
});


// ==================================================
// 2. SMOOTH SCROLL FOR "LIHAT KARYA" BUTTON
// ==================================================

const ctaPrimaryBtn = document.querySelector('.btn-primary[href="#projects"]');

if (ctaPrimaryBtn) {
    ctaPrimaryBtn.addEventListener('click', function(e) {
        e.preventDefault(); 
        
        const targetSection = document.getElementById('video-editing');
        
        if (targetSection) {
            const headerOffset = 100; 
            const elementPosition = targetSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
}
