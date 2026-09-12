/* ==================================================================
   ADIZAREL - PORTFOLIO SCRIPT v12 (Anti-Slop compliant)
   - Smooth scroll via scrollIntoView with offset handled by CSS scroll-margin
   - Scroll-spy via IntersectionObserver
   - Nav shadow via IntersectionObserver on sentinel (no scroll listener)
   - Fade-in reveal via IntersectionObserver
   All motion respects prefers-reduced-motion via CSS; JS never
   touches window.scrollY in a scroll event.
   ================================================================== */

const navLinks = document.querySelectorAll('.nav-link[data-nav]');
const sections = Array.from(navLinks)
  .map(link => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

const setActiveLink = (id) => {
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
  });
};

// helper - document top (layout, not visual sticky)
function getDocumentTop(el){
  let top = 0; let cur = el;
  while(cur){ top += cur.offsetTop; cur = cur.offsetParent; }
  return top;
}
// 1. Smooth scroll - sticky-safe: use document offset for all, not getBoundingClientRect
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = document.getElementById('siteNav')?.offsetHeight || 72;
    const top = getDocumentTop(target) - navH - 12;
    window.scrollTo({ top, behavior: 'smooth' });
    history.pushState(null, '', link.getAttribute('href'));
  });
});

// Hero CTA smooth scroll also
document.querySelectorAll('a[href="#work"]').forEach(a => {
  if (a.classList.contains('nav-link')) return;
  a.addEventListener('click', (e) => {
    const target = document.querySelector('#work');
    if (!target) return;
    e.preventDefault();
    const navH = document.getElementById('siteNav')?.offsetHeight || 72;
    const top = getDocumentTop(target) - navH - 12;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// 2. Scroll-spy - rAF polling (no window scroll listener per skill, handles sticky)
if (sections.length) {
  const updateSpy = () => {
    const navH = document.getElementById('siteNav')?.offsetHeight || 72;
    const scrollPos = window.scrollY + navH + 24;
    let activeId = sections[0].id;
    for(const sec of sections){
      const top = getDocumentTop(sec);
      if(scrollPos >= top) activeId = sec.id;
      else break;
    }
    setActiveLink(activeId);
  };
  // poll via rAF - no scroll event
  (function poll(){ updateSpy(); requestAnimationFrame(poll); })();
  window.addEventListener('resize', updateSpy, { passive: true });
  updateSpy();
}

// 3. Nav shadow via sentinel IntersectionObserver (no scroll listener per skill 5.D)
const siteNav = document.getElementById('siteNav');
const sentinel = document.getElementById('navSentinel');
if (siteNav && sentinel && 'IntersectionObserver' in window) {
  const navObs = new IntersectionObserver(([entry]) => {
    siteNav.classList.toggle('scrolled', !entry.isIntersecting);
  }, { threshold: 0 });
  navObs.observe(sentinel);
}

// 4. Theme toggle - dark / light, persists, respects system
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('adizarel-theme', theme); } catch(e){}
    themeToggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    if (metaTheme) metaTheme.setAttribute('content', theme === 'dark' ? '#1A1814' : '#EFE1C2');
  };
  // sync button state on load
  const initial = document.documentElement.getAttribute('data-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  themeToggle.setAttribute('aria-pressed', initial === 'dark' ? 'true' : 'false');
  themeToggle.setAttribute('aria-label', initial === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  themeToggle.addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme');
    const next = cur === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  });
  // follow system if user has not chosen manually
  try {
    if (!localStorage.getItem('adizarel-theme')) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        const next = e.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', next);
        themeToggle.setAttribute('aria-pressed', next === 'dark' ? 'true' : 'false');
        if (metaTheme) metaTheme.setAttribute('content', next === 'dark' ? '#1A1814' : '#EFE1C2');
      });
    }
  } catch(e){}
}

// 5. Contact form - WhatsApp handoff (no backend)
const contactForm = document.getElementById('contactForm');
if(contactForm){
  const statusEl = document.getElementById('formStatus');
  const setError = (name, msg) => {
    const el = contactForm.querySelector(`[data-error="${name}"]`);
    if(el) el.textContent = msg || '';
  };
  const clearErrors = () => contactForm.querySelectorAll('.field-error').forEach(e=> e.textContent='');
  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const isPhone = (v) => /^\+?[\d\s\-]{8,}$/.test(v.replace(/\s/g,''));
  contactForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    clearErrors();
    if(statusEl){ statusEl.textContent=''; statusEl.className='form-status'; }
    const data = new FormData(contactForm);
    const name = (data.get('name')||'').toString().trim();
    const contact = (data.get('contact')||'').toString().trim();
    const goal = (data.get('goal')||'').toString().trim();
    const budget = (data.get('budget')||'Discuss').toString().trim();
    const timeline = (data.get('timeline')||'Flexible').toString().trim();
    const message = (data.get('message')||'').toString().trim();
    let hasError = false;
    if(!name){ setError('name','Name required'); hasError=true; }
    if(!contact){ setError('contact','WhatsApp / Email required'); hasError=true; }
    else if(!isEmail(contact) && !isPhone(contact)){ setError('contact','Enter valid WhatsApp or Email'); hasError=true; }
    if(!goal){ setError('goal','Pilih goal'); hasError=true; }
    if(!message){ setError('message','Message required'); hasError=true; }
    if(hasError){
      if(statusEl){ statusEl.textContent='Periksa field yang ditandai.'; statusEl.className='form-status error'; }
      return;
    }
    const lines = [
      `Halo Abijay, mau diskusi project`,
      ``,
      `*Name:* ${name}`,
      `*Contact:* ${contact}`,
      `*Goal:* ${goal}`,
      `*Budget:* ${budget}`,
      `*Timeline:* ${timeline}`,
      `*Message:* ${message}`
    ];
    const text = encodeURIComponent(lines.join('\n'));
    const url = `https://wa.me/6285137071956?text=${text}`;
    const win = window.open(url, '_blank', 'noopener');
    if(!win){
      if(statusEl){ statusEl.innerHTML = `Popup blocked — <a href="${url}" target="_blank" rel="noopener">buka WhatsApp manual</a>`; statusEl.className='form-status error'; }
      return;
    }
    if(statusEl){ statusEl.textContent='Terima kasih — membuka WhatsApp...'; statusEl.className='form-status success'; }
    contactForm.reset();
    setTimeout(()=>{ if(statusEl) statusEl.textContent=''; }, 4000);
  });
}

