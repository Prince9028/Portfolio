/* ==================================================================
   Mantra Joshi - Portfolio
   Vanilla JS: footer year, navbar state + active link, scroll reveal,
   hamburger drawer, WhatsApp form submit.
   ================================================================== */

const WHATSAPP_NUMBER = '9601019028';

const prefersReducedMotion =
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;


/* ================================================================
   0. FOOTER YEAR
   ================================================================ */
(function setFooterYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
})();


/* ================================================================
   1. NAVBAR - scrolled state + active-section link highlight
   ================================================================ */
(function navbarBehavior() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.rail-tab');
  const sections = ['hero', 'about', 'experience', 'play', 'contact']
    .map(id => document.getElementById(id))
    .filter(Boolean);

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  if ('IntersectionObserver' in window && sections.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          navLinks.forEach(link => {
            const target = link.getAttribute('href').replace('#', '');
            link.classList.toggle('active', target === id);
          });
        });
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: 0 }
    );
    sections.forEach(s => observer.observe(s));
  }
})();


/* ================================================================
   2. REVEAL ON SCROLL
   ================================================================ */
(function revealOnScroll() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  // has-js is set in the head only when IO + motion are OK. Without it,
  // sections are already visible via CSS, so there is nothing to reveal.
  if (!document.documentElement.classList.contains('has-js')) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  els.forEach(el => observer.observe(el));
})();


/* ================================================================
   3. MOBILE HAMBURGER DRAWER
   ================================================================ */
(function hamburgerDrawer() {
  const btn = document.getElementById('hamburger');
  const drawer = document.getElementById('mobileDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  const drawerLinks = document.querySelectorAll('.drawer-link');
  if (!btn || !drawer || !backdrop) return;

  const setOpen = (open) => {
    btn.classList.toggle('open', open);
    drawer.classList.toggle('open', open);
    backdrop.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    drawer.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
  };

  btn.addEventListener('click', () => {
    setOpen(!drawer.classList.contains('open'));
  });
  backdrop.addEventListener('click', () => setOpen(false));
  drawerLinks.forEach(link => link.addEventListener('click', () => setOpen(false)));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) setOpen(false);
  });
})();


/* ================================================================
   4. CONTACT FORM  ->  WhatsApp deep link  (Name + Message)
   ================================================================ */
(function contactFormToWhatsApp() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const nameEl = form.querySelector('#name');
  const messageEl = form.querySelector('#message');
  const note = document.getElementById('formNote');

  const clearError = (el) => el.classList.remove('error');
  [nameEl, messageEl].forEach(el =>
    el.addEventListener('input', () => clearError(el))
  );

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = nameEl.value.trim();
    const message = messageEl.value.trim();

    let firstInvalid = null;
    [[nameEl, name], [messageEl, message]].forEach(([el, val]) => {
      if (!val) {
        el.classList.add('error');
        if (!firstInvalid) firstInvalid = el;
      }
    });

    if (firstInvalid) {
      note.textContent = 'Please fill in both fields before sending.';
      note.className = 'form-note error';
      firstInvalid.focus();
      return;
    }

    const text =
      `Hello Prince! \n\n` +
      `Name: ${name}\n\n` +
      `Message:\n${message}`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    const win = window.open(url, '_blank', 'noopener,noreferrer');
    if (!win) window.location.href = url;

    note.textContent = 'Opening WhatsApp... you can edit and send the message there.';
    note.className = 'form-note success';
    form.reset();
  });
})();


/* ================================================================
   5. DOODLE CANVAS  -  the fun, engaging tool
   ================================================================ */
