// Анимация 100 пылинок
const particlesContainer = document.getElementById('particles-container');
for (let i = 0; i < 100; i++) {
    let p = document.createElement('div'); p.classList.add('particle');
    p.style.width = p.style.height = `${Math.random() * 1.5 + 1}px`;

    p.style.left = `${Math.random() * 100}%`;
    p.style.top = `${Math.random() * 100}%`;

    p.style.animation = `drift ${Math.random() * 20 + 15}s linear ${Math.random() * 10}s infinite`;
    particlesContainer.appendChild(p);
}

const buildsData = [
    {
        title: "СБОРКА #1", subtitle: "Начальный уровень", price: "$999",
        desc: "Отличный старт для киберспорта. Справится с CS2, Dota 2 и Valorant на максимальных настройках.",
        img: "PC_1.png", specs: { cpu: "Intel Core i5-12400F", gpu: "NVIDIA RTX 3060 8GB", ram: "16GB DDR4", ssd: "512GB M.2" }
    },
    {
        title: "СБОРКА #2", subtitle: "Оптимальный выбор", price: "$1,599",
        desc: "Золотая середина. Комфортный гейминг в FullHD разрешении во все современные AAA-проекты.",
        img: "PC_2.png", specs: { cpu: "AMD Ryzen 5 7600X", gpu: "NVIDIA RTX 4060 Ti", ram: "32GB DDR5", ssd: "1TB M.2" }
    },
    {
        title: "СБОРКА #3", subtitle: "Ультиматум", price: "$2,899",
        desc: "Безупречная производительность в 4K. Подходит для тяжелого рендеринга и работы с 3D графикой.",
        img: "PC_3.png", specs: { cpu: "Intel Core i7-14700KF", gpu: "NVIDIA RTX 4080 SUPER", ram: "32GB DDR5", ssd: "2TB M.2" }
    },
    {
        title: "СБОРКА #4", subtitle: "Фокус Эффект", price: "$4,500",
        desc: "Эксклюзивная кастомная сборка с водяным охлаждением премиум-класса.",
        img: "PC_4.png", specs: { cpu: "Intel Core i9-14900K", gpu: "NVIDIA RTX 4090 24GB", ram: "64GB DDR5", ssd: "4TB Gen5" }
    },
    {
        title: "СБОРКА #5", subtitle: "Компактная мощь", price: "$1,899",
        desc: "Mini-ITX сборка, которая поместится на любом столе.",
        img: "PC_1.png", specs: { cpu: "AMD Ryzen 7 7800X3D", gpu: "NVIDIA RTX 4070 SUPER", ram: "32GB DDR5", ssd: "2TB M.2" }
    },
    {
        title: "СБОРКА #6", subtitle: "Рабочая станция", price: "$3,200",
        desc: "Создана для профессионалов: видеомонтаж, 3D моделирование.",
        img: "PC_2.png", specs: { cpu: "AMD Ryzen 9 7950X", gpu: "NVIDIA RTX 4080", ram: "64GB DDR5", ssd: "4TB Gen4" }
    },
    {
        title: "СБОРКА #7", subtitle: "Стример Эдишн", price: "$2,100",
        desc: "Идеально сбалансирована для игр и проведения прямых трансляций одновременно.",
        img: "PC_3.png", specs: { cpu: "Intel Core i7-13700K", gpu: "NVIDIA RTX 4070 Ti", ram: "32GB DDR5", ssd: "2TB M.2" }
    },
    {
        title: "СБОРКА #8", subtitle: "Бюджетный хит", price: "$750",
        desc: "Лучшее решение для тех, кто хочет играть в новинки, но ограничен в бюджете.",
        img: "PC_4.png", specs: { cpu: "Intel Core i3-12100F", gpu: "NVIDIA RTX 3050", ram: "16GB DDR4", ssd: "512GB M.2" }
    }
];

