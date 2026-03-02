/**
 * D-Pharma Learn - Core Application Logic
 * Architecture: ES6 Class-based, Modular, Performance-Optimized
 */

class PharmaApp {
  constructor() {
    // Cache DOM elements to minimize reflows and repaints
    this.DOM = {
      html: document.documentElement,
      themeToggle: document.getElementById('themeToggle'),
      themeIcon: document.getElementById('themeIcon'),
      hamburger: document.getElementById('hamburger'),
      mobileNav: document.getElementById('mobileNav'),
      searchOverlay: document.getElementById('searchOverlay'),
      searchToggles: document.querySelectorAll('#searchToggle, #heroSearch'),
      searchClose: document.getElementById('searchClose'),
      searchInput: document.getElementById('searchInput'),
      backToTop: document.getElementById('backToTop'),
      yearTabs: document.querySelectorAll('.ytab'),
      revealElements: document.querySelectorAll('.reveal, .chapter-card, .fcard')
    };

    // Initialize application
    this.init();
  }

  init() {
    this.initThemeManager();
    this.initNavigation();
    this.initSearchOverlay();
    this.initScrollObserver();
    this.initTabSystem();
  }

  // ==========================================
  // 1. Theme Manager (Dark/Light Mode)
  // ==========================================
  initThemeManager() {
    if (!this.DOM.themeToggle) return;

    // Check System Preference & LocalStorage
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

    this.setTheme(initialTheme);

    this.DOM.themeToggle.addEventListener('click', () => {
      const currentTheme = this.DOM.html.getAttribute('data-theme');
      this.setTheme(currentTheme === 'light' ? 'dark' : 'light');
    });
  }

  setTheme(theme) {
    this.DOM.html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    if (this.DOM.themeIcon) {
      this.DOM.themeIcon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }
  }

  // ==========================================
  // 2. Mobile Navigation
  // ==========================================
  initNavigation() {
    if (!this.DOM.hamburger || !this.DOM.mobileNav) return;

    this.DOM.hamburger.addEventListener('click', () => {
      const isOpen = this.DOM.mobileNav.classList.toggle('open');
      this.DOM.hamburger.classList.toggle('active', isOpen);
      
      // Prevent background scrolling when mobile menu is open
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
  }

  // ==========================================
  // 3. Search Overlay & Debounce Logic
  // ==========================================
  initSearchOverlay() {
    if (!this.DOM.searchOverlay) return;

    const toggleSearch = (state) => {
      this.DOM.searchOverlay.classList.toggle('open', state);
      document.body.style.overflow = state ? 'hidden' : '';
      
      if (state && this.DOM.searchInput) {
        // Slight delay to allow CSS transition to finish before focusing
        setTimeout(() => this.DOM.searchInput.focus(), 100);
      }
    };

    // Open Search
    this.DOM.searchToggles.forEach(btn => {
      btn?.addEventListener('click', () => toggleSearch(true));
    });

    // Close Search
    this.DOM.searchClose?.addEventListener('click', () => toggleSearch(false));
    
    // Close on clicking outside the box or pressing Escape
    this.DOM.searchOverlay.addEventListener('click', (e) => {
      if (e.target === this.DOM.searchOverlay) toggleSearch(false);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.DOM.searchOverlay.classList.contains('open')) {
        toggleSearch(false);
      }
    });

    // Advanced: Debounced Search Input Handling
    if (this.DOM.searchInput) {
      this.DOM.searchInput.addEventListener('input', this.debounce((e) => {
        this.handleSearch(e.target.value);
      }, 300));
    }
  }

  handleSearch(query) {
    // Placeholder for actual search API/logic
    if (query.trim().length === 0) return;
    console.log(`Searching database for: ${query}...`);
    // Example: fetch(`/api/search?q=${query}`).then(...)
  }

  // ==========================================
  // 4. Scroll Animations & Back to Top
  // ==========================================
  initScrollObserver() {
    // 4a. Intersection Observer for high-performance scroll reveals
    if ('IntersectionObserver' in window) {
      const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
      
      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target); // Stop observing once revealed
          }
        });
      }, observerOptions);

      this.DOM.revealElements.forEach(el => {
        // Set initial state via JS so non-JS users still see content
        el.style.opacity = 0;
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        revealObserver.observe(el);
      });
    }

    // 4b. Back to Top Button (Passive listener for scroll performance)
    if (this.DOM.backToTop) {
      window.addEventListener('scroll', () => {
        const isPastThreshold = window.scrollY > 400;
        this.DOM.backToTop.style.opacity = isPastThreshold ? '1' : '0';
        this.DOM.backToTop.style.pointerEvents = isPastThreshold ? 'all' : 'none';
      }, { passive: true });

      this.DOM.backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  // ==========================================
  // 5. Tab System (1st Year / 2nd Year)
  // ==========================================
  initTabSystem() {
    if (!this.DOM.yearTabs.length) return;

    this.DOM.yearTabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        const targetYear = e.target.dataset.year;
        
        // Update active class on tabs
        this.DOM.yearTabs.forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');

        // Toggle visibility of grids
        const y1Grid = document.getElementById('y1cards');
        const y2Grid = document.getElementById('y2cards');

        if (y1Grid && y2Grid) {
          y1Grid.style.display = targetYear === '1' ? 'grid' : 'none';
          y2Grid.style.display = targetYear === '2' ? 'grid' : 'none';
          
          // Re-trigger animations for the newly visible grid
          const activeGrid = targetYear === '1' ? y1Grid : y2Grid;
          activeGrid.querySelectorAll('.scard').forEach((card, index) => {
            card.style.opacity = 0;
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
              card.style.opacity = 1;
              card.style.transform = 'translateY(0)';
            }, index * 50); // Staggered entrance
          });
        }
      });
    });
  }

  // ==========================================
  // Utilities
  // ==========================================
  debounce(func, delay) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }
}

// Boot up the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new PharmaApp();
});
      
