/**
 * Чайхона Согдиана — Основной JavaScript
 * Общая логика сайта: навигация, анимации, утилиты
 */

// Ждём загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initStickyHeader();
  initSmoothScroll();
  initAnimations();
  initLazyLoad();
});

/**
 * Мобильное меню (бургер)
 */
function initMobileMenu() {
  const burger = document.querySelector('.burger');
  const mobileNav = document.querySelector('.mobile-nav');
  const overlay = document.querySelector('.mobile-nav__overlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav__link');

  if (!burger || !mobileNav) return;

  // Переключение меню
  function toggleMenu() {
    burger.classList.toggle('burger--active');
    mobileNav.classList.toggle('mobile-nav--open');
    overlay?.classList.toggle('mobile-nav__overlay--visible');
    document.body.style.overflow = mobileNav.classList.contains('mobile-nav--open') ? 'hidden' : '';
  }

  // Закрытие меню
  function closeMenu() {
    burger.classList.remove('burger--active');
    mobileNav.classList.remove('mobile-nav--open');
    overlay?.classList.remove('mobile-nav__overlay--visible');
    document.body.style.overflow = '';
  }

  burger.addEventListener('click', toggleMenu);
  overlay?.addEventListener('click', closeMenu);

  // Закрытие при клике на ссылку
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Закрытие по Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('mobile-nav--open')) {
      closeMenu();
    }
  });
}

/**
 * Липкая шапка с эффектом при скролле
 */
function initStickyHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  let lastScroll = 0;
  const scrollThreshold = 50;

  function handleScroll() {
    const currentScroll = window.pageYOffset;

    // Добавляем класс при скролле
    if (currentScroll > scrollThreshold) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }

    lastScroll = currentScroll;
  }

  // Используем throttle для производительности
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  });
}

/**
 * Плавный скролл к якорям
 */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });
}

/**
 * Анимации при появлении элементов
 */
function initAnimations() {
  const animatedElements = document.querySelectorAll('[data-animate]');
  if (!animatedElements.length) return;

  // Проверяем поддержку IntersectionObserver
  if (!('IntersectionObserver' in window)) {
    animatedElements.forEach(el => el.classList.add('animated'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Добавляем задержку, если указана
          const delay = entry.target.dataset.animateDelay || 0;
          setTimeout(() => {
            entry.target.classList.add('animated');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }
  );

  animatedElements.forEach(el => observer.observe(el));
}

/**
 * Ленивая загрузка изображений
 */
function initLazyLoad() {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  if (!lazyImages.length) return;

  // Добавляем класс loaded после загрузки
  lazyImages.forEach(img => {
    if (img.complete) {
      img.classList.add('loaded');
    } else {
      img.addEventListener('load', () => {
        img.classList.add('loaded');
      });
    }
  });
}

/**
 * Утилита: Форматирование цены
 */
function formatPrice(price) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
}

/**
 * Утилита: Дебаунс функции
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Утилита: Троттлинг функции
 */
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Экспортируем утилиты для использования в других скриптах
window.SogdianaUtils = {
  formatPrice,
  debounce,
  throttle
};
