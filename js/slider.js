/* ============================================================
   AQUAVISTA — Hero Slider
   Cinematic Ken Burns slider with dots, arrows, progress
   ============================================================ */

'use strict';

class HeroSlider {
  constructor(selector) {
    this.container = document.querySelector(selector);
    if (!this.container) return;

    this.track = this.container.querySelector('.slider-track');
    this.slides = [...this.container.querySelectorAll('.slide')];
    this.dots = [...this.container.querySelectorAll('.slider-dot')];
    this.prevBtn = this.container.querySelector('.slider-arrow.prev');
    this.nextBtn = this.container.querySelector('.slider-arrow.next');
    this.progressBar = this.container.querySelector('.slider-progress');

    this.current = 0;
    this.total = this.slides.length;
    this.autoInterval = null;
    this.autoDelay = 5500;
    this.isTransitioning = false;
    this.touchStartX = 0;
    this.touchEndX = 0;

    this.init();
  }

  init() {
    if (this.total === 0) return;

    this.goTo(0, false);
    this.startAuto();
    this.bindEvents();
    this.updateProgress(0);
  }

  bindEvents() {
    this.prevBtn?.addEventListener('click', () => { this.prev(); this.resetAuto(); });
    this.nextBtn?.addEventListener('click', () => { this.next(); this.resetAuto(); });

    this.dots.forEach((dot, i) => {
      dot.addEventListener('click', () => { this.goTo(i); this.resetAuto(); });
    });

    // Touch swipe
    this.container.addEventListener('touchstart', (e) => {
      this.touchStartX = e.touches[0].clientX;
    }, { passive: true });

    this.container.addEventListener('touchend', (e) => {
      this.touchEndX = e.changedTouches[0].clientX;
      const diff = this.touchStartX - this.touchEndX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? this.next() : this.prev();
        this.resetAuto();
      }
    });

    // Keyboard
    this.container.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { this.prev(); this.resetAuto(); }
      if (e.key === 'ArrowRight') { this.next(); this.resetAuto(); }
    });

    // Pause on hover
    this.container.addEventListener('mouseenter', () => this.stopAuto());
    this.container.addEventListener('mouseleave', () => this.startAuto());

    // Accessibility
    this.container.setAttribute('role', 'region');
    this.container.setAttribute('aria-label', 'Featured aquarium slider');
    this.container.setAttribute('tabindex', '0');
  }

  goTo(index, animate = true) {
    if (this.isTransitioning && animate) return;
    this.isTransitioning = true;

    // Remove active from current
    this.slides[this.current]?.classList.remove('active');
    this.dots[this.current]?.classList.remove('active');

    this.current = ((index % this.total) + this.total) % this.total;

    // Activate new slide
    this.slides[this.current]?.classList.add('active');
    this.dots[this.current]?.classList.add('active');

    // Move track
    if (this.track) {
      this.track.style.transform = `translateX(-${this.current * 100}%)`;
    }

    // Update progress
    this.updateProgress(animate ? this.autoDelay : 0);

    // Update aria
    this.slides.forEach((slide, i) => {
      slide.setAttribute('aria-hidden', i !== this.current ? 'true' : 'false');
    });
    this.dots.forEach((dot, i) => {
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.setAttribute('aria-current', i === this.current ? 'true' : 'false');
    });

    setTimeout(() => { this.isTransitioning = false; }, 900);
  }

  next() { this.goTo(this.current + 1); }
  prev() { this.goTo(this.current - 1); }

  startAuto() {
    this.stopAuto();
    this.autoInterval = setInterval(() => this.next(), this.autoDelay);
  }

  stopAuto() {
    if (this.autoInterval) {
      clearInterval(this.autoInterval);
      this.autoInterval = null;
    }
  }

  resetAuto() {
    this.startAuto();
  }

  updateProgress(duration) {
    if (!this.progressBar) return;
    this.progressBar.style.transition = 'none';
    this.progressBar.style.width = '0';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.progressBar.style.transition = `width ${duration}ms linear`;
        this.progressBar.style.width = duration > 0 ? '100%' : '0';
      });
    });
  }
}

// ============================================================
// MINI SLIDER (Testimonials)
// ============================================================
class TestimonialSlider {
  constructor(selector) {
    this.container = document.querySelector(selector);
    if (!this.container) return;

    this.items = [...this.container.querySelectorAll('.testimonial-slide')];
    this.prevBtn = this.container.parentElement?.querySelector('.t-prev');
    this.nextBtn = this.container.parentElement?.querySelector('.t-next');
    this.dotsContainer = this.container.parentElement?.querySelector('.t-dots');
    this.current = 0;
    this.total = this.items.length;
    this.autoInterval = null;

    this.init();
  }

  init() {
    if (this.total === 0) return;
    this.buildDots();
    this.show(0);
    this.startAuto();

    this.prevBtn?.addEventListener('click', () => { this.prev(); this.startAuto(); });
    this.nextBtn?.addEventListener('click', () => { this.next(); this.startAuto(); });

    // Touch
    let startX = 0;
    this.container.addEventListener('touchstart', e => startX = e.touches[0].clientX, { passive: true });
    this.container.addEventListener('touchend', e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) { diff > 0 ? this.next() : this.prev(); this.startAuto(); }
    });
  }

  buildDots() {
    if (!this.dotsContainer) return;
    this.items.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Testimonial ${i + 1}`);
      dot.addEventListener('click', () => { this.show(i); this.startAuto(); });
      this.dotsContainer.appendChild(dot);
    });
    this.tdots = [...this.dotsContainer.querySelectorAll('.slider-dot')];
  }

  show(index) {
    this.items[this.current]?.classList.remove('active');
    this.tdots?.[this.current]?.classList.remove('active');
    this.current = ((index % this.total) + this.total) % this.total;
    this.items[this.current]?.classList.add('active');
    this.tdots?.[this.current]?.classList.add('active');
  }

  next() { this.show(this.current + 1); }
  prev() { this.show(this.current - 1); }

  startAuto() {
    if (this.autoInterval) clearInterval(this.autoInterval);
    this.autoInterval = setInterval(() => this.next(), 4500);
  }
}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  new HeroSlider('.hero-slider');
  new TestimonialSlider('.testimonial-track');
});
