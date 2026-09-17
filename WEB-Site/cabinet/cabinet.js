// --- 1. ПЫЛИНКИ ---
const particlesContainer = document.getElementById('particles-container');
for (let i = 0; i < 120; i++) {
    let p = document.createElement('div'); p.classList.add('particle');
    p.style.width = p.style.height = `${Math.random() * 1.5 + 1}px`;
    p.style.left = `${Math.random() * 100}%`; p.style.top = `${Math.random() * 100}%`;
    p.style.animation = `drift ${Math.random() * 20 + 15}s linear ${Math.random() * 10}s infinite`;
    particlesContainer.appendChild(p);
}

// --- 2. 3D НАКЛОН ---
const bentoCards = document.querySelectorAll('.bento-item, .profile-card');
bentoCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
});

// ================= АВТОНОМНАЯ (MOCK) АВТОРИЗАЦИЯ =================
const authModal = document.getElementById('auth-modal');

function switchAuthTab(tab) {
    const tabs = document.querySelectorAll('.auth-tab');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    tabs.forEach(t => t.classList.remove('active'));
    if (tab === 'login') {
        tabs[0].classList.add('active');
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
    } else {
        tabs[1].classList.add('active');
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
    }
}

// Логин (Проверка guest / guest)
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();
    const errorDiv = document.getElementById('login-error');
    errorDiv.textContent = "";

    if (email.toLowerCase().includes('guest') && password === 'guest') {
        const fakeUser = {
            username: "Guest Tester",
            role: "Tester / VIP",
            orderName: "Сборка #1 Guest Edition",
            orderStatus: "Идет стресс-тестирование (Mock)",
            progress: 75
        };
        localStorage.setItem('mock_user', JSON.stringify(fakeUser));
        authModal.classList.remove('active');
        loadUserProfile();
    } else {
        errorDiv.textContent = "Неверные данные! Используйте логин и пароль: guest";
    }
}

// Регистрация (Любые данные сохраняются в память браузера)
function handleRegister(event) {
    event.preventDefault();
    const username = document.getElementById('reg-username').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const errorDiv = document.getElementById('reg-error');
    errorDiv.textContent = "";

    const fakeUser = {
        username: username || "Новый клиент",
        role: "Client",
        orderName: "Кастомная сборка #2026",
        orderStatus: "Комплектация заказа",
        progress: 30
    };

    localStorage.setItem('mock_user', JSON.stringify(fakeUser));
    authModal.classList.remove('active');
    loadUserProfile();
}

function logout() {
    localStorage.removeItem('mock_user');
    authModal.classList.add('active');
    document.getElementById('user-display-name').textContent = ".....";
}

function loadUserProfile() {
    const savedUser = localStorage.getItem('mock_user');
    if (!savedUser) {
        authModal.classList.add('active');
        return;
    }

    try {
        const user = JSON.parse(savedUser);
        document.getElementById('user-display-name').textContent = user.username;
        document.getElementById('user-display-role').textContent = user.role;
        document.getElementById('order-display-name').textContent = user.orderName;
        document.getElementById('order-display-desc').textContent = user.orderStatus;
        document.getElementById('order-display-progress').style.width = `${user.progress}%`;
    } catch (err) {
        logout();
    }
}

// ================= ЭФФЕКТ СКАНИРОВАНИЯ =================
document.addEventListener("DOMContentLoaded", () => {
    loadUserProfile();

    const osSpec = document.getElementById('spec-os');
    const gpuSpec = document.getElementById('spec-gpu');
    const cpuSpec = document.getElementById('spec-cpu');
    const ramSpec = document.getElementById('spec-ram');
    const scanStatus = document.getElementById('scan-status');

    let osName = 'Неизвестная ОС';
    const ua = window.navigator.userAgent;
    if (ua.indexOf("Windows NT 10.0") !== -1) osName = "Windows 10 / 11";
    else if (ua.indexOf("Windows NT 6.3") !== -1) osName = "Windows 8.1";
    else if (ua.indexOf("Mac OS X") !== -1) osName = "macOS";
    else if (ua.indexOf("Linux") !== -1) osName = "Linux";

    let gpuName = 'Недоступно (Скрыто браузером)';
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (gl) {
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            if (debugInfo) {
                gpuName = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                gpuName = gpuName.replace('ANGLE (', '').split(' Direct3D')[0].split(' vs_')[0];
                if (gpuName.endsWith(')')) gpuName = gpuName.slice(0, -1);
            }
        }
    } catch (e) {}

    const cpuCores = navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency} потоков` : 'Скрыто';
    const ramSize = navigator.deviceMemory ? `~ ${navigator.deviceMemory} GB` : 'Скрыто';

    function typeWriterEffect(element, text, speed = 30) {
        element.textContent = '';
        let i = 0;
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }

    setTimeout(() => { typeWriterEffect(osSpec, osName); }, 800);
    setTimeout(() => { typeWriterEffect(cpuSpec, cpuCores); }, 1400);
    setTimeout(() => { typeWriterEffect(ramSpec, ramSize); }, 2000);
    setTimeout(() => {
        typeWriterEffect(gpuSpec, gpuName);
        scanStatus.textContent = "✔ Синхронизировано (Mock)";
        scanStatus.style.color = "rgba(255,255,255,0.4)";
        scanStatus.style.animation = "none";
    }, 2800);
});