// ==================================================
// 1. DARK & LIGHT MODE SYSTEM
// ==================================================

const themeToggleBtn = document.getElementById('theme-toggle-btn');
const themeIcon = themeToggleBtn.querySelector('i');
const bodyContainer = document.getElementById('body-container');

// Fungsi untuk menerapkan tema berdasarkan pilihan
const setTheme = (theme) => {
    if (theme === 'dark') {
        bodyContainer.classList.add('dark-mode');
        themeIcon.className = 'ph ph-sun'; // Mengubah ikon menjadi matahari saat mode gelap
        localStorage.setItem('theme', 'dark');
    } else {
        bodyContainer.classList.remove('dark-mode');
        themeIcon.className = 'ph ph-moon'; // Mengubah ikon menjadi bulan saat mode terang
        localStorage.setItem('theme', 'light');
    }
};

// Cek tema yang tersimpan di localStorage saat halaman dimuat
const savedTheme = localStorage.getItem('theme');

// Jika belum ada tema yang disimpan, sesuaikan dengan preferensi sistem perangkat user
if (savedTheme) {
    setTheme(savedTheme);
} else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    setTheme('dark');
}

// Event listener untuk tombol switch tema
themeToggleBtn.addEventListener('click', () => {
    const isDark = bodyContainer.classList.contains('dark-mode');
    setTheme(isDark ? 'light' : 'dark');
});


// ==================================================
// 2. SMOOTH SCROLL FOR "LIHAT KARYA" BUTTON
// ==================================================

const ctaPrimaryBtn = document.querySelector('.btn-primary[href="#projects"]');

if (ctaPrimaryBtn) {
    ctaPrimaryBtn.addEventListener('click', function(e) {
        e.preventDefault(); // Mencegah lompatan instan bawaan anchor tag
        
        // Karena section projects menggunakan ID video-editing, targetkan ke sana
        const targetSection = document.getElementById('video-editing');
        
        if (targetSection) {
            // Mengambil posisi offset header agar scrolling tidak tertutup navbar yang melayang
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