// --- ЛОГИКА СЛАЙДЕРА (С УМНЫМ АВТОСТАРТОМ) ---
const carouselArea = document.getElementById('carousel-area');
const infoPanel = document.getElementById('info-panel');
const elTitle = document.getElementById('b-title');
const elSubtitle = document.getElementById('b-subtitle');
const elDesc = document.getElementById('b-desc');
const elPrice = document.getElementById('b-price');

let currentIndex = 0;
let boxes = [];
let isIntroPlaying = true;
let slideTimeouts = [];

buildsData.slice(0, 4).forEach((build, index) => {
    const box = document.createElement('div');
    box.className = 'build-3d-box';
    box.innerHTML = `
        <div class="glass-layer layer-8"></div><div class="glass-layer layer-7"></div>
        <div class="glass-layer layer-6"></div><div class="glass-layer layer-5"></div>
        <div class="glass-layer layer-4"></div><div class="glass-layer layer-3"></div>
        <div class="glass-layer layer-2"></div><div class="glass-layer layer-1"></div>
        <img src="${build.img}" class="pc-image" draggable="false">
    `;
    box.addEventListener('click', () => {
        if (isIntroPlaying || carouselArea.classList.contains('is-sliding')) return;
        if (box.classList.contains('build-prev')) prevSlide();
    });
    carouselArea.appendChild(box);
    boxes.push(box);
});

function updateCarousel(speed = 1200) {
    carouselArea.classList.add('is-sliding');
    carouselArea.style.setProperty('--trans-speed', `${speed}ms`);

    slideTimeouts.forEach(clearTimeout);
    slideTimeouts = [];

    carouselArea.style.setProperty('--drag-x', `0px`);
    carouselArea.style.setProperty('--rot-x', `0deg`);
    carouselArea.style.setProperty('--rot-y', `0deg`);

    boxes.forEach((box, i) => {
        box.className = 'build-3d-box';
        const prevIndex = (currentIndex - 1 + 4) % 4;
        if (i === currentIndex) box.classList.add('build-active');
        else if (i === prevIndex) box.classList.add('build-prev');
        else box.classList.add('build-hidden');
    });

    let textFadeSpeed = Math.max(50, Math.min(250, speed * 0.4));
    infoPanel.style.transitionDuration = `${textFadeSpeed}ms`;
    infoPanel.classList.add('updating');

    slideTimeouts.push(setTimeout(() => {
        const currentData = buildsData[currentIndex];
        elTitle.textContent = currentData.title;
        elSubtitle.textContent = currentData.subtitle;
        elDesc.textContent = currentData.desc;
        elPrice.textContent = currentData.price;
        infoPanel.classList.remove('updating');
    }, textFadeSpeed));

    slideTimeouts.push(setTimeout(() => {
        if (!isIntroPlaying) carouselArea.classList.remove('is-sliding');
    }, speed));
}

function prevSlide() { if(isIntroPlaying) return; currentIndex = (currentIndex - 1 + 4) % 4; updateCarousel(); }
function nextSlide() { if(isIntroPlaying) return; currentIndex = (currentIndex + 1) % 4; updateCarousel(); }

updateCarousel(0);

async function playIntro() {
    const introSpeeds = [ 250, 450, 650, 850 ];
    await new Promise(r => setTimeout(r, 50));
    for (let speed of introSpeeds) {
        currentIndex = (currentIndex + 1) % 4;
        updateCarousel(speed);
        await new Promise(r => setTimeout(r, speed));
    }
    isIntroPlaying = false;
    carouselArea.classList.remove('is-sliding');
    carouselArea.style.setProperty('--trans-speed', `1.2s`);
}
playIntro();

// Свайпы мышью
let isDragging = false, startX = 0, dragX = 0;
let activeBoxNode = null;

function dragStart(e) {
    if (isIntroPlaying) return;
    const targetBox = e.target.closest('.build-3d-box');
    if (!targetBox || !targetBox.classList.contains('build-active')) return;
    if (carouselArea.classList.contains('is-sliding')) return;

    e.preventDefault();
    isDragging = true;
    activeBoxNode = targetBox;
    startX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    activeBoxNode.style.transition = 'none';
    carouselArea.classList.add('is-dragging');
}

