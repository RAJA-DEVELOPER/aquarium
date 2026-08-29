/* ============================================================
   AQUAVISTA — Forms & FAQ Accordion
   Validation, Submission, Accordion, Countdown Timer
   ============================================================ */

'use strict';

// ============================================================
// FORM VALIDATION
// ============================================================
class FormValidator {
  constructor(formSelector) {
    this.form = document.querySelector(formSelector);
    if (!this.form) return;
    this.rules = {};
    this.init();
  }

  init() {
    this.form.setAttribute('novalidate', '');
    this.form.addEventListener('submit', (e) => this.onSubmit(e));

    // Real-time validation
    this.form.querySelectorAll('input, textarea, select').forEach(field => {
      field.addEventListener('blur', () => this.validateField(field));
      field.addEventListener('input', () => {
        if (field.closest('.form-group')?.classList.contains('error')) {
          this.validateField(field);
        }
      });
    });
  }

  validateField(field) {
    const group = field.closest('.form-group');
    if (!group) return true;

    const errorEl = group.querySelector('.form-error');
    let valid = true;
    let message = '';

    // Required
    if (field.required && !field.value.trim()) {
      valid = false;
      message = 'This field is required';
    }

    // Email
    if (valid && field.type === 'email' && field.value) {
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(field.value)) {
        valid = false;
        message = 'Please enter a valid email address';
      }
    }

    // Phone
    if (valid && field.type === 'tel' && field.value) {
      const phoneRe = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
      if (!phoneRe.test(field.value.replace(/\s/g, ''))) {
        valid = false;
        message = 'Please enter a valid phone number';
      }
    }

    // Min length
    if (valid && field.minLength > 0 && field.value.length < field.minLength && field.value) {
      valid = false;
      message = `Minimum ${field.minLength} characters required`;
    }

    // Custom rule
    if (valid && this.rules[field.name]) {
      const result = this.rules[field.name](field.value);
      if (result !== true) { valid = false; message = result; }
    }

    // Apply state
    group.classList.toggle('error', !valid);
    group.classList.toggle('success', valid && field.value.trim() !== '');
    field.classList.toggle('error', !valid);
    field.classList.toggle('success', valid && field.value.trim() !== '');

    if (errorEl) {
      errorEl.textContent = message;
      errorEl.style.display = !valid ? 'flex' : 'none';
    }

    return valid;
  }

  validateAll() {
    let allValid = true;
    this.form.querySelectorAll('input[required], textarea[required], select[required]').forEach(field => {
      if (!this.validateField(field)) allValid = false;
    });
    return allValid;
  }

  addRule(fieldName, fn) {
    this.rules[fieldName] = fn;
    return this;
  }

  async onSubmit(e) {
    e.preventDefault();
    if (!this.validateAll()) {
      // Scroll to first error
      const firstError = this.form.querySelector('.form-group.error');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const btn = this.form.querySelector('[type="submit"]');
    const originalText = btn?.innerHTML;

    // Loading state
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span style="display:inline-block;animation:spin 1s linear infinite">⟳</span> Sending…';
    }

    // Simulate API call
    await new Promise(r => setTimeout(r, 1800));

    // Success
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = originalText || 'Send';
    }

    this.showSuccess();
    this.form.reset();
    this.form.querySelectorAll('.form-group').forEach(g => {
      g.classList.remove('error', 'success');
    });
    this.form.querySelectorAll('input, textarea, select').forEach(f => {
      f.classList.remove('error', 'success');
    });
  }

  showSuccess() {
    // Try to find success message element
    const successEl = document.querySelector('#form-success, .form-success');
    if (successEl) {
      successEl.style.display = 'flex';
      successEl.classList.add('success-animation');
      setTimeout(() => { successEl.style.display = 'none'; }, 5000);
    } else {
      // Use toast
      if (window.AquaVista?.showToast) {
        window.AquaVista.showToast('Your message has been sent! We\'ll be in touch soon. <i class="fa-solid fa-fish-fins"></i>', 'success');
      } else {
        alert('Thank you! Your message has been sent successfully.');
      }
    }
  }
}

