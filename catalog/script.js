// --- 1. ПЫЛИНКИ (РАСКИДЫВАЕМ ПО ВСЕЙ ВЫСОТЕ В %) ---
const particlesContainer = document.getElementById('particles-container');
for (let i = 0; i < 100; i++) { // Увеличили количество пылинок до 100
    let p = document.createElement('div'); p.classList.add('particle');
    p.style.width = p.style.height = `${Math.random() * 1.5 + 1}px`;

    // ВАЖНО: Теперь используем % вместо vw/vh, чтобы пылинки распределились по всей длине скролла
    p.style.left = `${Math.random() * 100}%`;
    p.style.top = `${Math.random() * 100}%`;

    p.style.animation = `drift ${Math.random() * 20 + 15}s linear ${Math.random() * 10}s infinite`;
    particlesContainer.appendChild(p);
}

// --- 2. АНИМАЦИЯ БУКВ ---
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

// --- 3. 3D НАКЛОН ---
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

// --- 4. МОДАЛЬНОЕ ОКНО ---
const modal = document.getElementById('modal');
const closeBtn = document.getElementById('close-btn');
const modalImg = document.getElementById('modal-img');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const modalPrice = document.getElementById('modal-price');

cards.forEach(card => {
    card.addEventListener('click', () => {
        const title = card.getAttribute('data-title');
        const desc = card.getAttribute('data-desc');
        const price = card.getAttribute('data-price');
        const imgSrc = card.querySelector('.card-img').src;

        modalImg.src = imgSrc;
        modalTitle.textContent = title;
        modalDesc.textContent = desc;
        modalPrice.textContent = price;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});