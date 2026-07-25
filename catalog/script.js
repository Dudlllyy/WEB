// --- 1. ПЫЛИНКИ ---
const particlesContainer = document.getElementById('particles-container');
if (particlesContainer) {
    for (let i = 0; i < 100; i++) {
        let p = document.createElement('div');
        p.classList.add('particle');
        p.style.width = p.style.height = `${Math.random() * 1.5 + 1}px`;
        p.style.left = `${Math.random() * 100}%`;
        p.style.top = `${Math.random() * 100}%`;
        p.style.animation = `drift ${Math.random() * 20 + 15}s linear ${Math.random() * 10}s infinite`;
        particlesContainer.appendChild(p);
    }
}

// --- 2. ЗАГРУЗКА ТОВАРОВ С СЕРВЕРА ---
async function loadCatalogFromBackend() {
    const grid = document.getElementById('catalog-grid');
    if (!grid) return;

    try {
        const response = await fetch('http://localhost:8000/api/products');
        const products = await response.json();

        grid.innerHTML = ''; // Очищаем контейнер

        // Сохраняем асимметрию сетки Bento
        const bentoLayoutClasses = ['span-2-row', 'span-2-col', '', 'span-large', '', 'span-2-col'];

        products.forEach((item, index) => {
            const layoutClass = bentoLayoutClasses[index % bentoLayoutClasses.length];

            const card = document.createElement('div');
            card.className = `bento-card ${layoutClass}`.trim();

            // Передаем данные в атрибуты для модального окна
            card.setAttribute('data-title', item.title);
            card.setAttribute('data-desc', item.description || 'Описание отсутствует');
            card.setAttribute('data-price', `$${item.price}`);

            card.innerHTML = `
                <div class="border-glow-wrapper"><div class="border-glow"></div></div>
                <div class="card-inner">
                    <img src="${item.image_url}" class="card-img" alt="${item.title}" draggable="false">
                    <h3 class="card-title">${item.title}</h3>
                </div>
            `;
            grid.appendChild(card);
        });

        // Запускаем анимации только после того, как карточки создались
        initLettersAnimation();
        init3DTilt();
        initModal();

    } catch (error) {
        console.error("Ошибка соединения с бэкендом:", error);
        grid.innerHTML =
            '<p style="color: #ff4757; grid-column: span 4; text-align: center; font-size: 1.5rem;">Не удалось загрузить каталог. Убедитесь, что сервер FastAPI запущен!</p>';
    }
}

// --- 3. АНИМАЦИЯ БУКВ ---
function initLettersAnimation() {
    const titles = document.querySelectorAll('.card-title');
    titles.forEach(title => {
        const text = title.textContent;
        title.textContent = '';
        text.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.transitionDelay = `${index * 0.05}s`;
            title.appendChild(span);
        });
    });
}

// --- 4. 3D НАКЛОН ---
function init3DTilt() {
    const cards = document.querySelectorAll('.bento-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });
}

// --- 5. МОДАЛЬНОЕ ОКНО ---
function initModal() {
    const modal = document.getElementById('modal');
    const closeBtn = document.getElementById('close-btn');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalPrice = document.getElementById('modal-price');
    const cards = document.querySelectorAll('.bento-card');

    if (!modal || !closeBtn) return;

    cards.forEach(card => {
        card.addEventListener('click', () => {
            const imgEl = card.querySelector('.card-img');
            if (imgEl) modalImg.src = imgEl.src;
            
            modalTitle.textContent = card.getAttribute('data-title');
            modalDesc.textContent = card.getAttribute('data-desc');
            modalPrice.textContent = card.getAttribute('data-price');

            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    closeBtn.onclick = () => {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    };
}

// Запускаем загрузку каталога при старте страницы
document.addEventListener('DOMContentLoaded', loadCatalogFromBackend);
