/* ==================================================================
   ADIZAREL - PORTFOLIO SCRIPT v13 (Anti-Slop compliant)
   - Buttery inertia scroll via Lenis (CDN, guarded) w/ native fallback
   - Scroll-spy via rAF polling (sticky-safe, no scroll listener)
   - Nav shadow via IntersectionObserver on sentinel (no scroll listener)
   - Fade-in reveal via IntersectionObserver
   All motion respects prefers-reduced-motion (Lenis skipped); JS never
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

// Smooth-scroll engine (Lenis) - inertia feel, native fallback, reduced-motion respect
let lenis = null;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!prefersReducedMotion && typeof Lenis !== 'undefined') {
  try {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true });
  } catch(e){ lenis = null; }
}
// single entry point for all in-page jumps (Lenis or native)
const smoothTo = (target) => {
  const navH = document.getElementById('siteNav')?.offsetHeight || 72;
  if (lenis) lenis.scrollTo(target, { offset: -(navH + 12), duration: 1.4 });
  else {
    const top = getDocumentTop(target) - navH - 12;
    window.scrollTo({ top, behavior: 'smooth' });
  }
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
    smoothTo(target);
    history.pushState(null, '', link.getAttribute('href'));
  });
});

// 1b. Hamburger menu (mobile ≤640px) - dropdown under top bar
const menuBtn = document.getElementById('navMenuBtn');
const navMenu = document.getElementById('mobileMenu');
if (menuBtn && navMenu) {
  const setMenu = (open) => {
    navMenu.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  menuBtn.addEventListener('click', () => {
    setMenu(!navMenu.classList.contains('open'));
  });
  navLinks.forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setMenu(false);
  });
  document.addEventListener('click', (e) => {
    if (!navMenu.classList.contains('open')) return;
    if (navMenu.contains(e.target) || menuBtn.contains(e.target)) return;
    setMenu(false);
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 640) setMenu(false);
  });
}

// Hero CTA + logo smooth scroll also
document.querySelectorAll('a[href="#work"]').forEach(a => {
  if (a.classList.contains('nav-link')) return;
  a.addEventListener('click', (e) => {
    const target = document.querySelector('#work');
    if (!target) return;
    e.preventDefault();
    smoothTo(target);
  });
});
document.querySelectorAll('a[href="#hero"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector('#hero');
    if (!target) return;
    e.preventDefault();
    smoothTo(target);
    history.pushState(null, '', '#hero');
  });
});

// 2. Scroll-spy - rAF polling (no window scroll listener per skill, handles sticky)
// No hardcoded active: clear when above first section (hero has no nav link)
if (sections.length) {
  const updateSpy = () => {
    const navH = document.getElementById('siteNav')?.offsetHeight || 72;
    const scrollPos = window.scrollY + navH + 24;
    const firstTop = getDocumentTop(sections[0]);
    if (scrollPos < firstTop) {
      navLinks.forEach(link => link.classList.remove('active'));
      return;
    }
    let activeId = sections[0].id;
    for(const sec of sections){
      const top = getDocumentTop(sec);
      if(scrollPos >= top) activeId = sec.id;
      else break;
    }
    setActiveLink(activeId);
  };
  // poll via rAF - no scroll event (also drives Lenis)
  const loop = (time) => { if (lenis) lenis.raf(time); updateSpy(); requestAnimationFrame(loop); };
  window.addEventListener('resize', updateSpy, { passive: true });
  updateSpy();
  requestAnimationFrame(loop);
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
  contactForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    clearErrors();
    if(statusEl){ statusEl.textContent=''; statusEl.className='form-status'; }
    const data = new FormData(contactForm);
    const name = (data.get('name')||'').toString().trim();
    const goal = (data.get('goal')||'').toString().trim();
    const budget = (data.get('budget')||'Discuss').toString().trim();
    const timeline = (data.get('timeline')||'Flexible').toString().trim();
    const message = (data.get('message')||'').toString().trim();
    let hasError = false;
    if(!name){ setError('name','Name required'); hasError=true; }
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
    if (lenis) lenis.stop();
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
    if (lenis) lenis.start();
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

// 8. Hero motion background - parallax blobs + cursor/touch glow + dynamic dark/light gradient
//    Bekerja untuk mouse, pen, dan touch screen. Menghormati prefers-reduced-motion.
(function(){
  const hero = document.getElementById('hero');
  if (!hero || prefersReducedMotion) return;
  const glow = hero.querySelector('.hero-glow');

  let tx = 0, ty = 0, cx = 0, cy = 0;
  let gx = 0, gy = 0, px = 0, py = 0;
  let mx = 50, my = 50, tmx = 50, tmy = 50;
  let running = false;
  let touchFadeTimer = null;

  const clearTouchFade = () => {
    if (touchFadeTimer) { clearTimeout(touchFadeTimer); touchFadeTimer = null; }
  };
  const scheduleTouchFade = () => {
    clearTouchFade();
    touchFadeTimer = setTimeout(() => {
      hero.classList.remove('has-glow');
      hero.classList.remove('has-pointer');
      tx = 0; ty = 0;
      tmx = 50; tmy = 50;
      kick();
    }, 3500);
  };

  const tick = () => {
    cx += (tx - cx) * 0.075;
    cy += (ty - cy) * 0.075;
    hero.style.setProperty('--pmx', cx.toFixed(4));
    hero.style.setProperty('--pmy', cy.toFixed(4));

    mx += (tmx - mx) * 0.12;
    my += (tmy - my) * 0.12;
    hero.style.setProperty('--mx', mx.toFixed(2) + '%');
    hero.style.setProperty('--my', my.toFixed(2) + '%');

    if (glow) {
      px += (gx - px) * 0.12;
      py += (gy - py) * 0.12;
      const h = glow.offsetWidth / 2;
      glow.style.transform = `translate3d(${(px - h).toFixed(1)}px, ${(py - h).toFixed(1)}px, 0)`;
    }

    const settled =
      Math.abs(tx - cx) < 0.0005 && Math.abs(ty - cy) < 0.0005 &&
      Math.abs(tmx - mx) < 0.05 && Math.abs(tmy - my) < 0.05 &&
      Math.abs(gx - px) < 0.5 && Math.abs(gy - py) < 0.5;
    if (!settled) requestAnimationFrame(tick);
    else running = false;
  };
  const kick = () => { if (!running) { running = true; requestAnimationFrame(tick); } };

  const handleMove = (clientX, clientY) => {
    const r = hero.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const relX = clientX - r.left;
    const relY = clientY - r.top;
    tx = (relX / r.width - 0.5) * 2;
    ty = (relY / r.height - 0.5) * 2;
    gx = relX; gy = relY;
    tmx = (relX / r.width) * 100;
    tmy = (relY / r.height) * 100;
    if (!hero.classList.contains('has-glow')) {
      hero.classList.add('has-glow');
      hero.classList.add('has-pointer');
      px = gx; py = gy;
      mx = tmx; my = tmy;
    }
    clearTouchFade();
    kick();
  };

  const handleLeave = (e) => {
    if (e && e.pointerType === 'touch') {
      // di touch: tahan posisi terakhir, baru fade setelah 3.5s idle
      scheduleTouchFade();
      tx = 0; ty = 0;
      kick();
      return;
    }
    hero.classList.remove('has-glow');
    hero.classList.remove('has-pointer');
    tx = 0; ty = 0;
    tmx = 50; tmy = 50;
    kick();
  };

  // Pointer Events - mencakup mouse, pen, dan touch di browser modern
  hero.addEventListener('pointermove', (e) => handleMove(e.clientX, e.clientY), { passive: true });
  hero.addEventListener('pointerdown', (e) => handleMove(e.clientX, e.clientY), { passive: true });
  hero.addEventListener('pointerleave', handleLeave);

  // Fallback untuk browser lawas tanpa PointerEvent
  if (!window.PointerEvent) {
    const touchMove = (e) => {
      const t = e.touches[0]; if (!t) return;
      handleMove(t.clientX, t.clientY);
    };
    hero.addEventListener('touchstart', touchMove, { passive: true });
    hero.addEventListener('touchmove', touchMove, { passive: true });
    hero.addEventListener('touchend', () => scheduleTouchFade(), { passive: true });
    hero.addEventListener('touchcancel', () => scheduleTouchFade(), { passive: true });
  }
})();