// ============================================================
// FAQ ACCORDION
// ============================================================
class FAQAccordion {
  constructor(selector = '.faq-list') {
    this.containers = [...document.querySelectorAll(selector)];
    this.containers.forEach(c => this.init(c));
  }

  init(container) {
    const items = [...container.querySelectorAll('.faq-item')];

    items.forEach(item => {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');

      if (!question || !answer) return;

      // Accessibility
      const id = `faq-${Math.random().toString(36).substr(2, 9)}`;
      answer.id = id;
      question.setAttribute('aria-controls', id);
      question.setAttribute('aria-expanded', 'false');
      question.setAttribute('role', 'button');
      question.setAttribute('tabindex', '0');

      question.addEventListener('click', () => this.toggle(item, items));
      question.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggle(item, items);
        }
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          const next = item.nextElementSibling?.querySelector('.faq-question');
          next?.focus();
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          const prev = item.previousElementSibling?.querySelector('.faq-question');
          prev?.focus();
        }
      });
    });
  }

  toggle(item, allItems) {
    const isActive = item.classList.contains('active');
    const question = item.querySelector('.faq-question');

    // Close all
    allItems.forEach(i => {
      i.classList.remove('active');
      i.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
    });

    // Open this one (unless it was already open)
    if (!isActive) {
      item.classList.add('active');
      question?.setAttribute('aria-expanded', 'true');
    }
  }
}

// ============================================================
// NEWSLETTER FORM
// ============================================================
class NewsletterForm {
  constructor() {
    document.querySelectorAll('.newsletter-form').forEach(form => {
      form.addEventListener('submit', (e) => this.onSubmit(e));
    });
  }

  async onSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const input = form.querySelector('input[type="email"]');
    const btn = form.querySelector('button');

    if (!input?.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
      input?.classList.add('error');
      setTimeout(() => input?.classList.remove('error'), 2000);
      return;
    }

    if (btn) {
      btn.innerHTML = '⟳';
      btn.disabled = true;
    }

    await new Promise(r => setTimeout(r, 1200));

    if (btn) {
      btn.innerHTML = '<i class="fa-solid fa-check"></i>';
      btn.style.background = 'linear-gradient(135deg, #4CAF50, #388E3C)';
      setTimeout(() => {
        btn.innerHTML = '→';
        btn.style.background = '';
        btn.disabled = false;
        input.value = '';
      }, 3000);
    }

    if (window.AquaVista?.showToast) {
      window.AquaVista.showToast('Welcome to AquaVista! Check your inbox. <i class="fa-solid fa-fish-fins"></i>', 'success');
    }
  }
}

// ============================================================
// COUNTDOWN TIMER (Maintenance Page)
// ============================================================
class CountdownTimer {
  constructor(selector, targetDate) {
    this.el = document.querySelector(selector);
    if (!this.el) return;

    this.target = targetDate ? new Date(targetDate) : this.getDefaultTarget();
    this.init();
  }

  getDefaultTarget() {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d;
  }

  init() {
    this.update();
    setInterval(() => this.update(), 1000);
  }

  update() {
    const now = new Date();
    const diff = this.target - now;

    if (diff <= 0) {
      this.el.innerHTML = '<p class="text-aqua">We\'re live! Refreshing...</p>';
      setTimeout(() => window.location.reload(), 2000);
      return;
    }

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);

    const units = [
      { value: days, label: 'Days' },
      { value: hours, label: 'Hours' },
      { value: mins, label: 'Minutes' },
      { value: secs, label: 'Seconds' }
    ];

    this.el.innerHTML = units.map(u => `
      <div class="countdown-unit">
        <span class="countdown-value">${String(u.value).padStart(2, '0')}</span>
        <span class="countdown-label">${u.label}</span>
      </div>
    `).join('<span class="countdown-sep">:</span>');
  }
}

