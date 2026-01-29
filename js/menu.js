/**
 * Чайхона Согдиана — Меню
 * Загрузка и отображение меню из JSON-файла
 */

// Состояние меню
const menuState = {
  data: null,
  activeCategory: 'all',
  isLoading: true,
  error: null
};

// DOM элементы
let menuContainer;
let filterContainer;
let loaderElement;

/**
 * Инициализация при загрузке страницы
 */
document.addEventListener('DOMContentLoaded', () => {
  menuContainer = document.getElementById('menu-grid');
  filterContainer = document.getElementById('menu-filters');
  loaderElement = document.getElementById('menu-loader');

  if (menuContainer) {
    loadMenu();
  }
});

/**
 * Загрузка данных меню из JSON
 */
async function loadMenu() {
  try {
    showLoader();

    const response = await fetch('data/menu.json');
    if (!response.ok) {
      throw new Error('Не удалось загрузить меню');
    }

    menuState.data = await response.json();
    menuState.isLoading = false;

    // Проверяем хеш в URL для выбора категории
    const hash = window.location.hash.slice(1); // убираем #
    if (hash && menuState.data.categories.some(c => c.id === hash)) {
      menuState.activeCategory = hash;
    }

    renderFilters();
    renderMenu();

    // Слушаем изменения хеша
    window.addEventListener('hashchange', () => {
      const newHash = window.location.hash.slice(1);
      if (newHash && menuState.data.categories.some(c => c.id === newHash)) {
        setActiveCategory(newHash);
      } else if (!newHash) {
        setActiveCategory('all');
      }
    });

  } catch (error) {
    menuState.error = error.message;
    menuState.isLoading = false;
    showError(error.message);
  }
}

/**
 * Показать лоадер
 */
function showLoader() {
  if (loaderElement) {
    loaderElement.style.display = 'flex';
  }
  if (menuContainer) {
    menuContainer.innerHTML = '';
  }
}

/**
 * Скрыть лоадер
 */
function hideLoader() {
  if (loaderElement) {
    loaderElement.style.display = 'none';
  }
}

/**
 * Показать ошибку
 */
function showError(message) {
  hideLoader();
  if (menuContainer) {
    menuContainer.innerHTML = `
      <div class="menu-error">
        <p>Произошла ошибка при загрузке меню.</p>
        <p>${message}</p>
        <button class="btn btn--primary" onclick="loadMenu()">Попробовать снова</button>
      </div>
    `;
  }
}

/**
 * Рендер фильтров категорий
 */
function renderFilters() {
  if (!filterContainer || !menuState.data) return;

  const categories = menuState.data.categories;

  let filtersHTML = `
    <button class="filter-tag filter-tag--active" data-category="all">
      Все блюда
    </button>
  `;

  categories.forEach(category => {
    filtersHTML += `
      <button class="filter-tag" data-category="${category.id}">
        ${category.name}
      </button>
    `;
  });

  filterContainer.innerHTML = filtersHTML;

  // Добавляем обработчики кликов
  const filterButtons = filterContainer.querySelectorAll('.filter-tag');
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      setActiveCategory(button.dataset.category);
    });
  });
}

/**
 * Установка активной категории
 */
