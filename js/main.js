/* ============================================================
   AQUAVISTA — Main JavaScript
   Core functionality: Navbar, Dark Mode, RTL, Back-to-Top,
   Page Transitions, Bubbles, Ripple
   ============================================================ */

'use strict';

// ============================================================
// UTILITIES
// ============================================================
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const storage = {
  get: (key, fallback = null) => {
    try { const v = localStorage.getItem(key); return v !== null ? JSON.parse(v) : fallback; }
    catch { return fallback; }
  },
  set: (key, val) => {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
  }
};

// ============================================================
// THEME (DARK / LIGHT MODE)
// ============================================================
class ThemeManager {
  constructor() {
    this.btn = $('#theme-toggle');
    this.theme = storage.get('theme', 'light');
    this.init();
  }

  init() {
    this.apply(this.theme);
    this.btn?.addEventListener('click', () => this.toggle());
  }

  apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    this.theme = theme;
    storage.set('theme', theme);
    const icon = this.btn?.querySelector('.theme-icon i');
    if (icon) {
      icon.classList.toggle('fa-moon', theme === 'dark');
      icon.classList.toggle('fa-sun', theme !== 'dark');
    }
    this.btn?.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }

  toggle() {
    this.apply(this.theme === 'dark' ? 'light' : 'dark');
  }
}

// ============================================================
// RTL MANAGER
// ============================================================
class RTLManager {
  constructor() {
    this.btn = $('#rtl-toggle');
    this.dir = storage.get('dir', 'ltr');
    this.init();
  }

  init() {
    this.apply(this.dir);
    this.btn?.addEventListener('click', () => this.toggle());
  }

  apply(dir) {
    document.documentElement.setAttribute('dir', dir);
    this.dir = dir;
    storage.set('dir', dir);
    const icon = this.btn?.querySelector('.rtl-icon');
    if (icon) icon.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
    this.btn?.setAttribute('aria-label', dir === 'rtl' ? 'Switch to LTR' : 'Switch to RTL');
  }

  toggle() {
    this.apply(this.dir === 'rtl' ? 'ltr' : 'rtl');
  }
}

// ============================================================
// NAVBAR
// ============================================================
class Navbar {
  constructor() {
    this.nav = $('.navbar');
    this.toggle = $('.nav-toggle');
    this.mobileMenu = $('.mobile-menu');
    this.scrolled = false;
    this.menuOpen = false;
    this.lastScrollY = 0;
    this.init();
  }

