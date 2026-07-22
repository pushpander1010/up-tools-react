// /scripts/utils.js
export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];
export const fmtNum = (n, o={}) => (new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2, ...o }).format(n ?? 0));
export const fmtCur = (n, c='INR') => (new Intl.NumberFormat('en-IN', { style:'currency', currency:c, maximumFractionDigits:0 }).format(n ?? 0));
export const debounce = (fn, d=150) => { let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a), d); }; };
export const serializeForm = (form) => Object.fromEntries(new FormData(form).entries());
export const setText = (el, v) => { if (el) el.textContent = v; };
export const persist = (k, v) => localStorage.setItem(k, JSON.stringify(v));
export const read = (k, d=null) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
export const clamp = (x, min, max) => Math.min(max, Math.max(min, x));
export const num = (v) => (v===''||v==null ? 0 : +v);

/**
 * Create and inject a breadcrumb navigation component
 * @param {Array} items - Array of {label, href} objects. Last item is current page (no link)
 * @param {string} insertSelector - CSS selector where to insert breadcrumb (default: 'main')
 * @example
 * createBreadcrumb([
 *   { label: 'Home', href: '/' },
 *   { label: 'Tools', href: '/tools/' },
 *   { label: 'BMI Calculator' }
 * ]);
 */
export function createBreadcrumb(items = [], insertSelector = 'main') {
  if (!items.length) return;
  
  const nav = document.createElement('nav');
  nav.className = 'breadcrumb';
  nav.setAttribute('aria-label', 'Breadcrumb');
  
  const ol = document.createElement('ol');
  ol.className = 'breadcrumb-list';
  
  items.forEach((item, idx) => {
    const li = document.createElement('li');
    li.className = 'breadcrumb-item';
    
    if (idx === items.length - 1) {
      // Current page (no link)
      li.setAttribute('aria-current', 'page');
      li.textContent = item.label;
    } else {
      // Link to previous page
      const a = document.createElement('a');
      a.href = item.href;
      a.textContent = item.label;
      li.appendChild(a);
    }
    
    ol.appendChild(li);
  });
  
  nav.appendChild(ol);
  
  // Insert at the top of main content
  const target = document.querySelector(insertSelector);
  if (target) {
    target.insertBefore(nav, target.firstChild);
  }
}

/**
 * Initialize mobile menu toggle
 * Adds click handler to .mobile-menu-toggle button to toggle .nav-links visibility
 */
export function initMobileMenu() {
  const toggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (!toggle || !navLinks) return;
  
  toggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    toggle.setAttribute('aria-expanded', navLinks.classList.contains('active'));
  });
  
  // Close menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  // --- More dropdown behavior ---
  const moreBtn = document.querySelector('.more-btn');
  const moreMenu = document.querySelector('.more-menu');
  if (!moreBtn || !moreMenu) return;

  moreBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = moreMenu.classList.toggle('open');
    moreBtn.setAttribute('aria-expanded', isOpen);
  });

  document.addEventListener('click', (e) => {
    if (!moreBtn.contains(e.target) && !moreMenu.contains(e.target)) {
      moreMenu.classList.remove('open');
      moreBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // Close more-menu when a menuitem is clicked
  moreMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      moreMenu.classList.remove('open');
      moreBtn.setAttribute('aria-expanded', 'false');
      // Also close hamburger menu if open
      navLinks.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}
