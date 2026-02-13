// ========================================
// MLP Main JavaScript
// Class-based bilingual system + UI modules
// ========================================

(function() {
  'use strict';

  // ========================================
  // 1. BILINGUAL SYSTEM (class-based)
  // ========================================
  window.setLang = function(lang) {
    if (lang === 'expat') {
      document.body.classList.add('expat-mode');
    } else {
      document.body.classList.remove('expat-mode');
    }

    // Update button states
    document.querySelectorAll('.lang-btn').forEach(function(btn) {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // Update dropdown
    document.querySelectorAll('.lang-dropdown-item').forEach(function(item) {
      item.classList.toggle('active', item.dataset.lang === lang);
    });

    var currentLabel = document.querySelector('.lang-dropdown-current');
    if (currentLabel) {
      currentLabel.textContent = lang === 'expat' ? '🇨🇳 中国外派版' : '🇲🇾 本地华人版';
    }

    // Close dropdown
    var menu = document.getElementById('langDropdownMenu');
    if (menu) menu.classList.remove('show');

    // Save preference
    try { localStorage.setItem('mlpLang', lang); } catch(e) {}

    // GA4 event
    if (typeof gtag === 'function') {
      gtag('event', 'language_switch', { language_version: lang });
    }
  };

  window.toggleLangDropdown = function() {
    var menu = document.getElementById('langDropdownMenu');
    if (menu) menu.classList.toggle('show');
  };

  // Restore saved language
  function restoreLang() {
    try {
      var saved = localStorage.getItem('mlpLang');
      if (saved === 'expat') {
        setLang('expat');
      }
    } catch(e) {}
  }

  // ========================================
  // 2. MOBILE MENU
  // ========================================
  window.toggleMobileMenu = function() {
    var toggle = document.querySelector('.mobile-toggle');
    var menu = document.getElementById('mobileMenu');
    if (toggle && menu) {
      toggle.classList.toggle('active');
      menu.classList.toggle('active');
    }
  };

  // Close mobile menu on outside click
  document.addEventListener('click', function(e) {
    var menu = document.getElementById('mobileMenu');
    var toggle = document.querySelector('.mobile-toggle');
    if (menu && menu.classList.contains('active')) {
      if (!menu.contains(e.target) && !toggle.contains(e.target)) {
        menu.classList.remove('active');
        toggle.classList.remove('active');
      }
    }

    // Close lang dropdown on outside click
    var langMenu = document.getElementById('langDropdownMenu');
    if (langMenu && langMenu.classList.contains('show')) {
      if (!langMenu.parentElement.contains(e.target)) {
        langMenu.classList.remove('show');
      }
    }
  });

  // ========================================
  // 3. BACK TO TOP
  // ========================================
  function initBackToTop() {
    var btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', function() {
      if (window.scrollY > 300) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    });
  }

  // ========================================
  // 4. SMOOTH SCROLL
  // ========================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(link) {
      link.addEventListener('click', function(e) {
        var target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          var offset = 80;
          var top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      });
    });
  }

  // ========================================
  // 5. FAQ ACCORDION
  // ========================================
  function initAccordion() {
    document.querySelectorAll('.faq-question').forEach(function(question) {
      question.addEventListener('click', function() {
        var item = this.parentElement;
        var isActive = item.classList.contains('active');

        // Close all
        document.querySelectorAll('.faq-item').forEach(function(i) {
          i.classList.remove('active');
        });

        // Toggle current
        if (!isActive) {
          item.classList.add('active');
        }
      });
    });
  }

  // ========================================
  // 6. SCROLL ANIMATIONS (IntersectionObserver)
  // ========================================
  function initScrollAnimations() {
    if (!('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(function(el) {
      observer.observe(el);
    });
  }

  // ========================================
  // 7. TYPEWRITER EFFECT (hero)
  // ========================================
  function initTypewriter() {
    var el = document.getElementById('typewriter');
    if (!el) return;

    var isExpat = document.body.classList.contains('expat-mode');
    var textsAttr = isExpat ? 'data-texts-expat' : 'data-texts-local';
    var textsStr = el.getAttribute(textsAttr);
    if (!textsStr) return;

    var texts = JSON.parse(textsStr);
    var textIndex = 0;
    var charIndex = 0;
    var isDeleting = false;
    var speed = 80;
    var holdTime = 2000;
    var deleteSpeed = 40;

    function type() {
      var current = texts[textIndex];

      if (!isDeleting) {
        el.textContent = current.substring(0, charIndex + 1);
        charIndex++;

        if (charIndex === current.length) {
          isDeleting = true;
          setTimeout(type, holdTime);
          return;
        }
        setTimeout(type, speed);
      } else {
        el.textContent = current.substring(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
          isDeleting = false;
          textIndex = (textIndex + 1) % texts.length;
          setTimeout(type, 300);
          return;
        }
        setTimeout(type, deleteSpeed);
      }
    }

    type();

    // Re-init on language change
    var origSetLang = window.setLang;
    window.setLang = function(lang) {
      origSetLang(lang);
      charIndex = 0;
      textIndex = 0;
      isDeleting = false;
      var attr = lang === 'expat' ? 'data-texts-expat' : 'data-texts-local';
      textsStr = el.getAttribute(attr);
      if (textsStr) texts = JSON.parse(textsStr);
      el.textContent = '';
      type();
    };
  }

  // ========================================
  // 8. GPTW YEARS COUNTER ANIMATION
  // ========================================
  function initGPTWCounter() {
    var counter = document.querySelector('.gptw-counter');
    if (!counter) return;

    var target = parseInt(counter.dataset.target) || 6;
    var animated = false;

    if (!('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting && !animated) {
        animated = true;
        var current = 1;
        var interval = setInterval(function() {
          counter.textContent = current;
          if (current >= target) {
            clearInterval(interval);
          }
          current++;
        }, 300);
        observer.unobserve(counter);
      }
    }, { threshold: 0.5 });

    observer.observe(counter);
  }

  // ========================================
  // INIT ALL
  // ========================================
  function init() {
    restoreLang();
    initBackToTop();
    initSmoothScroll();
    initAccordion();
    initScrollAnimations();
    initTypewriter();
    initGPTWCounter();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
