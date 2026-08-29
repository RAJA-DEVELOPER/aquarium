/* ============================================================
   AQUAVISTA — Product Filter & Category Tabs
   ============================================================ */

'use strict';

class ProductFilter {
  constructor(options = {}) {
    this.tabsSelector = options.tabs || '.cat-tab';
    this.itemsSelector = options.items || '[data-category]';
    this.gridSelector = options.grid || '.filter-grid';
    this.searchSelector = options.search || '#filter-search';
    this.sortSelector = options.sort || '#filter-sort';
    this.noResultsSelector = options.noResults || '.no-results';

    this.tabs = [...document.querySelectorAll(this.tabsSelector)];
    this.allItems = [...document.querySelectorAll(this.itemsSelector)];
    this.grid = document.querySelector(this.gridSelector);
    this.searchInput = document.querySelector(this.searchSelector);
    this.sortSelect = document.querySelector(this.sortSelector);
    this.noResults = document.querySelector(this.noResultsSelector);

    this.activeFilter = 'all';
    this.searchQuery = '';

    if (this.allItems.length > 0) this.init();
  }

  init() {
    // Tab click
    this.tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const filter = tab.dataset.filter || 'all';
        this.setFilter(filter);
        // Ripple
        this.tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
      });
    });

    // Search
    this.searchInput?.addEventListener('input', (e) => {
      this.searchQuery = e.target.value.toLowerCase().trim();
      this.apply();
    });

    // Sort
    this.sortSelect?.addEventListener('change', () => this.apply());

    // Initial state
    this.apply();

    // Count update on tabs
    this.updateCounts();
  }

  setFilter(filter) {
    this.activeFilter = filter;
    this.apply();
  }

  apply() {
    let visible = this.allItems.filter(item => {
      const category = item.dataset.category || '';
      const name = (item.dataset.name || item.querySelector('h3,h4,.product-name')?.textContent || '').toLowerCase();
      const tags = (item.dataset.tags || '').toLowerCase();

      const matchesFilter = this.activeFilter === 'all' || category === this.activeFilter;
      const matchesSearch = !this.searchQuery ||
        name.includes(this.searchQuery) ||
        tags.includes(this.searchQuery) ||
        category.includes(this.searchQuery);

      return matchesFilter && matchesSearch;
    });

    // Sort
    if (this.sortSelect) {
      const sortVal = this.sortSelect.value;
      visible = this.sortItems(visible, sortVal);
    }

    // Apply visibility with animation
    this.allItems.forEach(item => {
      item.style.transition = 'all 0.3s ease';
      item.style.opacity = '0';
      item.style.transform = 'scale(0.95)';
      item.classList.add('filtered-out');
    });

    requestAnimationFrame(() => {
      setTimeout(() => {
        this.allItems.forEach(item => {
          const isVisible = visible.includes(item);
          if (isVisible) {
            item.style.display = '';
            item.classList.remove('filtered-out');
            requestAnimationFrame(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            });
          } else {
            item.style.display = 'none';
          }
        });

        // No results
        if (this.noResults) {
          this.noResults.style.display = visible.length === 0 ? 'flex' : 'none';
        }
      }, 150);
    });
  }

  sortItems(items, sortVal) {
    return [...items].sort((a, b) => {
      const priceA = parseFloat(a.dataset.price || '0');
      const priceB = parseFloat(b.dataset.price || '0');
      const nameA = (a.dataset.name || '').toLowerCase();
      const nameB = (b.dataset.name || '').toLowerCase();
      const ratingA = parseFloat(a.dataset.rating || '0');
      const ratingB = parseFloat(b.dataset.rating || '0');

      switch (sortVal) {
        case 'price-asc': return priceA - priceB;
        case 'price-desc': return priceB - priceA;
        case 'name-asc': return nameA.localeCompare(nameB);
        case 'name-desc': return nameB.localeCompare(nameA);
        case 'rating': return ratingB - ratingA;
        case 'new': return (parseInt(b.dataset.id || 0)) - (parseInt(a.dataset.id || 0));
        default: return 0;
      }
    });
  }

  updateCounts() {
    this.tabs.forEach(tab => {
      const filter = tab.dataset.filter;
      const countEl = tab.querySelector('.count');
      if (!countEl || !filter) return;

      const count = filter === 'all'
        ? this.allItems.length
        : this.allItems.filter(item => item.dataset.category === filter).length;

      countEl.textContent = count;
    });
  }
}

// ============================================================
// BLOG / ARTICLE FILTER
// ============================================================
class BlogFilter {
  constructor() {
    this.tabs = [...document.querySelectorAll('.blog-cat-tab')];
    this.cards = [...document.querySelectorAll('.blog-card[data-category]')];
    if (this.tabs.length === 0 || this.cards.length === 0) return;
    this.init();
  }

  init() {
    this.tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        this.tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const filter = tab.dataset.filter || 'all';
        this.filter(filter);
      });
    });
  }

  filter(cat) {
    this.cards.forEach(card => {
      const match = cat === 'all' || card.dataset.category === cat;
      card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      if (match) {
        card.style.display = '';
        requestAnimationFrame(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        });
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(10px)';
        setTimeout(() => { card.style.display = 'none'; }, 300);
      }
    });
  }
}

// ============================================================
// HORIZONTAL SCROLL WITH DRAG
// ============================================================
class DragScroll {
  constructor(selector) {
    this.els = [...document.querySelectorAll(selector)];
    this.els.forEach(el => this.init(el));
  }

  init(el) {
    let isDown = false;
    let startX;
    let scrollLeft;

    el.addEventListener('mousedown', (e) => {
      isDown = true;
      el.style.cursor = 'grabbing';
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
      e.preventDefault();
    });

    el.addEventListener('mouseleave', () => {
      isDown = false;
      el.style.cursor = 'grab';
    });

    el.addEventListener('mouseup', () => {
      isDown = false;
      el.style.cursor = 'grab';
    });

    el.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX) * 2;
      el.scrollLeft = scrollLeft - walk;
    });

    el.style.cursor = 'grab';
  }
}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  // Main product filter
  new ProductFilter({
    tabs: '.cat-tab',
    items: '[data-category]',
    grid: '.filter-grid',
    search: '#filter-search',
    sort: '#filter-sort',
    noResults: '.no-results'
  });

  // Blog filter
  new BlogFilter();

  // Drag scroll for horizontal strips
  new DragScroll('.h-scroll');
});
