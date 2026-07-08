// ==================================================
// 1. SYSTEM DARK & LIGHT MODE
// ==================================================

const themeToggleBtn = document.getElementById('theme-toggle-btn');
const themeIcon = themeToggleBtn.querySelector('i');
const bodyElement = document.body;

// Fungsi untuk menerapkan tema (Menghindari delay freeze di iOS)
const setTheme = (theme) => {
    if (theme === 'dark') {
        bodyElement.classList.add('dark-mode');
        themeIcon.className = 'ph ph-sun'; // Ikon matahari saat gelap
        setTimeout(() => localStorage.setItem('theme', 'dark'), 10);
    } else {
        bodyElement.classList.remove('dark-mode');
        themeIcon.className = 'ph ph-moon'; // Ikon bulan saat terang
        setTimeout(() => localStorage.setItem('theme', 'light'), 10);
    }
};

// Ambil data tema terakhir pas web pertama kali dibuka
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    setTheme(savedTheme);
} else {
    // Jika belum pernah disetel, ikuti mode default bawaan HP/iPad user
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
}

// Event listener klik tombol ganti tema
themeToggleBtn.addEventListener('click', () => {
    const isDark = bodyElement.classList.contains('dark-mode');
    setTheme(isDark ? 'light' : 'dark');
});



// ==================================================
// 2. SMOOTH SCROLL TOMBOL "LIHAT KARYA"
// ==================================================

const ctaPrimaryBtn = document.querySelector('.btn-primary[href="#projects"]');

if (ctaPrimaryBtn) {
    ctaPrimaryBtn.addEventListener('click', function(e) {
        e.preventDefault(); // Mencegah lompatan instan bawaan browser
        
        // Target langsung diarahkan ke section Video Editing sebagai karya utama
        const targetSection = document.getElementById('video-editing');
        
        if (targetSection) {
            const headerOffset = 100; // Jarak aman agar tidak tertutup header navbar
            const elementPosition = targetSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth' // Efek scroll mengalir halus
            });
        }
    });
}
