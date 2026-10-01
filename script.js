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

// 8. Hero motion background - works with mouse, touch & pen (all devices)
//    - canvas of drifting dots / stars / rings that react to the pointer
//    - amber glow + parallax blobs follow the pointer (CSS vars --pmx / --pmy)
//    - idle drift keeps it alive on phones even when nobody is touching
//    - pauses when the hero is off-screen or the tab is hidden; static if reduced-motion
(function(){
  const hero = document.getElementById('hero');
  const canvas = document.getElementById('heroCanvas');
  if (!hero) return;
  const glow = hero.querySelector('.hero-glow');
  const shade = hero.querySelector('.hero-shade');
  let hx = 0, hy = 0;                     // shade position (lags behind glow)
  const ctx = canvas && canvas.getContext ? canvas.getContext('2d') : null;
  const reduced = prefersReducedMotion;

  // ---------- palette (follows light/dark theme) ----------
  const PALETTES = {
    light: ['#CC7A21', '#6B8A4A', '#E3A15F', '#9CAF88', '#A85E18'],
    dark:  ['#CC7A21', '#8FB06A', '#E0A060', '#9CAF88', '#D9944A']
  };
  let colors = PALETTES.light, lineRGB = '168,94,24';
  const readTheme = () => {
    const dark = document.documentElement.getAttribute('data-theme') === 'dark'
      || (!document.documentElement.hasAttribute('data-theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    colors = dark ? PALETTES.dark : PALETTES.light;
    lineRGB = dark ? '224,160,96' : '168,94,24';
    if (reduced) drawStatic();
  };
  new MutationObserver(readTheme).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  // ---------- pointer state (shared by canvas, glow & parallax) ----------
  const ptr = { x: 0, y: 0, sx: 0, sy: 0, vx: 0, vy: 0, on: false, power: 0 };
  let tx = 0, ty = 0, cx = 0, cy = 0;     // parallax target / current (-1..1)
  let gx = 0, gy = 0, px = 0, py = 0;     // glow target / current (px)
  let holdTimer = 0;

  const setPointer = (clientX, clientY) => {
    const r = hero.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const x = clientX - r.left, y = clientY - r.top;
    if (!ptr.on) { ptr.sx = x; ptr.sy = y; px = x; py = y; hx = x; hy = y; }
    ptr.vx = x - ptr.x; ptr.vy = y - ptr.y;
    ptr.x = x; ptr.y = y; ptr.on = true;
    tx = (x / r.width - 0.5) * 2; ty = (y / r.height - 0.5) * 2;
    gx = x; gy = y;
    hero.classList.add('has-glow');
    clearTimeout(holdTimer);
    kick();
  };
  const releasePointer = (delay) => {
    clearTimeout(holdTimer);
    holdTimer = setTimeout(() => {
      ptr.on = false; tx = 0; ty = 0;
      hero.classList.remove('has-glow');
      kick();
    }, delay || 0);
  };

  // mouse + pen via Pointer Events (touch handled separately so scrolling is never blocked)
  window.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch') return;
    setPointer(e.clientX, e.clientY);
  }, { passive: true });
  document.documentElement.addEventListener('mouseleave', () => releasePointer(0));
  window.addEventListener('blur', () => releasePointer(0));

  // touch: passive listeners, follows the finger while scrolling or dragging
  const onTouch = (e) => { const t = e.touches[0]; if (t) setPointer(t.clientX, t.clientY); };
  window.addEventListener('touchstart', (e) => { onTouch(e); burst(); }, { passive: true });
  window.addEventListener('touchmove', onTouch, { passive: true });
  window.addEventListener('touchend', () => releasePointer(700), { passive: true });
  window.addEventListener('touchcancel', () => releasePointer(300), { passive: true });

  // click / tap ripple (only when it lands inside the hero)
  let burstT = 0;
  const burst = () => { burstT = 1; };
  window.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'touch') { setPointer(e.clientX, e.clientY); burst(); }
  }, { passive: true });

  // ---------- particles ----------
  let W = 0, H = 0, dpr = 1, parts = [], inView = true, running = false, last = 0, time = 0;
  const rnd = (a, b) => a + Math.random() * (b - a);

  const makeParticle = (w, h) => {
    const kind = Math.random();
    return {
      hx: rnd(0, w), hy: rnd(0, h),               // home position
      ox: 0, oy: 0, vx: 0, vy: 0,                 // displacement from home + velocity
      r: rnd(2.2, 6.5),
      type: kind < .55 ? 0 : kind < .8 ? 1 : 2,   // 0 dot, 1 star, 2 ring
      col: colors[(Math.random() * colors.length) | 0],
      a: rnd(.28, .7),
      amp: rnd(8, 26), spd: rnd(.12, .32), ph: rnd(0, 6.283),
      rot: rnd(0, 6.283), vr: rnd(-.5, .5),
      depth: rnd(.5, 1.5)                         // parallax depth
    };
  };

  const targetCount = () => {
    const area = W * H;
    let n = Math.round(area / 15000);
    const lowEnd = (navigator.hardwareConcurrency || 8) <= 4 || W < 640;
    if (lowEnd) n = Math.round(n * .65);
    return Math.max(18, Math.min(n, 90));
  };

  const resize = () => {
    const r = hero.getBoundingClientRect();
    const nw = Math.max(1, Math.round(r.width)), nh = Math.max(1, Math.round(r.height));
    if (!canvas || !ctx) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const sx = W ? nw / W : 1, sy = H ? nh / H : 1;
    W = nw; H = nh;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!parts.length) {
      const n = targetCount();
      for (let i = 0; i < n; i++) parts.push(makeParticle(W, H));
    } else {
      parts.forEach(p => { p.hx *= sx; p.hy *= sy; });   // keep layout stable on resize
      const n = targetCount();
      while (parts.length < n) parts.push(makeParticle(W, H));
      if (parts.length > n) parts.length = n;
    }
    if (reduced || !running) drawFrame(0);
  };

  const starPath = (r) => {
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = (i * Math.PI) / 5 - Math.PI / 2, rr = i % 2 ? r * .45 : r;
      const x = Math.cos(a) * rr, y = Math.sin(a) * rr;
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.closePath();
  };

  function drawFrame(dt) {
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);
    const R = Math.max(110, Math.min(190, W * .22));   // pointer influence radius
    const R2 = R * R;
    const power = ptr.power;
    const wind = Math.min(1, Math.hypot(ptr.vx, ptr.vy) / 40);

    // soft lines from pointer to nearby particles
    if (power > .02) {
      ctx.lineWidth = 1;
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        const x = p.hx + p.ox, y = p.hy + p.oy;
        const dx = x - ptr.sx, dy = y - ptr.sy, d2 = dx * dx + dy * dy;
        const L = R * 1.15;
        if (d2 < L * L) {
          const k = (1 - Math.sqrt(d2) / L) * .35 * power;
          ctx.strokeStyle = `rgba(${lineRGB},${k.toFixed(3)})`;
          ctx.beginPath(); ctx.moveTo(ptr.sx, ptr.sy); ctx.lineTo(x, y); ctx.stroke();
        }
      }
    }

    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      // idle drift (always on, gentle)
      const dx0 = Math.sin(time * p.spd + p.ph) * p.amp;
      const dy0 = Math.cos(time * p.spd * .8 + p.ph * 1.3) * p.amp;
      let x = p.hx + dx0 + p.ox, y = p.hy + dy0 + p.oy;

      if (dt) {
        // pointer: repel + wind
        const dx = x - ptr.sx, dy = y - ptr.sy, d2 = dx * dx + dy * dy;
        if (power > .02 && d2 < R2 && d2 > .01) {
          const d = Math.sqrt(d2), f = (1 - d / R) * power;
          p.vx += (dx / d) * f * 90 * dt * 6 + ptr.vx * f * wind * .06;
          p.vy += (dy / d) * f * 90 * dt * 6 + ptr.vy * f * wind * .06;
        }
        // tap / click ripple
        if (burstT > 0 && ptr.on) {
          const d = Math.sqrt(d2) || 1;
          if (d < R * 1.8) { const f = (1 - d / (R * 1.8)) * burstT; p.vx += (dx / d) * f * 14; p.vy += (dy / d) * f * 14; }
        }
        // spring back home, with damping
        p.vx += -p.ox * 2.2 * dt; p.vy += -p.oy * 2.2 * dt;
        const damp = Math.pow(.04, dt);
        p.vx *= damp; p.vy *= damp;
        p.ox += p.vx * dt * 60 * .5; p.oy += p.vy * dt * 60 * .5;
        p.rot += p.vr * dt;
        x = p.hx + dx0 + p.ox; y = p.hy + dy0 + p.oy;
      }

      // parallax shift from pointer position
      x += cx * -14 * p.depth; y += cy * -14 * p.depth;

      // grow a little when close to the pointer
      const near = power > .02 ? Math.max(0, 1 - Math.hypot(x - ptr.sx, y - ptr.sy) / R) * power : 0;
      const r = p.r * (1 + near * .9);

      ctx.globalAlpha = Math.min(1, p.a + near * .3);
      ctx.fillStyle = ctx.strokeStyle = p.col;
      if (p.type === 0) {
        ctx.beginPath(); ctx.arc(x, y, r * .8, 0, 6.283); ctx.fill();
      } else if (p.type === 1) {
        ctx.save(); ctx.translate(x, y); ctx.rotate(p.rot); starPath(r * 1.7); ctx.fill(); ctx.restore();
      } else {
        ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(x, y, r * 1.2, 0, 6.283); ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
  }
  const drawStatic = () => { if (ctx && W) drawFrame(0); };

  // ---------- main loop ----------
  const tick = (now) => {
    if (!running) return;
    const dt = Math.min(.05, (now - (last || now)) / 1000);
    last = now; time += dt;

    // ease parallax + glow + pointer
    cx += (tx - cx) * .075; cy += (ty - cy) * .075;
    hero.style.setProperty('--pmx', cx.toFixed(4));
    hero.style.setProperty('--pmy', cy.toFixed(4));
    px += (gx - px) * .12; py += (gy - py) * .12;
    if (glow) {
      const h = glow.offsetWidth / 2;
      glow.style.transform = `translate3d(${(px - h).toFixed(1)}px, ${(py - h).toFixed(1)}px, 0)`;
    }
    if (shade) {
      hx += (gx - hx) * .07; hy += (gy - hy) * .07;
      const h2 = shade.offsetWidth / 2;
      shade.style.transform = `translate3d(${(hx - h2).toFixed(1)}px, ${(hy - h2).toFixed(1)}px, 0)`;
    }
    ptr.sx += (ptr.x - ptr.sx) * .22; ptr.sy += (ptr.y - ptr.sy) * .22;
    ptr.power += ((ptr.on ? 1 : 0) - ptr.power) * Math.min(1, dt * 6);
    ptr.vx *= .85; ptr.vy *= .85;
    if (burstT > 0) burstT = Math.max(0, burstT - dt * 4);

    drawFrame(dt);
    requestAnimationFrame(tick);
  };
  function kick() {
    if (running || reduced || !inView || document.hidden) return;
    running = true; last = 0; requestAnimationFrame(tick);
  }
  const stop = () => { running = false; };

  // ---------- lifecycle ----------
  readTheme();
  resize();
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(hero);
  else window.addEventListener('resize', resize, { passive: true });

  if (reduced) {                       // static, no animation, no pointer tracking cost
    drawStatic();
    return;
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([en]) => {
      inView = en.isIntersecting;
      inView ? kick() : stop();
    }, { threshold: 0 }).observe(hero);
  }
  document.addEventListener('visibilitychange', () => { document.hidden ? stop() : kick(); });
  kick();
})();
