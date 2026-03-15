'use strict';

/* ============================================
   PoxelBit Web Components
   Single source of truth for nav & footer.
   Usage:
     Root pages:    <pb-nav base=""></pb-nav>
     Yumm page:     <pb-nav base="" page="yumm" scrolled></pb-nav>
     Service pages: <pb-nav base="../" scrolled></pb-nav>
   ============================================ */

class PbNav extends HTMLElement {
  connectedCallback() {
    const b        = this.getAttribute('base') || '';
    const scrolled = this.hasAttribute('scrolled') ? ' class="scrolled"' : '';
    this.insertAdjacentHTML('afterend', `
<nav${scrolled}>
  <div class="nav-inner">
    <a href="${b}index.html" class="nav-logo">
      <img src="${b}assets/logow.png" class="nav-logo-w" alt="PoxelBit">
      <img src="${b}assets/logob.png" class="nav-logo-b" alt="PoxelBit">
    </a>
    <ul class="nav-links">
      <li><a href="${b}index.html#servicios" data-i18n="nav.services">Soluciones</a></li>
      <li><a href="${b}index.html#nosotros" data-i18n="nav.about">Nosotros</a></li>
      <li><a href="${b}index.html#contacto" class="cta" data-i18n="nav.cta">Platiquemos</a></li>
    </ul>
    <div class="nav-controls">
      <button class="ctrl-btn lang-btn" aria-label="Cambiar idioma">ES</button>
      <button class="ctrl-btn theme-btn" aria-label="Cambiar tema">
        <i data-lucide="sun" style="width:14px;height:14px;"></i>
      </button>
    </div>
    <button class="hamburger" aria-label="Menú"><span></span><span></span><span></span></button>
  </div>
</nav>
<div class="nav-mobile">
  <a href="${b}index.html#servicios" data-i18n="nav.services">Soluciones</a>
  <a href="${b}index.html#nosotros" data-i18n="nav.about">Nosotros</a>
  <a href="${b}index.html#contacto" data-i18n="nav.cta">Platiquemos</a>
  <div class="nav-mobile-ctrls">
    <button class="ctrl-btn lang-btn" aria-label="Cambiar idioma">ES</button>
    <button class="ctrl-btn theme-btn" aria-label="Cambiar tema">
      <i data-lucide="sun" style="width:14px;height:14px;"></i>
    </button>
  </div>
</div>`);
    this.remove();
  }
}

class PbFooter extends HTMLElement {
  connectedCallback() {
    const b = this.getAttribute('base') || '';

    this.insertAdjacentHTML('afterend', `
<footer>
  <div class="footer-inner">
    <div>
      <div class="foot-brand">
        <img src="${b}assets/logow.png" class="nav-logo-w" alt="PoxelBit" style="height:28px;width:auto;">
        <img src="${b}assets/logob.png" class="nav-logo-b" alt="PoxelBit" style="height:28px;width:auto;">
      </div>
      <div class="foot-copy" data-i18n="footer.copy">México · Soluciones Digitales con IA © 2026</div>
    </div>
    <ul class="foot-links">
      <li><a href="${b}index.html#servicios" data-i18n="nav.services">Soluciones</a></li>
      <li><a href="https://yumm.lat" target="_blank" rel="noopener">YUMM</a></li>
      <li><a href="${b}index.html#nosotros" data-i18n="nav.about">Nosotros</a></li>
      <li><a href="${b}index.html#contacto" data-i18n="index.contact.label">Contacto</a></li>
    </ul>
  </div>
</footer>`);
    this.remove();
  }
}

customElements.define('pb-nav', PbNav);
customElements.define('pb-footer', PbFooter);
