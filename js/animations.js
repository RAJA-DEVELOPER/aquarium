/* ============================================================
   AQUAVISTA — Scroll Animations & Reveal
   IntersectionObserver-based reveal system
   ============================================================ */

'use strict';

// ============================================================
// SCROLL REVEAL
// ============================================================
class ScrollReveal {
  constructor() {
    this.elements = [...document.querySelectorAll('.reveal')];
    if (this.elements.length === 0) return;

    this.observer = new IntersectionObserver(
      entries => this.onIntersect(entries),
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    this.elements.forEach(el => this.observer.observe(el));
  }

  onIntersect(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        this.observer.unobserve(entry.target);
      }
    });
  }
}

// ============================================================
// PARALLAX EFFECT
// ============================================================
class ParallaxEffect {
  constructor() {
    this.elements = [...document.querySelectorAll('[data-parallax]')];
    if (this.elements.length === 0) return;

    // Only on desktop
    if (window.innerWidth < 1024 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this.bind();
  }

  bind() {
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.update();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  update() {
    const scrollY = window.scrollY;

    this.elements.forEach(el => {
      const speed = parseFloat(el.dataset.parallax || '0.3');
      const rect = el.getBoundingClientRect();
      const elY = rect.top + scrollY;
      const offset = (scrollY - elY) * speed;

      const img = el.querySelector('img') || el;
      img.style.transform = `translateY(${offset}px)`;
    });
  }
}

// ============================================================
// STAGGER CHILDREN
// ============================================================
function staggerChildren(parent, childSelector, delayStep = 100) {
  if (!parent) return;
  const children = [...parent.querySelectorAll(childSelector)];
  children.forEach((child, i) => {
    child.style.transitionDelay = `${i * delayStep}ms`;
  });
}

// ============================================================
// ANIMATE ON SCROLL — STAGGER GRID ITEMS
// ============================================================
class StaggerReveal {
  constructor() {
    this.grids = [...document.querySelectorAll('[data-stagger]')];
    if (this.grids.length === 0) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const parent = entry.target;
            const delay = parseInt(parent.dataset.delay || '80');
            const childSel = parent.dataset.stagger || '.reveal-child';
            const children = [...parent.querySelectorAll(childSel)];

            children.forEach((child, i) => {
              child.classList.add('reveal', 'reveal-up');
              setTimeout(() => child.classList.add('revealed'), i * delay);
            });

            observer.unobserve(parent);
          }
        });
      },
      { threshold: 0.05 }
    );

    this.grids.forEach(g => observer.observe(g));
  }
}

// ============================================================
// HEADER SHRINK (stays pinned + visible on scroll)
// ============================================================
class SmartNav {
  constructor() {
    this.nav = document.querySelector('.navbar');
    if (!this.nav) return;

    this.lastY = 0;
    this.init();
  }

  init() {
    window.addEventListener('scroll', () => this.onScroll(), { passive: true });
    this.onScroll();
  }

  onScroll() {
    const y = window.scrollY;
    if (this.nav) {
      this.nav.style.transform = 'none';
      this.nav.style.visibility = 'visible';
      this.nav.style.opacity = '1';
    }
    this.lastY = y;
  }
}

// ============================================================
// SCROLL-BASED TEXT REVEAL (word by word)
// ============================================================
class TextReveal {
  constructor() {
    const els = [...document.querySelectorAll('[data-text-reveal]')];
    els.forEach(el => this.setup(el));
  }

  setup(el) {
    const text = el.textContent;
    const words = text.split(' ');
    el.innerHTML = words.map(w =>
      `<span style="display:inline-block;opacity:0;transform:translateY(20px);transition:all 0.5s ease">${w}&nbsp;</span>`
    ).join('');

    const spans = [...el.querySelectorAll('span')];
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          spans.forEach((span, i) => {
            setTimeout(() => {
              span.style.opacity = '1';
              span.style.transform = 'translateY(0)';
            }, i * 60);
          });
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
  }
}

// ============================================================
// SECTION HIGHLIGHT (Active section in nav)
// ============================================================
class ActiveSection {
  constructor() {
    this.sections = [...document.querySelectorAll('section[id]')];
    this.navLinks = [...document.querySelectorAll('.nav-link[href*="#"]')];
    if (this.sections.length === 0 || this.navLinks.length === 0) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            this.navLinks.forEach(link => {
              const href = link.getAttribute('href');
              link.classList.toggle('active', href === `#${id}` || href?.endsWith(`#${id}`));
            });
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );

    this.sections.forEach(s => observer.observe(s));
  }
}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  new ScrollReveal();
  new ParallaxEffect();
  new StaggerReveal();
  new SmartNav();
  new TextReveal();
  new ActiveSection();

  // Stagger grids
  document.querySelectorAll('.grid-3, .grid-4, .grid-auto, .blog-grid').forEach(grid => {
    staggerChildren(grid, '.reveal-child', 100);
  });

  // Add reveal classes to common elements
  document.querySelectorAll('.section-header').forEach(el => {
    if (!el.classList.contains('reveal')) {
      el.classList.add('reveal', 'reveal-up');
    }
  });
});
