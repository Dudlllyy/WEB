// --- 1. ПЫЛИНКИ ---
const particlesContainer = document.getElementById('particles-container');
for (let i = 0; i < 100; i++) {
    let p = document.createElement('div'); p.classList.add('particle');
    p.style.width = p.style.height = `${Math.random() * 1.5 + 1}px`;
    p.style.left = `${Math.random() * 100}%`;
    p.style.top = `${Math.random() * 100}%`;
    p.style.animation = `drift ${Math.random() * 20 + 15}s linear ${Math.random() * 10}s infinite`;
    particlesContainer.appendChild(p);
}

// --- 2. ЛОКАЛЬНЫЕ ДАННЫЕ (ЗАМЕНА СЕРВЕРУ) ---
const localProducts = [
    {
        title: "RTX 4090",
        price: 1599.00,
        description: "Флагманская видеокарта с невероятной мощностью. Оснащена новейшей системой охлаждения и трассировкой лучей.",
        image_url: "pictures/RTX_4090.png"
    },
    {
        title: "Intel i9",
        price: 599.00,
        description: "Высокопроизводительный процессор для любых рабочих задач и киберспорта.",
        image_url: "pictures/Intel_i9.png"
    },
    {
        title: "Fury RAM",
        price: 199.00,
        description: "Быстрая оперативная память стандарта DDR5.",
        image_url: "pictures/Fyru_RAM.png"
    },
    {
        title: "Z790 Board",
        price: 499.00,
        description: "Материнская плата премиум-класса для оверклокинга. Поддержка PCIe 5.0 и Wi-Fi 6E.",
        image_url: "pictures/Mother_board.png"
    },
    {
        title: "Crucial M.2",
        price: 150.00,
        description: "Сверхбыстрый SSD накопитель на 2 ТБ.",
        image_url: "pictures/SSD_m2.png"
    },
    {
        title: "RX 7900",
        price: 999.00,
        description: "Мощный конкурент от AMD. Идеально для 4K гейминга без компромиссов.",
        image_url: "pictures/videocard.png"
    }
];

// --- 3. РЕНДЕР КАТАЛОГА ---
function loadCatalog() {
    const grid = document.getElementById('catalog-grid');
    grid.innerHTML = '';

    // Асимметрия сетки Bento
    const bentoLayoutClasses = ['span-2-row', 'span-2-col', '', 'span-large', '', 'span-2-col'];

    localProducts.forEach((item, index) => {
        const layoutClass = bentoLayoutClasses[index % bentoLayoutClasses.length];

        const card = document.createElement('div');
        card.className = `bento-card ${layoutClass}`.trim();

        card.setAttribute('data-title', item.title);
        card.setAttribute('data-desc', item.description || 'Описание отсутствует');
        card.setAttribute('data-price', `$${item.price.toFixed(2)}`);

        card.innerHTML = `
            <div class="border-glow-wrapper"><div class="border-glow"></div></div>
            <div class="card-inner">
                <img src="${item.image_url}" class="card-img" alt="${item.title}" draggable="false">
                <h3 class="card-title">${item.title}</h3>
            </div>
        `;
        grid.appendChild(card);
    });

    initLettersAnimation();
    init3DTilt();
    initModal();
}

// --- 4. АНИМАЦИЯ БУКВ ---
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

// --- 5. 3D НАКЛОН ---
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

// --- 6. МОДАЛЬНОЕ ОКНО ---
function initModal() {
    const modal = document.getElementById('modal');
    const closeBtn = document.getElementById('close-btn');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalPrice = document.getElementById('modal-price');
    const cards = document.querySelectorAll('.bento-card');

    cards.forEach(card => {
        card.addEventListener('click', () => {
            modalImg.src = card.querySelector('.card-img').src;
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

// Запускаем отрисовку при старте страницы
document.addEventListener('DOMContentLoaded', loadCatalog);