/* ========================================
   La Esquina del Sándwich — Script
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Navbar scroll effect ----
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  }, { passive: true });

  // ---- Mobile menu toggle ----
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // ---- Scroll Reveal (IntersectionObserver) ----
  const revealElements = document.querySelectorAll('.scroll-reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ---- Scroll-driven restaurant entrance ----
  const entryScene = document.querySelector('.hero');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (entryScene && !prefersReducedMotion) {
    let entryFrame = 0;

    const updateEntryScene = () => {
      const progress = Math.min(1, Math.max(0, window.scrollY / entryScene.offsetHeight));

      entryScene.style.setProperty('--entry-progress', progress.toFixed(3));
      entryFrame = 0;
    };

    const requestEntryUpdate = () => {
      if (!entryFrame) {
        entryFrame = window.requestAnimationFrame(updateEntryScene);
      }
    };

    window.addEventListener('scroll', requestEntryUpdate, { passive: true });
    window.addEventListener('resize', requestEntryUpdate);
    updateEntryScene();
  }

  // ---- Counter animation for stats ----
  const statNumbers = document.querySelectorAll('.stat-number[data-count]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const count = parseInt(target.getAttribute('data-count'), 10);
        animateCounter(target, 0, count, 2000);
        counterObserver.unobserve(target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => counterObserver.observe(el));

  function animateCounter(element, start, end, duration) {
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (end - start) * eased);

      element.textContent = current.toLocaleString('es-DO');

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // ---- Menu category tabs ----
  const menuTabs = document.querySelectorAll('.menu-tab');
  const menuItems = document.querySelectorAll('.menu-item');

  menuTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const category = tab.getAttribute('data-category');

      menuTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      menuItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (itemCategory === category) {
          item.style.display = '';
          item.classList.remove('revealed');
          void item.offsetWidth;
          requestAnimationFrame(() => {
            revealObserver.observe(item);
          });
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // ---- Smooth scroll for anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navHeight = navbar.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ---- Active nav link on scroll ----
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 100;

    sections.forEach(section => {
      const top = section.offsetTop - 100;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navLinks.querySelectorAll('a').forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { passive: true });

});