function setActiveCategory(categoryId, updateHash = true) {
  menuState.activeCategory = categoryId;

  // Обновляем хеш в URL (без перезагрузки)
  if (updateHash) {
    if (categoryId === 'all') {
      history.replaceState(null, '', window.location.pathname);
    } else {
      history.replaceState(null, '', '#' + categoryId);
    }
  }

  // Обновляем активный класс у кнопок
  const filterButtons = filterContainer?.querySelectorAll('.filter-tag');
  filterButtons?.forEach(button => {
    if (button.dataset.category === categoryId) {
      button.classList.add('filter-tag--active');
    } else {
      button.classList.remove('filter-tag--active');
    }
  });

  // Перерисовываем меню
  renderMenu();

  // Скроллим к началу меню
  menuContainer?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Рендер меню
 */
function renderMenu() {
  if (!menuContainer || !menuState.data) return;

  hideLoader();

  const categories = menuState.data.categories;
  let menuHTML = '';

  categories.forEach(category => {
    // Фильтруем по категории
    if (menuState.activeCategory !== 'all' && category.id !== menuState.activeCategory) {
      return;
    }

    // Рендерим заголовок категории (только если показываем все)
    if (menuState.activeCategory === 'all') {
      menuHTML += `
        <div class="menu-category" id="category-${category.id}">
          <h3 class="menu-category__title">${category.name}</h3>
          ${category.description ? `<p class="menu-category__description">${category.description}</p>` : ''}
        </div>
      `;
    }

    // Рендерим блюда категории
    category.items.forEach(item => {
      menuHTML += renderDishCard(item);
    });
  });

  menuContainer.innerHTML = menuHTML;

  // Инициализируем анимации для новых элементов
  initMenuAnimations();
}

/**
 * Рендер карточки блюда
 */
function renderDishCard(item) {
  const { formatPrice } = window.SogdianaUtils || { formatPrice: (p) => p + ' ₽' };

  // Заглушка для изображения
  const imageSrc = item.image
    ? `images/${item.image}`
    : 'data:image/svg+xml,' + encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
          <rect fill="#F7F0E8" width="400" height="300"/>
          <text fill="#B8895A" font-family="sans-serif" font-size="48" x="50%" y="45%" text-anchor="middle">🍽️</text>
          <text fill="#8B7B6B" font-family="sans-serif" font-size="14" x="50%" y="60%" text-anchor="middle">Фото скоро появится</text>
        </svg>
      `);

  return `
    <article class="card dish-card" data-animate>
      <div class="card__image">
        <img
          src="${imageSrc}"
          alt="${item.name}"
          loading="lazy"
          onerror="this.src='data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect fill="#F7F0E8" width="400" height="300"/><text fill="#B8895A" font-family="sans-serif" font-size="48" x="50%" y="45%" text-anchor="middle">🍽️</text><text fill="#8B7B6B" font-family="sans-serif" font-size="14" x="50%" y="60%" text-anchor="middle">Фото скоро появится</text></svg>`)}'"
        >
        ${item.popular ? '<span class="card__badge badge-popular">Хит</span>' : ''}
      </div>
      <div class="card__content dish-card__content">
        <h4 class="card__title">${item.name}</h4>
        ${item.description ? `<p class="card__description dish-card__description">${item.description}</p>` : ''}
        <div class="card__footer">
          <span class="card__price">${formatPrice(item.price)}</span>
          ${item.weight ? `<span class="card__weight">${item.weight}</span>` : ''}
        </div>
      </div>
    </article>
  `;
}

/**
 * Инициализация анимаций для карточек меню
 */
function initMenuAnimations() {
  const cards = menuContainer?.querySelectorAll('[data-animate]');
  if (!cards?.length) return;

  // Добавляем задержку для каскадного эффекта
  cards.forEach((card, index) => {
    card.style.animationDelay = `${index * 50}ms`;

    // Используем IntersectionObserver если поддерживается
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animated');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );
      observer.observe(card);
    } else {
      card.classList.add('animated');
    }
  });
}

/**
 * Стили для категорий меню (добавляются динамически)
 */
const menuStyles = document.createElement('style');
menuStyles.textContent = `
  .menu-category {
    grid-column: 1 / -1;
    text-align: center;
    padding: var(--spacing-xl) 0 var(--spacing-lg);
    margin-top: var(--spacing-xl);
  }

  .menu-category:first-child {
    margin-top: 0;
  }

  .menu-category__title {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-sm);
    font-family: var(--font-display);
    font-size: var(--text-2xl);
    color: var(--color-primary);
    margin-bottom: var(--spacing-sm);
  }

  .menu-category__icon {
    font-size: var(--text-3xl);
  }

  .menu-category__description {
    color: var(--color-text-secondary);
    font-size: var(--text-base);
    max-width: 500px;
    margin: 0 auto;
  }

  .menu-error {
    grid-column: 1 / -1;
    text-align: center;
    padding: var(--spacing-3xl);
    color: var(--color-text-secondary);
  }

  .menu-error p {
    margin-bottom: var(--spacing-md);
  }

  /* Анимация появления карточек */
  .dish-card {
    opacity: 0;
    transform: translateY(20px);
  }

  .dish-card.animated {
    animation: fadeInUp 0.5s ease-out forwards;
  }
`;
document.head.appendChild(menuStyles);