  init() {
    if (!this.nav) return;
    window.addEventListener('scroll', () => this.onScroll(), { passive: true });
    this.onScroll();
    this.toggle?.addEventListener('click', () => this.toggleMenu());
    document.addEventListener('click', (e) => this.closeOnOutside(e));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeMenu();
    });

    // Active link
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    $$('.nav-link').forEach(link => {
      const href = link.getAttribute('href') || '';
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  onScroll() {
    const y = window.scrollY;
    if (y > 20) {
      if (!this.scrolled) {
        this.nav.classList.add('scrolled');
        this.scrolled = true;
      }
    } else {
      if (this.scrolled) {
        this.nav.classList.remove('scrolled');
        this.scrolled = false;
      }
    }
    this.lastScrollY = y;
  }

  toggleMenu() {
    this.menuOpen ? this.closeMenu() : this.openMenu();
  }

  openMenu() {
    this.menuOpen = true;
    this.toggle?.classList.add('open');
    this.mobileMenu?.classList.add('open');
    document.body.style.overflow = 'hidden';
    this.toggle?.setAttribute('aria-expanded', 'true');
  }

  closeMenu() {
    this.menuOpen = false;
    this.toggle?.classList.remove('open');
    this.mobileMenu?.classList.remove('open');
    document.body.style.overflow = '';
    this.toggle?.setAttribute('aria-expanded', 'false');
  }

  closeOnOutside(e) {
    if (this.menuOpen && !this.nav.contains(e.target) && !this.mobileMenu?.contains(e.target)) {
      this.closeMenu();
    }
  }
}

// ============================================================
// BACK TO TOP
// ============================================================
class BackToTop {
  constructor() {
    this.btn = $('#back-to-top');
    this.init();
  }

  init() {
    if (!this.btn) return;
    window.addEventListener('scroll', () => this.onScroll(), { passive: true });
    this.btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  onScroll() {
    if (window.scrollY > 400) {
      this.btn.classList.add('visible');
    } else {
      this.btn.classList.remove('visible');
    }
  }
}

// ============================================================
// PAGE TRANSITION
// ============================================================
class PageTransition {
  constructor() {
    this.overlay = $('#page-transition');
    this.init();
  }

  init() {
    // Fade in on load and clean up class so body has zero styling artifacts
    document.body.classList.add('page-enter');
    setTimeout(() => {
      document.body.classList.remove('page-enter');
    }, 400);

    // Reset overlay on load and on bfcache restore (back/forward navigation)
    // so the full-screen transition overlay never gets stuck visible.
    this.reset();
    window.addEventListener('pageshow', () => this.reset());
    // Also strip .active right before the page is hidden/cached (e.g. when we
    // navigate away), so a bfcache restore never shows a stuck overlay.
    window.addEventListener('pagehide', () => this.reset());
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') this.reset();
    });

    // Intercept internal links
    document.addEventListener('click', (e) => {
      const anchor = e.target.closest('a[href]');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('http') || anchor.target === '_blank') return;

      // Automatically sync blog post ID to storage for bulletproof dynamic rendering
      if (href.includes('blog-details.html')) {
        const match = href.match(/[?&]id=([^&#]+)/);
        if (match && match[1]) {
          try {
            sessionStorage.setItem('aquavista_selected_blog', decodeURIComponent(match[1]));
            localStorage.setItem('aquavista_selected_blog', decodeURIComponent(match[1]));
          } catch (err) {}
        }
      }

      e.preventDefault();
      this.transition(href);
    });
  }

  transition(href) {
    this.overlay.classList.add('active');
    setTimeout(() => {
      window.location.href = href;
    }, 300);
  }

  reset() {
    if (this.overlay) this.overlay.classList.remove('active');
  }
}

// ============================================================
// ANIMATED BUBBLES
// ============================================================
class BubbleEffect {
  constructor(container) {
    this.container = typeof container === 'string' ? $(container) : container;
    this.init();
  }

  init() {
    if (!this.container) return;
    const count = parseInt(this.container.dataset.bubbles || '15');
    for (let i = 0; i < count; i++) {
      this.createBubble(i);
    }
  }

  createBubble(index) {
    const b = document.createElement('div');
    const size = Math.random() * 60 + 10;
    const left = Math.random() * 100;
    const delay = Math.random() * 10;
    const duration = Math.random() * 8 + 6;
    const opacity = Math.random() * 0.4 + 0.1;

    b.className = 'b';
    Object.assign(b.style, {
      width: `${size}px`,
      height: `${size}px`,
      left: `${left}%`,
      bottom: `-${size}px`,
      animationDuration: `${duration}s`,
      animationDelay: `${delay}s`,
      opacity: opacity
    });

    this.container.appendChild(b);
  }
}

// ============================================================
// RIPPLE EFFECT
// ============================================================
function addRipple(btn) {
  btn.addEventListener('click', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const size = Math.max(rect.width, rect.height) * 2;

    const ripple = document.createElement('span');
    ripple.className = 'ripple-effect';
    Object.assign(ripple.style, {
      width: `${size}px`,
      height: `${size}px`,
      left: `${x - size/2}px`,
      top: `${y - size/2}px`
    });

    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  });
}

// ============================================================
// TOAST NOTIFICATION
// ============================================================
function showToast(message, type = 'success') {
  let container = $('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = { success: '✅', error: '❌', info: 'ℹ', warning: '<i class="fa-solid fa-triangle-exclamation"></i>' };
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>${icons[type] || icons.info}</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'toast-in 0.3s ease reverse forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ============================================================
// COUNTER ANIMATION
// ============================================================
class CounterAnimation {
  constructor() {
    this.counters = $$('[data-count]');
    this.observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) this.animate(e.target); }),
      { threshold: 0.5 }
    );
    this.counters.forEach(c => this.observer.observe(c));
  }

  animate(el) {
    const target = parseInt(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const start = performance.now();
    const isDecimal = el.dataset.decimal === 'true';

    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      el.innerHTML = (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
    this.observer.unobserve(el);
  }
}

// ============================================================
// LIGHT RAYS DECORATION
// ============================================================
function createLightRays(container) {
  if (!container) return;
  const rays = 6;
  for (let i = 0; i < rays; i++) {
    const ray = document.createElement('div');
    ray.className = 'light-ray';
    Object.assign(ray.style, {
      left: `${(i / rays) * 100 + 5}%`,
      top: '0',
      height: `${Math.random() * 40 + 30}%`,
      animationDelay: `${i * 0.8}s`,
      opacity: Math.random() * 0.3 + 0.1
    });
    container.appendChild(ray);
  }
}

// ============================================================
// TILT CARD EFFECT
// ============================================================
class TiltEffect {
  constructor() {
    $$('.tilt-card').forEach(card => {
      card.addEventListener('mousemove', (e) => this.onMove(e, card));
      card.addEventListener('mouseleave', () => this.onLeave(card));
    });
  }

  onMove(e, card) {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(1000px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateZ(10px)`;
  }

  onLeave(card) {
    card.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) translateZ(0)';
  }
}

// ============================================================
// WISHLIST
// ============================================================
class Wishlist {
  constructor() {
    this.items = storage.get('wishlist', []);
    this.init();
  }

  init() {
    $$('[data-wishlist]').forEach(btn => {
      const id = btn.dataset.wishlist;
      if (this.items.includes(id)) btn.classList.add('active');
      btn.addEventListener('click', () => this.toggle(btn, id));
    });
  }

  toggle(btn, id) {
    if (this.items.includes(id)) {
      this.items = this.items.filter(i => i !== id);
      btn.classList.remove('active');
      showToast('Removed from wishlist', 'info');
    } else {
      this.items.push(id);
      btn.classList.add('active');
      showToast('Added to wishlist! <i class="fa-solid fa-fish-fins"></i>', 'success');
    }
    storage.set('wishlist', this.items);
  }
}

// ============================================================
// TOAST NOTIFICATIONS
// ============================================================
function showToast(message, type = 'info', duration = 3500) {
  // Remove existing toast
  document.querySelectorAll('.toast').forEach(t => t.remove());

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  document.body.appendChild(toast);

  // Force reflow then show
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, duration);
}

// ============================================================
// SEARCH
// ============================================================
class SearchToggle {
  constructor() {
    this.btn = $('#search-toggle');
    this.modal = $('#search-modal');
    this.input = this.modal?.querySelector('input');
    this.closeBtn = this.modal?.querySelector('.search-close');
    this.init();
  }

  init() {
    this.btn?.addEventListener('click', () => this.open());
    this.closeBtn?.addEventListener('click', () => this.close());
    this.modal?.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal?.classList.contains('open')) this.close();
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); this.open(); }
    });
  }

  open() {
    this.modal?.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => this.input?.focus(), 100);
  }

  close() {
    this.modal?.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// ============================================================
// READING PROGRESS BAR
// ============================================================
class ReadingProgress {
  constructor() {
    this.bar = document.getElementById('reading-progress');
    if (!this.bar) return;
    window.addEventListener('scroll', () => this.update(), { passive: true });
  }
  update() {
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docH > 0 ? (window.scrollY / docH) * 100 : 0;
    this.bar.style.width = Math.min(pct, 100) + '%';
    this.bar.setAttribute('aria-valuenow', Math.round(pct));
  }
}

// ============================================================
// IMAGE ZOOM OVERLAY
// ============================================================
class ImageZoom {
  constructor() {
    this.overlay = null;
    this.init();
  }
  init() {
    document.addEventListener('click', (e) => {
      const img = e.target.closest('[data-zoom]');
      if (img) this.open(img);
    });
  }
  open(img) {
    this.overlay = document.createElement('div');
    this.overlay.style.cssText = `
      position:fixed;inset:0;z-index:9999;background:rgba(7,30,43,0.95);
      display:flex;align-items:center;justify-content:center;cursor:zoom-out;
      backdrop-filter:blur(10px);animation:fadeIn 0.2s ease;
    `;
    const clone = document.createElement('img');
    clone.src = img.src;
    clone.alt = img.alt;
    clone.style.cssText = 'max-width:90vw;max-height:90vh;object-fit:contain;border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,0.5);';
    this.overlay.appendChild(clone);
    document.body.appendChild(this.overlay);
    document.body.style.overflow = 'hidden';
    this.overlay.addEventListener('click', () => this.close());
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') this.close(); }, { once: true });
  }
  close() {
    this.overlay?.remove();
    document.body.style.overflow = '';
  }
}

// ============================================================
// CATEGORY TABS — generic tab filter for blog/products
// ============================================================
function initCategoryTabs() {
  const allTabGroups = document.querySelectorAll('[data-tab-group]');
  allTabGroups.forEach(group => {
    const tabs = group.querySelectorAll('[data-tab]');
    const panels = document.querySelectorAll(`[data-tab-panel="${group.dataset.tabGroup}"]`);
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.dataset.tab;
        panels.forEach(panel => {
          panel.hidden = panel.dataset.category !== target && target !== 'all';
        });
      });
    });
  });
}

// ============================================================
// SMOOTH ANCHOR SCROLLING
// ============================================================
function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

// ============================================================
// INIT
// ============================================================
// ============================================================
// ARRIVALS HORIZONTAL SCROLL NAV (Just Arrived)
// ============================================================
class ArrivalsNav {
  constructor() {
    this.nav = document.querySelector('.arrivals-nav');
    if (!this.nav) return;
    this.section = this.nav.closest('.arrivals-strip');
    this.scroller = this.section?.querySelector('.h-scroll');
    if (!this.scroller) return;
    this.nav.querySelector('.prev')?.addEventListener('click', () => this.scroll(-1));
    this.nav.querySelector('.next')?.addEventListener('click', () => this.scroll(1));
  }

  scroll(dir) {
    const factor = document.documentElement.dir === 'rtl' ? -1 : 1;
    const amount = Math.round(this.scroller.clientWidth * 0.8);
    this.scroller.scrollBy({ left: dir * amount * factor, behavior: 'smooth' });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Core features
  new ThemeManager();
  new RTLManager();
  new Navbar();
  new BackToTop();
  new PageTransition();
  new CounterAnimation();
  new Wishlist();
  new SearchToggle();
  new ArrivalsNav();

  // Bubbles on hero sections
  $$('.bubbles-container').forEach(c => new BubbleEffect(c));

  // Ripple on all buttons
  $$('.btn, .btn-primary, .btn-outline, .btn-coral').forEach(btn => addRipple(btn));

  // Tilt effect
  if (window.innerWidth > 1023) new TiltEffect();

  // Light rays
  $$('[data-light-rays]').forEach(el => createLightRays(el));

  // Add ripple class to needed elements
  $$('.cat-tab, .slider-dot').forEach(el => el.classList.add('ripple'));

  // Lazy images fallback - use a placeholder gradient if image fails
  $$('img').forEach(img => {
    img.addEventListener('error', function() {
      const w = this.offsetWidth || 400;
      const h = this.offsetHeight || 300;
      this.src = `https://picsum.photos/${w}/${h}?random=${Math.floor(Math.random()*1000)}`;
    });
  });

  // Reading progress bar (blog-details)
  new ReadingProgress();

  // Image zoom
  new ImageZoom();

  // Smooth anchor scrolling
  initSmoothAnchors();

  // Category tab groups
  initCategoryTabs();
});

// Export for other modules
window.AquaVista = { showToast, $, $$, storage };

// Highlight the active link in the mobile menu based on the current page
(function highlightActiveMobileLink() {
  var path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  if (path === 'blog-details.html') path = 'blog.html';
  document.querySelectorAll('.mobile-nav-link').forEach(function (a) {
    var href = (a.getAttribute('href') || '').split('/').pop().toLowerCase();
    if (href === path) {
      a.classList.add('active');
    } else {
      a.classList.remove('active');
    }
  });
})();
