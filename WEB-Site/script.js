// --- 1. ПЫЛИНКИ ---
const particlesContainer = document.getElementById('particles-container');
for (let i = 0; i < 120; i++) {
    let p = document.createElement('div'); p.classList.add('particle');
    p.style.width = p.style.height = `${Math.random() * 1.5 + 1}px`;

    p.style.left = `${Math.random() * 100}%`;
    p.style.top = `${Math.random() * 100}%`;

    p.style.animation = `drift ${Math.random() * 20 + 15}s linear ${Math.random() * 10}s infinite`;
    particlesContainer.appendChild(p);
}

// --- 2. КАРУСЕЛИ ВЕРХНЯЯ (СНЯТА ЖЕСТКАЯ БЛОКИРОВКА АНИМАЦИИ) ---
const cards = Array.from(document.querySelectorAll('.card'));
const carousel = document.querySelector('.carousel-section');
const titleEl = document.querySelector('.text-section h1');
const descEl = document.querySelector('.text-section p');

let isDrag = false, startX = 0, dragX = 0, activeC = null;
let hasDragged = false;
let textUpdateTimer = null;

function updateCards() {
    cards.forEach((c, i) => {
        c.className = 'card';
        if (i === 0) c.classList.add('prev'); else if (i === 1) c.classList.add('active'); else if (i === 2) c.classList.add('next'); else c.classList.add('hidden');
        c.style.setProperty('--drag-x', '0px'); c.style.setProperty('--drag-deg', '0deg');
    });
    const cAct = cards[1]; if (!cAct) return;

    titleEl.style.opacity = 0; descEl.style.opacity = 0;

    clearTimeout(textUpdateTimer);
    textUpdateTimer = setTimeout(() => {
        titleEl.innerHTML = cAct.getAttribute('data-title') || "";
        descEl.innerHTML = cAct.getAttribute('data-desc') || "";
        titleEl.style.opacity = 1;
        descEl.style.opacity = 1;
    }, 150);
}

function moveR() { cards.push(cards.shift()); updateCards(); }
function moveL() { cards.unshift(cards.pop()); updateCards(); }

function dragStart(e) {
    activeC = cards.find(c => c.classList.contains('active'));
    if (!activeC) return;
    isDrag = true;
    hasDragged = false;
    carousel.style.cursor = 'grabbing';
    startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    activeC.classList.add('no-transition');
}

function dragMove(e) {
    if (!isDrag || !activeC) return;
    dragX = (e.type.includes('mouse') ? e.clientX : e.touches[0].clientX) - startX;
    if (Math.abs(dragX) > 5) hasDragged = true;
    activeC.style.setProperty('--drag-x', `${dragX}px`);
    activeC.style.setProperty('--drag-deg', `${dragX * 0.10}deg`);
}

function dragEnd() {
    if (!isDrag || !activeC) return;
    isDrag = false;
    carousel.style.cursor = 'grab';
    activeC.classList.remove('no-transition');
    if (dragX > 120) moveL();
    else if (dragX < -120) moveR();
    else updateCards();
    dragX = 0;
    activeC = null;
}

carousel.addEventListener('mousedown', dragStart); window.addEventListener('mousemove', dragMove); window.addEventListener('mouseup', dragEnd);
carousel.addEventListener('touchstart', dragStart, {passive: true}); window.addEventListener('touchmove', dragMove, {passive: true}); window.addEventListener('touchend', dragEnd);

cards.forEach(card => {
    card.addEventListener('click', () => {
        if (hasDragged) return;

        if (card.classList.contains('next')) {
            moveR();
        } else if (card.classList.contains('prev')) {
            moveL();
        }
    });
});

updateCards();

// --- 3. GPU СЛАЙДЕР ---
const gpuCards = Array.from(document.querySelectorAll('.gpu-card'));
const gpuImg = document.getElementById('gpu-img');
const gpuList = ['pictures/GPU_1.png', 'pictures/GPU_2.png', 'pictures/GPU_3.png'];
let gpuIdx = 0, gpuTimer = null;
gpuImg.src = gpuList[gpuIdx];

