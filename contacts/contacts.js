// Анимация 120 пылинок (как на главной)
const particlesContainer = document.getElementById('particles-container');
for (let i = 0; i < 120; i++) {
    let p = document.createElement('div'); p.classList.add('particle');
    p.style.width = p.style.height = `${Math.random() * 1.5 + 1}px`;
    p.style.left = `${Math.random() * 100}%`; p.style.top = `${Math.random() * 100}%`;
    p.style.animation = `drift ${Math.random() * 20 + 15}s linear ${Math.random() * 10}s infinite`;
    particlesContainer.appendChild(p);
}

// Логика переключения экранов
const mainCards = document.getElementById('main-cards');
const pageTitle = document.getElementById('page-title');
const backBtn = document.getElementById('back-btn');
const allViews = document.querySelectorAll('.detail-view');

function openView(viewId) {
    mainCards.classList.add('hidden');
    pageTitle.classList.add('hidden');

    setTimeout(() => {
        document.getElementById(viewId).classList.add('active');
        backBtn.classList.add('visible');
    }, 300);
}

function closeAllViews() {
    allViews.forEach(view => view.classList.remove('active'));
    backBtn.classList.remove('visible');

    setTimeout(() => {
        mainCards.classList.remove('hidden');
        pageTitle.classList.remove('hidden');
    }, 400);
}