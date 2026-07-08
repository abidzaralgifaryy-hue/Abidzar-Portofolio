// ==================================================
// 1. SYSTEM DARK & LIGHT MODE (OPTIMASI IPAD & INCOGNITO)
// ==================================================

const themeToggleBtn = document.getElementById('theme-toggle-btn');
const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;
const bodyElement = document.body;

const setTheme = (theme) => {
    const logoImg = document.querySelector('.logo img'); // Cari element gambar logo
    
    if (theme === 'dark') {
        bodyElement.classList.add('dark-mode');
        if (themeIcon) themeIcon.className = 'ph ph-sun';
        
        // JIKA GELAP: Gunakan logo yang terang (light) agar kontras kelihatan
        if (logoImg) logoImg.src = 'assets/logo-light.png'; 
    } else {
        bodyElement.classList.remove('dark-mode');
        if (themeIcon) themeIcon.className = 'ph ph-moon';
        
        // JIKA TERANG: Gunakan logo yang gelap (dark) agar kontras kelihatan
        if (logoImg) logoImg.src = 'assets/logo-dark.png'; 
    }
    
    // ... sisa kode simpan localStorage kamu ...
};


// Ambil data tema terakhir pas web pertama kali dibuka
try {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark ? 'dark' : 'light');
    }
} catch (e) {
    // Pengaman jika localStorage diblokir saat pertama kali load di Incognito
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
}

// Event listener klik tombol ganti tema
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


// ==================================================
// 3. FITUR READ MORE DESKRIPSI (KHUSUS MOBILE)
// ==================================================
const readMoreBtn = document.getElementById('read-more-btn');
const textDescription = document.querySelector('.text-description');

if (readMoreBtn && textDescription) {
    readMoreBtn.addEventListener('click', () => {
        textDescription.classList.toggle('expanded');
        
        if (textDescription.classList.contains('expanded')) {
            readMoreBtn.textContent = 'Sembunyikan';
        } else {
            readMoreBtn.textContent = 'Lihat Selengkapnya';
        }
    });
}
