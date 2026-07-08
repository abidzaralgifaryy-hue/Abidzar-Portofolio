// ==================================================
// 1. SYSTEM DARK & LIGHT MODE (OPTIMASI AUTOMATIC)
// ==================================================
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;
const bodyElement = document.body;

const setTheme = (theme) => {
    const logoImg = document.querySelector('.logo img');

    if (theme === 'dark') {
        bodyElement.classList.add('dark-mode');
        if (themeIcon) themeIcon.className = 'ph ph-sun';
        // OTOMATIS: Balikkan logo hitam jadi putih pas dark mode
        if (logoImg) logoImg.style.filter = 'invert(1) brightness(2)';
    } else {
        bodyElement.classList.remove('dark-mode');
        if (themeIcon) themeIcon.className = 'ph ph-moon';
        // OTOMATIS: Kembalikan logo ke warna hitam aslinya pas light mode
        if (logoImg) logoImg.style.filter = 'none';
    }

    try {
        localStorage.setItem('theme', theme);
    } catch (e) {
        console.log("Storage blocked, safe.");
    }
};

// Ambil data tema pas pertama kali dibuka
try {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark ? 'dark' : 'light');
    }
} catch (e) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
}

// Event klik ganti tema
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
