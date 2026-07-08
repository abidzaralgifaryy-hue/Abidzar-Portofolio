// ==================================================
// 1. SYSTEM DARK & LIGHT MODE
// ==================================================

const themeToggleBtn = document.getElementById('theme-toggle-btn');
const themeIcon = themeToggleBtn.querySelector('i');
const bodyElement = document.body;

// Fungsi untuk menerapkan tema (menambah/menghapus class .dark-mode)
const setTheme = (theme) => {
    if (theme === 'dark') {
        bodyElement.classList.add('dark-mode');
        themeIcon.className = 'ph ph-sun'; // Ikon matahari saat gelap
        localStorage.setItem('theme', 'dark');
    } else {
        bodyElement.classList.remove('dark-mode');
        themeIcon.className = 'ph ph-moon'; // Ikon bulan saat terang
        localStorage.setItem('theme', 'light');
    }
};

// Cek tema yang sebelumnya disimpan di localStorage
const setTheme = (theme) => {
    if (theme === 'dark') {
        bodyElement.classList.add('dark-mode');
        themeIcon.className = 'ph ph-sun';
        // Gunakan setTimeout kecil agar iOS tidak nge-freeze saat menulis memory
        setTimeout(() => localStorage.setItem('theme', 'dark'), 10);
    } else {
        bodyElement.classList.remove('dark-mode');
        themeIcon.className = 'ph ph-moon';
        setTimeout(() => localStorage.setItem('theme', 'light'), 10);
    }
};



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
