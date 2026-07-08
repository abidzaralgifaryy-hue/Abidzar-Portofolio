// ==================================================
// 1. DARK & LIGHT MODE SYSTEM (Updated)
// ==================================================

const themeToggleBtn = document.getElementById('theme-toggle-btn');
const themeIcon = themeToggleBtn.querySelector('i');

// Fungsi untuk menerapkan warna tema langsung ke variabel CSS
const applyTheme = (theme) => {
    const root = document.documentElement;
    
    if (theme === 'dark') {
        // Mengubah warna tema ke Dark Mode
        root.style.setProperty('--background', '#111111');
        root.style.setProperty('--dark', '#F8F8F8');
        root.style.setProperty('--white', '#1e1e1e');
        root.style.setProperty('--text-main', '#EEEEEE');
        root.style.setProperty('--text-muted', '#A0A0A0');
        root.style.setProperty('--glass-bg', 'rgba(30, 30, 30, 0.7)');
        root.style.setProperty('--glass-border', 'rgba(255, 255, 255, 0.1)');
        
        // Ubah ikon ke matahari
        themeIcon.className = 'ph ph-sun';
        localStorage.setItem('theme', 'dark');
    } else {
        // Kembalikan ke warna Light Mode asli dari CSS kamu
        root.style.setProperty('--background', '#F8F8F8');
        root.style.setProperty('--dark', '#111111');
        root.style.setProperty('--white', '#FFFFFF');
        root.style.setProperty('--text-main', '#333333');
        root.style.setProperty('--text-muted', '#666666');
        root.style.setProperty('--glass-bg', 'rgba(255, 255, 255, 0.7)');
        root.style.setProperty('--glass-border', 'rgba(255, 255, 255, 0.5)');
        
        // Ubah ikon ke bulan
        themeIcon.className = 'ph ph-moon';
        localStorage.setItem('theme', 'light');
    }
};

// Cek tema yang tersimpan di localStorage saat halaman dimuat
const savedTheme = localStorage.getItem('theme');

if (savedTheme) {
    applyTheme(savedTheme);
} else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    applyTheme('dark');
}

// Event listener untuk tombol ganti tema
themeToggleBtn.addEventListener('click', () => {
    const currentTheme = localStorage.getItem('theme') || 'light';
    applyTheme(currentTheme === 'light' ? 'dark' : 'light');
});


// ==================================================
// 2. SMOOTH SCROLL FOR "LIHAT KARYA" BUTTON
// ==================================================

const ctaPrimaryBtn = document.querySelector('.btn-primary[href="#projects"]');

if (ctaPrimaryBtn) {
    ctaPrimaryBtn.addEventListener('click', function(e) {
        e.preventDefault(); 
        
        // Mengarahkan ke section Video Editing sebagai portofolio utama
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