function updateGpu() { gpuCards.forEach((c, i) => { c.classList.remove('active-card', 'bg1-card', 'bg2-card'); if (i === 0) c.classList.add('active-card'); else if (i === 1) c.classList.add('bg1-card'); else if (i === 2) c.classList.add('bg2-card'); }); }
function changeGpuImg() {
    gpuImg.style.opacity = 0; gpuImg.style.transform = 'translate3d(0, 20px, 0) scale(0.95)';
    setTimeout(() => {
        gpuImg.src = gpuList[gpuIdx];
        gpuImg.style.opacity = 1;
        gpuImg.style.transform = 'translate3d(0, 0, 0) scale(1)';
    }, 400);
}
function nextGpu() { gpuCards.push(gpuCards.shift()); gpuIdx = (gpuIdx + 1) % gpuList.length; updateGpu(); changeGpuImg(); resetGpuTimer(); }
function prevGpu() { gpuCards.unshift(gpuCards.pop()); gpuIdx = (gpuIdx - 1 + gpuList.length) % gpuList.length; updateGpu(); changeGpuImg(); resetGpuTimer(); }
function startGpuTimer() { gpuTimer = setInterval(nextGpu, 60000); }
function resetGpuTimer() { clearInterval(gpuTimer); startGpuTimer(); }
startGpuTimer();

// --- 4. CPU СЛАЙДЕР ---
const cpuCards = Array.from(document.querySelectorAll('.cpu-card'));
const cpuImg = document.getElementById('cpu-img');
const themeIntel = document.getElementById('theme-intel');
const themeRyzen = document.getElementById('theme-ryzen');
const cpuList = ['pictures/CPU_1.png', 'pictures/CPU_2.png'];
let cpuIdx = 0, cpuTimer = null;
cpuImg.src = cpuList[cpuIdx];

function updateCpu() { cpuCards.forEach((c, i) => { c.classList.remove('active-card'); if (i === cpuIdx) c.classList.add('active-card'); }); checkTheme(); }
function changeCpuImg() {
    cpuImg.style.opacity = 0; cpuImg.style.transform = 'translate3d(0, 20px, 0) scale(0.95)';
    setTimeout(() => {
        cpuImg.src = cpuList[cpuIdx];
        cpuImg.style.opacity = 1;
        cpuImg.style.transform = 'translate3d(0, 0, 0) scale(1)';
    }, 400);
}
function nextCpu() { cpuIdx = (cpuIdx === 0) ? 1 : 0; updateCpu(); changeCpuImg(); resetCpuTimer(); }
function prevCpu() { cpuIdx = (cpuIdx === 0) ? 1 : 0; updateCpu(); changeCpuImg(); resetCpuTimer(); }
function startCpuTimer() { cpuTimer = setInterval(nextCpu, 60000); }
function resetCpuTimer() { clearInterval(cpuTimer); startCpuTimer(); }
startCpuTimer();

// --- 5. OBSERVER (ЦВЕТ ФОНА) ---
let isCpuVisible = false;
const cpuSection = document.getElementById('cpu-section');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) { isCpuVisible = true; checkTheme(); }
        else { isCpuVisible = false; themeIntel.classList.remove('active-theme'); themeRyzen.classList.remove('active-theme'); }
    });
}, { threshold: 0.4 });
observer.observe(cpuSection);

function checkTheme() {
    if (!isCpuVisible) return;
    themeIntel.classList.remove('active-theme'); themeRyzen.classList.remove('active-theme');
    const currentBrand = cpuCards[cpuIdx].getAttribute('data-brand');
    if (currentBrand === 'intel') themeIntel.classList.add('active-theme');
    else if (currentBrand === 'ryzen') themeRyzen.classList.add('active-theme');
}

// --- 6. ЛОГИКА RAM ---
let selectedRamType = null;
let selectedRamSize = null;

const typeBtns = document.querySelectorAll('#ram-type-row .filter-btn');
const sizeRow = document.getElementById('ram-size-row');
const sizeBtns = document.querySelectorAll('#ram-size-row .filter-btn');
const ramResultsBoard = document.getElementById('ram-results-board');
const perfectGrid = document.getElementById('perfect-grid');
const partialSlider = document.getElementById('partial-slider');

const tooltip = document.getElementById('custom-tooltip');
const ttTitle = document.getElementById('tt-title');
const ttDesc = document.getElementById('tt-desc');
let isTooltipVisible = false;

document.addEventListener('mousemove', (e) => {
    if(isTooltipVisible) {
        tooltip.style.transform = `translate3d(${e.clientX + 20}px, ${e.clientY + 20}px, 0)`;
    }
});

