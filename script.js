/* ==========================================================================
   ShoKKo&Latte — поведение страницы
   1) шапка при скролле          5) появление блоков при прокрутке
   2) мобильное меню             6) подсветка активного пункта меню
   3) маска телефона             7) год в подвале
   4) отправка формы брони
   ========================================================================== */

/* Куда отправлять заявки.
   Оставьте пустым, если бэкенда нет: тогда после проверки формы откроется
   чат с менеджером в Telegram, и гость отправит заявку сам.
   Если у вас появится endpoint (например, вебхук бота в bot.py) — впишите
   его сюда, и заявка будет уходить обычным POST с JSON. */
const BOOKING_ENDPOINT = '';

/* Ссылка на менеджера для запасного сценария. */
const MANAGER_TELEGRAM = 'https://t.me/Jabby';

/* ------------------------------------------------------ 1) шапка при скролле */

const header = document.getElementById('siteHeader');

function syncHeader() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 24);
}

window.addEventListener('scroll', syncHeader, { passive: true });
syncHeader();

/* -------------------------------------------------------- 2) мобильное меню */

const burger = document.getElementById('burger');
const nav = document.getElementById('primaryNav');

function setNav(open) {
    if (!nav || !burger) return;
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
}

if (burger && nav) {
    burger.addEventListener('click', () => {
        setNav(!nav.classList.contains('is-open'));
    });

    nav.addEventListener('click', (event) => {
        if (event.target.closest('a')) setNav(false);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') setNav(false);
    });

    document.addEventListener('click', (event) => {
        if (!nav.classList.contains('is-open')) return;
        if (nav.contains(event.target) || burger.contains(event.target)) return;
        setNav(false);
    });
}

/* --------------------------------------------------------- 3) маска телефона */

const phoneInput = document.getElementById('bkPhone');

function formatPhone(raw) {
    let digits = raw.replace(/\D/g, '');

    if (digits.startsWith('8')) digits = '7' + digits.slice(1);
    if (!digits.startsWith('7')) digits = '7' + digits;
    digits = digits.slice(0, 11);

    const rest = digits.slice(1);
    let out = '+7';
    if (rest.length) out += ` (${rest.slice(0, 3)}`;
    if (rest.length >= 3) out += ') ' + rest.slice(3, 6);
    if (rest.length >= 6) out += '-' + rest.slice(6, 8);
    if (rest.length >= 8) out += '-' + rest.slice(8, 10);
    return out;
}

if (phoneInput) {
    phoneInput.addEventListener('input', () => {
        const atEnd = phoneInput.selectionStart === phoneInput.value.length;
        phoneInput.value = formatPhone(phoneInput.value);
        if (atEnd) phoneInput.setSelectionRange(phoneInput.value.length, phoneInput.value.length);
    });

    phoneInput.addEventListener('focus', () => {
        if (!phoneInput.value) phoneInput.value = '+7 (';
    });

    phoneInput.addEventListener('blur', () => {
        if (phoneInput.value.replace(/\D/g, '').length <= 1) phoneInput.value = '';
    });
}

/* ------------------------------------------------- 4) отправка формы брони */

const bookingForm = document.getElementById('bookingForm');
const formStatus = document.getElementById('formStatus');

function countDigits(value) {
    return (value.match(/\d/g) || []).length;
}

function setStatus(text, state) {
    if (!formStatus) return;
    formStatus.textContent = text;
    formStatus.classList.toggle('is-ok', state === 'ok');
    formStatus.classList.toggle('is-error', state === 'error');
}

if (bookingForm) {
    bookingForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const nameField = bookingForm.elements.name;
        const phoneField = bookingForm.elements.phone;
        const submitButton = bookingForm.querySelector('button[type="submit"]');

        nameField.removeAttribute('aria-invalid');
        phoneField.removeAttribute('aria-invalid');

        const name = nameField.value.trim();
        if (name.length < 2) {
            nameField.setAttribute('aria-invalid', 'true');
            setStatus('Пожалуйста, укажите имя', 'error');
            nameField.focus();
            return;
        }

        if (countDigits(phoneField.value) < 11) {
            phoneField.setAttribute('aria-invalid', 'true');
            setStatus('Проверьте номер телефона — нужно 11 цифр', 'error');
            phoneField.focus();
            return;
        }

        const payload = { name, phone: phoneField.value, page: location.href };

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Отправляем…';
        }

        try {
            if (BOOKING_ENDPOINT) {
                const response = await fetch(BOOKING_ENDPOINT, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
                if (!response.ok) throw new Error(`HTTP ${response.status}`);

                setStatus(`${name}, заявка принята! Перезвоним в течение 15 минут.`, 'ok');
                bookingForm.reset();
            } else {
                /* Бэкенда нет — передаём заявку менеджеру в Telegram. */
                const text = `Хочу забронировать столик.\nИмя: ${name}\nТелефон: ${phoneField.value}`;
                window.open(`${MANAGER_TELEGRAM}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
                setStatus(`${name}, откройте Telegram и отправьте готовое сообщение менеджеру.`, 'ok');
                bookingForm.reset();
            }
        } catch (error) {
            setStatus('Не удалось отправить заявку. Позвоните нам или напишите в Telegram.', 'error');
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = 'Отправить заявку';
            }
        }
    });
}

/* ------------------------------------------ 5) появление блоков при прокрутке */

const revealTargets = document.querySelectorAll(
    '.about-copy, .about-media, .booking, .feature, .menu-group, .promo-card, ' +
    '.gallery-item, .contacts-media, .contacts-info, .section-head'
);

if (revealTargets.length && 'IntersectionObserver' in window) {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!reduceMotion) {
        const groups = new Map();
        revealTargets.forEach((element) => {
            const parent = element.parentElement;
            const index = groups.get(parent) || 0;
            groups.set(parent, index + 1);
            element.classList.add('reveal');
            element.style.transitionDelay = `${Math.min(index, 5) * 70}ms`;
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

        revealTargets.forEach((element) => observer.observe(element));
    }
}

/* --------------------------------- 6) подсветка активного пункта навигации */

const navLinks = Array.from(document.querySelectorAll('.nav-list a[href^="#"]'));
const navSections = navLinks
    .map((link) => ({ link, section: document.querySelector(link.getAttribute('href')) }))
    .filter((item) => item.section);

function syncActiveNav() {
    if (!navSections.length) return;

    /* Активным считаем последний блок, который уже пересёк верхнюю треть экрана. */
    const line = window.scrollY + window.innerHeight * 0.3;
    let active = null;
    navSections.forEach((item) => {
        if (item.section.offsetTop <= line) active = item;
    });

    navSections.forEach((item) => {
        item.link.classList.toggle('is-active', item === active);
    });
}

window.addEventListener('scroll', syncActiveNav, { passive: true });
window.addEventListener('resize', syncActiveNav);
syncActiveNav();

/* ------------------------------------------------------------- 7) год в подвале */

const yearLabel = document.getElementById('year');
if (yearLabel) yearLabel.textContent = String(new Date().getFullYear());
