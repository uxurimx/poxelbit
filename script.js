'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initLang();
  initNav();
  initParallax();
  initCanvas();
  initReveal();
  initForm();
  if (typeof lucide !== 'undefined') lucide.createIcons();
});


/* ============================================
   THEME — dark / light toggle
   ============================================ */
function initTheme() {
  const btns = document.querySelectorAll('.theme-btn');
  if (!btns.length) return;

  function applyTheme(theme) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem('pbTheme', theme);
    const iconName = theme === 'dark' ? 'sun' : 'moon';
    btns.forEach(btn => {
      btn.innerHTML = `<i data-lucide="${iconName}" style="width:14px;height:14px;"></i>`;
    });
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  const saved = localStorage.getItem('pbTheme') || 'dark';
  applyTheme(saved);

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const current = localStorage.getItem('pbTheme') || 'dark';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  });
}


/* ============================================
   LANGUAGE — ES / EN toggle
   ============================================ */
function initLang() {
  const btns = document.querySelectorAll('.lang-btn');
  if (!btns.length) return;

  function updateBtns(lang) {
    btns.forEach(btn => { btn.textContent = lang === 'es' ? 'EN' : 'ES'; });
  }

  const saved = localStorage.getItem('pbLang') || 'es';
  if (typeof applyLang === 'function') applyLang(saved);
  updateBtns(saved);

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const current = localStorage.getItem('pbLang') || 'es';
      const next = current === 'es' ? 'en' : 'es';
      if (typeof applyLang === 'function') applyLang(next);
      updateBtns(next);
    });
  });
}


/* ============================================
   NAVIGATION
   ============================================ */
function initNav() {
  const nav       = document.querySelector('nav');
  const hamburger = document.querySelector('.hamburger');
  const mobile    = document.querySelector('.nav-mobile');

  window.addEventListener('scroll', () => {
    nav?.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });

  hamburger?.addEventListener('click', () => {
    mobile?.classList.toggle('open');
  });

  mobile?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => mobile.classList.remove('open'));
  });
}


/* ============================================
   PARALLAX — hero orbs & grid
   ============================================ */
function initParallax() {
  const orb1 = document.querySelector('.hero-orb-1');
  const orb2 = document.querySelector('.hero-orb-2');
  const grid = document.querySelector('.hero-grid');
  if (!orb1 && !orb2) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (orb1) orb1.style.transform = `translate3d(0,${y * 0.28}px,0)`;
        if (orb2) orb2.style.transform = `translate3d(0,${y * 0.45}px,0)`;
        if (grid) grid.style.transform = `translate3d(0,${y * 0.12}px,0)`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}


/* ============================================
   CANVAS — AI node network
   ============================================ */
function initCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx   = canvas.getContext('2d');
  let nodes   = [];
  let w, h;
  const mouse = { x: -9999, y: -9999 };
  const MAX_D = 140;
  const count = () => Math.min(Math.floor((w * h) / 14000), 80);

  function resize() {
    w = canvas.width  = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
    nodes = Array.from({ length: count() }, () => ({
      x:  Math.random() * w,
      y:  Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r:  Math.random() * 1.5 + 0.8,
    }));
  }

  function frame() {
    ctx.clearRect(0, 0, w, h);
    const isLight  = document.documentElement.getAttribute('data-theme') === 'light';
    const nodeFill = isLight ? 'rgba(29,78,216,0.5)'   : 'rgba(96,165,250,0.5)';
    const edgeRGB  = isLight ? '29,78,216'              : '96,165,250';

    for (const n of nodes) {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;

      const dx = n.x - mouse.x, dy = n.y - mouse.y;
      const md = Math.hypot(dx, dy);
      if (md < 90 && md > 0) { n.x += (dx / md) * 0.6; n.y += (dy / md) * 0.6; }

      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = nodeFill;
      ctx.fill();
    }

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const d  = Math.hypot(dx, dy);
        if (d < MAX_D) {
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(${edgeRGB},${(1 - d / MAX_D) * 0.2})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(frame);
  }

  canvas.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  });
  canvas.addEventListener('mouseleave', () => { mouse.x = mouse.y = -9999; });
  window.addEventListener('resize', resize);
  resize();
  frame();
}


/* ============================================
   SCROLL REVEAL
   ============================================ */
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .sol-item').forEach(el => obs.observe(el));
}


/* ============================================
   CONTACT FORM
   ============================================ */
function initForm() {
  document.querySelectorAll('.contact-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn  = form.querySelector('[type="submit"]');
      const orig = btn.innerHTML;
      const lang = localStorage.getItem('pbLang') || 'es';
      btn.innerHTML = lang === 'en' ? 'Message sent!' : '¡Mensaje enviado!';
      btn.disabled  = true;
      btn.style.opacity = '0.7';
      setTimeout(() => {
        btn.innerHTML     = orig;
        btn.disabled      = false;
        btn.style.opacity = '';
        form.reset();
        if (typeof lucide !== 'undefined') lucide.createIcons();
      }, 3000);
    });
  });
}