const ramImg1 = 'pictures/RAM.png';
const ramImg2 = 'pictures/RAM.png';
const ramImg3 = 'pictures/RAM.png';
const ramImg4 = 'pictures/RAM.png';
const ramImg5 = 'pictures/RAM.png';

const ramDatabase = [
    { type: 'DDR4', size: '16gb', name: 'Fury Beast 16GB', desc: 'Отличная игровая память с радиатором.', img: ramImg1 },
    { type: 'DDR4', size: '16gb', name: 'Corsair Vengeance', desc: 'Надежность и строгий дизайн для любых задач.', img: ramImg2 },
    { type: 'DDR4', size: '16gb', name: 'G.Skill Ripjaws', desc: 'Высокие частоты и низкие тайминги.', img: ramImg3 },
    { type: 'DDR4', size: '32gb', name: 'Fury Beast 32GB', desc: 'Для тяжелых задач и рендера.', img: ramImg4 },
    { type: 'DDR5', size: '32gb', name: 'Dominator Platinum', desc: 'Премиальная память нового поколения.', img: ramImg5 },
    { type: 'DDR3', size: '8gb',  name: 'HyperX Fury', desc: 'Классика для старых систем.', img: ramImg1 },
    { type: 'DDR5', size: '64gb', name: 'G.Skill Trident Z5', desc: 'Ультимативная мощь для энтузиастов.', img: ramImg3 },
    { type: 'DDR4', size: '8gb',  name: 'Crucial Ballistix', desc: 'Базовое решение для бюджетных сборок.', img: ramImg2 },
];

typeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        typeBtns.forEach(b => b.classList.remove('active-btn'));
        btn.classList.add('active-btn');
        selectedRamType = btn.getAttribute('data-type');
        sizeRow.classList.remove('hidden-row');
        if (selectedRamSize) renderRamResults();
    });
});

sizeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        sizeBtns.forEach(b => b.classList.remove('active-btn'));
        btn.classList.add('active-btn');
        selectedRamSize = btn.getAttribute('data-size');
        ramResultsBoard.classList.remove('hidden-results');
        renderRamResults();
    });
});

function renderRamResults() {
    perfectGrid.innerHTML = '';
    partialSlider.innerHTML = '';

    const perfectMatches = ramDatabase.filter(ram => ram.type === selectedRamType && ram.size === selectedRamSize);
    const partialMatches = ramDatabase.filter(ram => (ram.type === selectedRamType || ram.size === selectedRamSize) && !(ram.type === selectedRamType && ram.size === selectedRamSize));

    if (perfectMatches.length === 0) {
        perfectGrid.innerHTML = '<p style="color: rgba(255,255,255,0.5);">Нет точных совпадений</p>';
    }

    perfectMatches.slice(0, 3).forEach(ram => {
        const el = document.createElement('div');
        el.className = 'ram-stick-wrapper';
        el.innerHTML = `<img src="${ram.img}" class="ram-stick-img" draggable="false">`;

        el.addEventListener('mouseenter', () => {
            ttTitle.textContent = ram.name;
            ttDesc.textContent = ram.desc;
            isTooltipVisible = true;
            tooltip.style.opacity = 1;
        });
        el.addEventListener('mouseleave', () => {
            isTooltipVisible = false;
            tooltip.style.opacity = 0;
        });

        perfectGrid.appendChild(el);
    });

    partialMatches.forEach(ram => {
        const el = document.createElement('div');
        el.className = 'partial-card';
        el.innerHTML = `<img src="${ram.img}" draggable="false">`;
        partialSlider.appendChild(el);
    });

    if(partialMatches.length === 0) {
        partialSlider.innerHTML = '<p style="color: rgba(255,255,255,0.5);">Нет похожих вариантов</p>';
    }
}

// --- ДРАГ-Н-ДРОП ДЛЯ НИЖНЕГО СЛАЙДЕРА RAM ---
let isDown = false;
let startPosX;
let scrollLeft;

partialSlider.addEventListener('mousedown', (e) => {
    isDown = true;
    startPosX = e.pageX - partialSlider.offsetLeft;
    scrollLeft = partialSlider.scrollLeft;
});
partialSlider.addEventListener('mouseleave', () => isDown = false);
partialSlider.addEventListener('mouseup', () => isDown = false);
partialSlider.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - partialSlider.offsetLeft;
    const walk = (x - startPosX) * 2;
    partialSlider.scrollLeft = scrollLeft - walk;
});