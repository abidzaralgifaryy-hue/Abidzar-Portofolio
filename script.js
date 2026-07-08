// ==================================================
// 1. SYSTEM DARK & LIGHT MODE (OPTIMASI IPAD)
// ==================================================

const themeToggleBtn = document.getElementById('theme-toggle-btn');
const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;
const bodyElement = document.body;

const setTheme = (theme) => {
    // Jalankan pergantian class di dalam requestAnimationFrame
    // Ini trik paksa Safari iOS biar langsung ngerender tanpa antre memori
    requestAnimationFrame(() => {
        if (theme === 'dark') {
            bodyElement.classList.add('dark-mode');
            if (themeIcon) themeIcon.className = 'ph ph-sun';
        } else {
            bodyElement.classList.add('dark-mode'); // Memastikan trik repaint mendeteksi perubahan
            bodyElement.classList.remove('dark-mode');
            if (themeIcon) themeIcon.className = 'ph ph-moon';
        }

        // === TRIK COBA FORCE REPAINT KHUSUS iOS DI SINI ===
        if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
            const scrollElement = document.documentElement || document.body;
            
            // 1. Naik turunkan opacity untuk memicu render visual ulang
            bodyElement.style.opacity = '0.99';
            
            // 2. Geser scroll 1 piksel secara gaib lalu kembalikan
            scrollElement.scrollTop += 1;
            
            requestAnimationFrame(() => {
                bodyElement.style.opacity = '1';
                scrollElement.scrollTop -= 1;
            });
        }
    });

    // Tulis ke localStorage belakangan biar gak nahan render layar iPad
    setTimeout(() => {
        try {
            localStorage.setItem('theme', theme);
        } catch (e) {
            console.error(e);
        }
    }, 50);
};


// Ambil data tema terakhir pas web pertama kali dibuka
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    setTheme(savedTheme);
} else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
}

// Event listener klik tombol ganti tema (Pake tombol asli lo)
if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        const isDark = bodyElement.classList.contains('dark-mode');
        setTheme(isDark ? 'light' : 'dark');
    });
}



// ==================================================
// 2. SMOOTH SCROLL TOMBOL "LIHAT KARYA"
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