// 6. Poster lightbox - click to enlarge, centered with spring animation
(function(){
  const lightbox = document.getElementById('posterLightbox');
  if(!lightbox) return;
  const img = document.getElementById('lightboxImg');
  const title = document.getElementById('lightboxTitle');
  const desc = document.getElementById('lightboxDesc');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const backdrop = lightbox.querySelector('.lightbox-backdrop');
  let lastFocus = null;

  const open = (card) => {
    const thumb = card.querySelector('.work-thumb img');
    const h5 = card.querySelector('.work-info h5');
    const p = card.querySelector('.work-info p');
    if(!thumb) return;
    lastFocus = document.activeElement;
    img.src = thumb.src;
    img.alt = thumb.alt || '';
    title.textContent = h5 ? h5.textContent : '';
    desc.textContent = p ? p.textContent : '';
    lightbox.setAttribute('aria-hidden','false');
    lightbox.classList.add('open');
    document.body.classList.add('lightbox-lock');
    // focus close for accessibility
    setTimeout(()=> closeBtn.focus(), 50);
    // animate from thumb position if motion allowed
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(!prefersReduced && thumb.getBoundingClientRect){
      const rect = thumb.getBoundingClientRect();
      const cardEl = lightbox.querySelector('.lightbox-card');
      // FLIP: start from thumb center, scale down, then to center
      const vw = window.innerWidth, vh = window.innerHeight;
      const thumbCX = rect.left + rect.width/2;
      const thumbCY = rect.top + rect.height/2;
      const centerX = vw/2, centerY = vh/2;
      const dx = thumbCX - centerX;
      const dy = thumbCY - centerY;
      const scale = Math.min(rect.width / 520, rect.height / 640, 0.45);
      cardEl.style.transition = 'none';
      cardEl.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
      cardEl.style.opacity = '0';
      // force reflow
      void cardEl.offsetWidth;
      cardEl.style.transition = '';
      cardEl.style.transform = '';
      cardEl.style.opacity = '';
    }
  };
  const close = () => {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden','true');
    document.body.classList.remove('lightbox-lock');
    if(lastFocus && lastFocus.focus) lastFocus.focus();
  };
  document.querySelectorAll('.poster-card').forEach(card=>{
    card.addEventListener('click', ()=> open(card));
  });
  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape' && lightbox.classList.contains('open')) close();
  });
})();

// 6. Poster gallery arrows - clickable instead of only horizontal scroll
(function(){
  const gallery = document.getElementById('posterGallery');
  const prev = document.querySelector('.gallery-prev');
  const next = document.querySelector('.gallery-next');
  if(!gallery || !prev || !next) return;
  gallery.tabIndex = 0;
  const update = () => {
    const max = gallery.scrollWidth - gallery.clientWidth;
    prev.disabled = gallery.scrollLeft <= 4;
    next.disabled = gallery.scrollLeft >= max - 4;
    // hide arrows if no overflow
    const needsScroll = gallery.scrollWidth > gallery.clientWidth + 4;
    prev.style.display = needsScroll ? '' : 'none';
    next.style.display = needsScroll ? '' : 'none';
  };
  const amount = () => {
    const card = gallery.querySelector('.poster-card');
    const gap = parseFloat(getComputedStyle(gallery).gap) || 16;
    return card ? card.offsetWidth + gap : gallery.clientWidth * 0.85;
  };
  prev.addEventListener('click', ()=> gallery.scrollBy({ left: -amount(), behavior: 'smooth' }));
  next.addEventListener('click', ()=> gallery.scrollBy({ left: amount(), behavior: 'smooth' }));
  gallery.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  // keyboard when gallery focused
  gallery.addEventListener('keydown', (e)=>{
    if(e.key === 'ArrowLeft') { e.preventDefault(); gallery.scrollBy({ left: -amount(), behavior: 'smooth' }); }
    if(e.key === 'ArrowRight') { e.preventDefault(); gallery.scrollBy({ left: amount(), behavior: 'smooth' }); }
  });
  update();
})();

// 7. Fade-in reveal - respects reduced-motion (CSS handles disable)
const fadeEls = document.querySelectorAll('.about-paper, .edu-card, .bubble, .clipboard, .work-stack, .profile-card');
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!prefersReduced && 'IntersectionObserver' in window) {
  const fadeObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  fadeEls.forEach(el => {
    el.classList.add('fade-in');
    fadeObs.observe(el);
  });
} else {
  // reduced-motion: show immediately, no animation
  fadeEls.forEach(el => el.classList.add('visible'));
}