(function doodleCanvas() {
  const canvas = document.getElementById('doodleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const swatches = document.querySelectorAll('.swatch');
  const brush = document.getElementById('brushSize');
  const eraseBtn = document.getElementById('doodleErase');
  const clearBtn = document.getElementById('doodleClear');
  const saveBtn = document.getElementById('doodleSave');
  const BG = '#fbf7ee';

  let color = '#1c1b18';
  let size = parseInt(brush && brush.value, 10) || 9;
  let erasing = false;
  let drawing = false;
  let last = null;

  // Size the canvas to its box (crisp on high-DPI), preserving any drawing.
  function fit() {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width) return;
    const dpr = window.devicePixelRatio || 1;
    const prev = document.createElement('canvas');
    prev.width = canvas.width; prev.height = canvas.height;
    if (canvas.width) prev.getContext('2d').drawImage(canvas, 0, 0);

    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, rect.width, rect.height);
    if (prev.width && prev.height) {
      ctx.drawImage(prev, 0, 0, prev.width, prev.height, 0, 0, rect.width, rect.height);
    }
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }
  fit();
  let rt;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(fit, 150); });

  const pos = (e) => {
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  const start = (e) => { drawing = true; last = pos(e); stroke(e); };
  function stroke(e) {
    if (!drawing) return;
    e.preventDefault();
    const p = pos(e);
    ctx.strokeStyle = erasing ? BG : color;
    ctx.lineWidth = erasing ? size * 2 : size;
    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last = p;
  }
  const end = () => { drawing = false; last = null; };

  canvas.addEventListener('pointerdown', start);
  canvas.addEventListener('pointermove', stroke);
  window.addEventListener('pointerup', end);
  canvas.addEventListener('pointerleave', end);

  swatches.forEach(sw => {
    sw.addEventListener('click', () => {
      color = sw.getAttribute('data-color');
      erasing = false;
      if (eraseBtn) eraseBtn.classList.remove('is-active');
      swatches.forEach(s => s.classList.remove('is-active'));
      sw.classList.add('is-active');
    });
  });
  if (brush) brush.addEventListener('input', () => { size = parseInt(brush.value, 10) || 9; });
  if (eraseBtn) eraseBtn.addEventListener('click', () => {
    erasing = !erasing;
    eraseBtn.classList.toggle('is-active', erasing);
  });
  if (clearBtn) clearBtn.addEventListener('click', () => {
    const r = canvas.getBoundingClientRect();
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, r.width, r.height);
  });
  if (saveBtn) saveBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'my-doodle.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  });
})();


/* ================================================================
   6. HORIZONTAL PIN  -  scroll down moves the Work section sideways
   ------------------------------------------------------------------
   The section is made tall; an inner sticky viewport stays fixed
   while the track is translated horizontally in proportion to how
   far you have scrolled through the section. Disabled on small
   screens and for reduced motion (CSS provides those fallbacks).
   ================================================================ */
(function horizontalPin() {
  const section = document.getElementById('experience');
  const track = document.getElementById('hpinTrack');
  if (!section || !track) return;

  const wide = window.matchMedia('(min-width: 761px)');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  let travel = 0;
  let ticking = false;

  function active() { return wide.matches && !reduce.matches; }

  function layout() {
    if (!active()) {
      section.style.height = '';
      track.style.transform = '';
      return;
    }
    const sticky = track.parentElement;
    travel = Math.max(0, track.scrollWidth - sticky.clientWidth);
    // 1:1 mapping: vertical scroll distance equals horizontal travel.
    section.style.height = (window.innerHeight + travel) + 'px';
    update();
  }

  function update() {
    if (!active()) return;
    const total = section.offsetHeight - window.innerHeight;
    let p = total > 0 ? (-section.getBoundingClientRect().top) / total : 0;
    p = Math.max(0, Math.min(1, p));
    track.style.transform = 'translate3d(' + (-p * travel).toFixed(2) + 'px,0,0)';
  }

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { update(); ticking = false; });
  }, { passive: true });

  let rt;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(layout, 150); });
  window.addEventListener('load', layout);
  if (typeof wide.addEventListener === 'function') {
    wide.addEventListener('change', layout);
    reduce.addEventListener('change', layout);
  }
  layout();
})();