function dragMove(e) {
    if (!isDragging || !activeBoxNode) return;
    let currentX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    dragX = currentX - startX;
    carouselArea.style.setProperty('--drag-x', `${dragX}px`);
    carouselArea.style.setProperty('--rot-y', `${dragX / 10}deg`);
    carouselArea.style.setProperty('--rot-x', `0deg`);
}

function dragEnd(e) {
    if (!isDragging || !activeBoxNode) return;
    isDragging = false;
    carouselArea.classList.remove('is-dragging');
    activeBoxNode.style.transition = '';
    activeBoxNode = null;

    if (dragX < -120) nextSlide();
    else if (dragX > 120) prevSlide();
    else {
        carouselArea.classList.add('is-sliding');
        carouselArea.style.setProperty('--drag-x', `0px`);
        carouselArea.style.setProperty('--rot-y', `0deg`);
        setTimeout(() => { carouselArea.classList.remove('is-sliding'); }, 1200);
    }
    dragX = 0;
}

window.addEventListener('mousedown', dragStart);
window.addEventListener('mousemove', dragMove);
window.addEventListener('mouseup', dragEnd);
window.addEventListener('touchstart', dragStart, {passive: false});
window.addEventListener('touchmove', dragMove, {passive: true});
window.addEventListener('touchend', dragEnd);

carouselArea.addEventListener('mousemove', (e) => {
    if (isIntroPlaying || isDragging || carouselArea.classList.contains('is-sliding')) return;
    const activeBox = document.querySelector('.build-active');
    if (!activeBox) return;

    const rect = carouselArea.getBoundingClientRect();
    const centerX = rect.left + (rect.width / 2) + 120;
    const centerY = rect.top + (rect.height / 2);
    const x = e.clientX - centerX;
    const y = e.clientY - centerY;

    carouselArea.style.setProperty('--rot-y', `${x / 30}deg`);
    carouselArea.style.setProperty('--rot-x', `${-y / 30}deg`);
});

// ================= ЛОГИКА КАТАЛОГА СБОРОК И ТУЛТИПА =================
const catalogGrid = document.getElementById('catalog-grid');
const tooltip = document.getElementById('specs-tooltip');
const ttName = document.getElementById('tt-name');
const ttCpu = document.getElementById('tt-cpu');
const ttGpu = document.getElementById('tt-gpu');
const ttRam = document.getElementById('tt-ram');
const ttSsd = document.getElementById('tt-ssd');

buildsData.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'catalog-card';
    card.innerHTML = `
        <img src="${item.img}" alt="${item.title}">
        <div class="card-info">
            <div class="card-title">${item.title}</div>
            <div class="card-price">${item.price}</div>
        </div>
    `;

    card.addEventListener('mouseenter', () => {
        ttName.textContent = item.title;
        ttCpu.textContent = item.specs.cpu;
        ttGpu.textContent = item.specs.gpu;
        ttRam.textContent = item.specs.ram;
        ttSsd.textContent = item.specs.ssd;
        tooltip.style.opacity = '1';
    });

    card.addEventListener('mousemove', (e) => {
        let x = e.clientX + 20;
        let y = e.clientY + 20;
        const ttRect = tooltip.getBoundingClientRect();

        if (x + ttRect.width > window.innerWidth) x = e.clientX - ttRect.width - 20;
        if (y + ttRect.height > window.innerHeight) y = e.clientY - ttRect.height - 20;

        tooltip.style.left = `${x}px`;
        tooltip.style.top = `${y}px`;
    });

    card.addEventListener('mouseleave', () => { tooltip.style.opacity = '0'; });
    catalogGrid.appendChild(card);
});

// ================= АНИМАЦИЯ КАРТОЧЕК ПРИ СКРОЛЛЕ =================
const scrollObserver = new IntersectionObserver((entries) => {
    let delay = 0;
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('is-visible');
            }, delay);
            delay += 150;
            scrollObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

scrollObserver.observe(document.getElementById('catalog-header'));
document.querySelectorAll('.catalog-card').forEach(card => {
    scrollObserver.observe(card);
});