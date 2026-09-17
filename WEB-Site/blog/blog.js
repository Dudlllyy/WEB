// Анимация 120 пылинок для заполнения всей длины страницы
const particlesContainer = document.getElementById('particles-container');
for (let i = 0; i < 120; i++) {
    let p = document.createElement('div'); p.classList.add('particle');
    p.style.width = p.style.height = `${Math.random() * 1.5 + 1}px`;
    p.style.left = `${Math.random() * 100}%`; p.style.top = `${Math.random() * 100}%`;
    p.style.animation = `drift ${Math.random() * 20 + 15}s linear ${Math.random() * 10}s infinite`;
    particlesContainer.appendChild(p);
}

// База данных постов
const blogPosts = [
    {
        title: "Monochrome Glass на фестивале: мощные игровые ПК на площадке",
        desc: "Мы стали технологическим партнером фестиваля игровой культуры и обеспечили площадку профессиональной игровой инфраструктурой.",
        img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2670&auto=format&fit=crop",
        date: "20 мая 2026"
    },
    {
        title: "Мы — технологический партнёр GAMEDNU 2026",
        desc: "Наши системы были выбраны в качестве основного оборудования для крупнейшего киберспортивного турнира этого года.",
        img: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?q=80&w=2670&auto=format&fit=crop",
        date: "28 апреля 2026"
    },
    {
        title: "Это было легендарно: как мы покорили DreamBig Fest",
        desc: "Прошедший выходной на DreamBig Fest выдался по-настоящему жарким: эпицентром событий стал наш фирменный стенд.",
        img: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2671&auto=format&fit=crop",
        date: "14 апреля 2026"
    },
    {
        title: "Релиз Echoes of Elysium в раннем доступе",
        desc: "Состоялся выход долгожданной игры. Узнайте подробности о геймплее и системных требованиях от экспертов Monochrome Glass.",
        img: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2670&auto=format&fit=crop",
        date: "27 января 2026"
    },
    {
        title: "NVIDIA представила платформу CUDA-Q для квантовых вычислений",
        desc: "NVIDIA анонсировала гибридную платформу для интеграции CPU и квантовых процессоров. Узнайте, как это изменит будущее систем.",
        img: "https://images.unsplash.com/photo-1620803513374-1262d4778546?q=80&w=2574&auto=format&fit=crop",
        date: "27 января 2026"
    },
    {
        title: "Intel анонсировала HEDT-процессоры Xeon 600",
        desc: "Intel представила линейку процессоров Xeon 600 для рабочих станций. Узнайте о возможностях новых чипов в нашей подробной статье.",
        img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=2670&auto=format&fit=crop",
        date: "27 января 2026"
    }
];

// Генерация карточек
const blogGrid = document.getElementById('blog-grid');

blogPosts.forEach((post) => {
    const card = document.createElement('div');
    card.className = 'blog-card';
    card.innerHTML = `
        <div class="card-img-wrapper">
            <img src="${post.img}" alt="${post.title}">
        </div>
        <div class="card-content">
            <div class="card-title">${post.title}</div>
            <div class="card-desc">${post.desc}</div>
            <div class="card-meta">
                <div class="meta-date">${post.date}</div>
            </div>
        </div>
    `;
    blogGrid.appendChild(card);
});

// ================= АНИМАЦИЯ КАРТОЧЕК ПРИ СКРОЛЛЕ =================
const scrollObserver = new IntersectionObserver((entries) => {
    let delay = 0;
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('is-visible');
            }, delay);
            delay += 150; // Каскадная задержка
            scrollObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

// Наблюдаем за всеми карточками
document.querySelectorAll('.blog-card').forEach(card => {
    scrollObserver.observe(card);
});