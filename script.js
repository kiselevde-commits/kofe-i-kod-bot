// Mobile menu toggle
const navLinks = document.querySelector('.nav-links');
const menuBtn = document.createElement('button');

menuBtn.className = 'mobile-menu-btn';
menuBtn.innerHTML = '<span></span><span></span><span></span>';
menuBtn.style.display = 'none';
menuBtn.style.background: none;
menuBtn.style.border: none;
menuBtn.style.cursor: pointer;
menuBtn.style.padding: 0.5rem;

const navContainer = document.querySelector('.nav-container');
navContainer.insertBefore(menuBtn, navLinks);

// Toggle mobile menu
menuBtn.addEventListener('click', () => {
    if (navLinks.style.display === 'flex' || navLinks.style.display === '') {
        navLinks.style.display = 'none';
    } else {
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top: 100%;
        navLinks.style.left: 0;
        navLinks.style.width: 100%;
        navLinks.style.background: rgba(255, 255, 255, 0.95);
        navLinks.style.gap: 2rem;
        navLinks.style.padding: 2rem;
    }
});

// Form submission
const contactForm = document.querySelector('.contact-form');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button');
    const originalText = btn.textContent;
    btn.textContent = 'Сообщение отправлено!';
    btn.style.background: #2E7D32;
    
    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background: var(--primary-color);
        contactForm.reset();
    }, 3000);
});

// Scroll reveal with Intersection Observer
const revealElements = document.querySelectorAll('.menu-card, .info-item, .form-group');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
        }
    });
}, { threshold: 0.1 });

revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    revealObserver.observe(el);
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background on scroll
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 1px 5px rgba(0, 0, 0, 0.02)';
    }
    
    lastScroll = currentScroll;
});

// Initialize map for location
document.addEventListener('DOMContentLoaded', () => {
    const locationBtns = document.querySelectorAll('a[href*="maps"]');
    locationBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const href = btn.getAttribute('href');
            if (href) {
                window.open(href, '_blank');
            }
        });
    });
});