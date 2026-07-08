// ==================================================
// 1. SYSTEM DARK & LIGHT MODE (OPTIMASI IPAD)
// ==================================================

const themeToggleBtn = document.getElementById('theme-toggle-btn');
const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;
const bodyElement = document.body;

const setTheme = (theme) => {
    // 1. Eksekusi perubahan tema utama
    if (theme === 'dark') {
        bodyElement.classList.add('dark-mode');
        if (themeIcon) themeIcon.className = 'ph ph-sun';
    } else {
        bodyElement.classList.remove('dark-mode');
        if (themeIcon) themeIcon.className = 'ph ph-moon';
    }

    // 2. AMBLESIN LANGSUNG: Paksa iOS Safari repaint total elemen HTML
    if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
        // Trik A: Ubah property CSS root secara acak agar browser mendeteksi perubahan data visual
        document.documentElement.style.setProperty('--ios-force-repaint', Math.random());
        
        // Trik B: Paksa reflow dengan menyenggol offsetHeight body
        const fixLag = bodyElement.offsetHeight;
        
        // Trik C: Trik scroll gaib 1 piksel di dalam frame berikutnya
        requestAnimationFrame(() => {
            const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
            window.scrollTo(0, currentScroll + 1);
            
            setTimeout(() => {
                window.scrollTo(0, currentScroll);
            }, 10);
        });
    }

    // Tulis ke localStorage belakangan biar gak nahan render layar iPad
    setTimeout(() => {
        try {
            localStorage.setItem('theme', theme);
        } catch (e) {
            console.error(e);
        }
    }, 50);
};

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