// ============================================================
// CHAR COUNTER FOR TEXTAREA
// ============================================================
class CharCounter {
  constructor() {
    document.querySelectorAll('textarea[maxlength]').forEach(ta => {
      const max = parseInt(ta.maxLength);
      const counter = document.createElement('div');
      counter.className = 'char-counter';
      counter.style.cssText = 'text-align:right;font-size:0.75rem;color:var(--text-muted);margin-top:4px;';
      counter.textContent = `0 / ${max}`;
      ta.after(counter);

      ta.addEventListener('input', () => {
        const len = ta.value.length;
        counter.textContent = `${len} / ${max}`;
        counter.style.color = len > max * 0.9 ? 'var(--coral)' : 'var(--text-muted)';
      });
    });
  }
}

// ============================================================
// STAR RATING INPUT
// ============================================================
class StarRatingInput {
  constructor() {
    document.querySelectorAll('.star-rating-input').forEach(el => this.init(el));
  }

  init(el) {
    const stars = [...el.querySelectorAll('.star')];
    const input = el.querySelector('input[type="hidden"]');
    let selected = 0;

    stars.forEach((star, i) => {
      star.addEventListener('mouseenter', () => this.highlight(stars, i));
      star.addEventListener('mouseleave', () => this.highlight(stars, selected - 1));
      star.addEventListener('click', () => {
        selected = i + 1;
        if (input) input.value = selected;
        this.highlight(stars, i);
      });
      star.style.cursor = 'pointer';
    });
  }

  highlight(stars, upTo) {
    stars.forEach((s, i) => {
      s.style.color = i <= upTo ? '#F5C518' : 'var(--text-muted)';
    });
  }
}

// ============================================================
// SEARCH MODAL FUNCTIONALITY
// ============================================================
class SearchModal {
  constructor() {
    this.modal = document.querySelector('#search-modal');
    if (!this.modal) return;
    this.input = this.modal.querySelector('.search-input');
    this.results = this.modal.querySelector('.search-results');
    this.init();
  }

  init() {
    this.input?.addEventListener('input', () => this.onSearch());
  }

  onSearch() {
    const q = this.input.value.toLowerCase().trim();
    if (!this.results) return;

    const suggestions = [
      { title: 'Blue Tang', url: 'index.html', cat: 'Marine Fish' },
      { title: 'Clownfish', url: 'index.html', cat: 'Marine Fish' },
      { title: 'Neon Tetra', url: 'index.html', cat: 'Freshwater' },
      { title: 'Planted Tank Setup', url: 'services.html', cat: 'Services' },
      { title: 'Aquarium Filters', url: 'index.html', cat: 'Equipment' },
      { title: 'Care Guide: Freshwater', url: 'blog.html', cat: 'Blog' },
      { title: 'Contact Us', url: 'contact.html', cat: 'Pages' }
    ];

    if (!q) { this.results.innerHTML = ''; return; }

    const matches = suggestions.filter(s =>
      s.title.toLowerCase().includes(q) || s.cat.toLowerCase().includes(q)
    );

    this.results.innerHTML = matches.length
      ? matches.map(m => `
          <a href="${m.url}" class="search-result-item">
            <span class="search-result-icon"><i class="fa-solid fa-magnifying-glass"></i></span>
            <div>
              <div class="search-result-title">${m.title}</div>
              <div class="search-result-cat">${m.cat}</div>
            </div>
          </a>
        `).join('')
      : '<p class="search-no-results">No results found. Try a different term.</p>';
  }
}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  // Contact form
  new FormValidator('#contact-form');

  // Enquiry form
  new FormValidator('#enquiry-form');

  // FAQ Accordions
  new FAQAccordion('.faq-list');

  // Newsletter forms
  new NewsletterForm();

  // Countdown timer (maintenance page)
  new CountdownTimer('#countdown', null);

  // Char counters
  new CharCounter();

  // Star rating inputs
  new StarRatingInput();

  // Search modal
  new SearchModal();
});
