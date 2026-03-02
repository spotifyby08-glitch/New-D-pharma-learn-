document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Dark Mode Toggle ---
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const htmlTag = document.documentElement;
  
  // Check local storage for saved theme
  const savedTheme = localStorage.getItem('theme') || 'light';
  htmlTag.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeToggle.addEventListener('click', () => {
    const currentTheme = htmlTag.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    htmlTag.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  });

  function updateThemeIcon(theme) {
    if (theme === 'dark') {
      themeIcon.classList.replace('fa-moon', 'fa-sun');
    } else {
      themeIcon.classList.replace('fa-sun', 'fa-moon');
    }
  }

  // --- 2. Mobile Hamburger Menu ---
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');

  hamburger.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
  });

  // --- 3. Search Overlay Logic ---
  const searchOverlay = document.getElementById('searchOverlay');
  const searchClose = document.getElementById('searchClose');
  const searchToggle = document.getElementById('searchToggle');

  // Open search from navbar icon
  searchToggle.addEventListener('click', () => {
    searchOverlay.classList.add('open');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    setTimeout(() => document.getElementById('searchInput').focus(), 80);
  });

  // Close search
  searchClose.addEventListener('click', () => {
    searchOverlay.classList.remove('open');
    document.body.style.overflow = 'auto'; // Restore scrolling
  });

  // Close search when clicking outside the box
  searchOverlay.addEventListener('click', (e) => {
    if (e.target === searchOverlay) {
      searchOverlay.classList.remove('open');
      document.body.style.overflow = 'auto';
    }
  });

  // --- 4. Back to Top Button ---
  const backToTop = document.getElementById('backToTop');
  
  if(backToTop) {
      // Hide button initially
      backToTop.style.display = 'none';
      backToTop.style.position = 'fixed';
      backToTop.style.bottom = '20px';
      backToTop.style.right = '20px';
      backToTop.style.padding = '10px 15px';
      backToTop.style.background = 'var(--primary-light)';
      backToTop.style.color = 'white';
      backToTop.style.border = 'none';
      backToTop.style.borderRadius = '50px';
      backToTop.style.cursor = 'pointer';
      backToTop.style.zIndex = '999';

      window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
          backToTop.style.display = 'block';
        } else {
          backToTop.style.display = 'none';
        }
      });

      backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
  }
});
                          
