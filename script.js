// Theme Switcher
const themeSwitch = document.getElementById('themeSwitch');
const html = document.documentElement;

// Check for saved theme preference, otherwise use dark mode (default)
const currentTheme = localStorage.getItem('theme') || 'dark';
html.classList.add(`${currentTheme}-mode`);
themeSwitch.checked = currentTheme === 'light'; // Unchecked for dark mode

// Theme switch handler
themeSwitch.addEventListener('change', () => {
    const isDark = html.classList.contains('dark-mode');
    if (themeSwitch.checked && isDark) {
        html.classList.replace('dark-mode', 'light-mode');
        localStorage.setItem('theme', 'light');
    } else if (!themeSwitch.checked && !isDark) {
        html.classList.replace('light-mode', 'dark-mode');
        localStorage.setItem('theme', 'dark');
    }
});

// Scroll arrow functionality
const dotContainer = document.querySelector('.dot-container');
const scrollArrow = document.querySelector('.scroll-arrow');
let hasScrolled = false;

function handleScroll() {
    if (!hasScrolled && window.scrollY > 50) {
        hasScrolled = true;
        dotContainer.classList.add('visible');
        scrollArrow.classList.add('hidden');
    } else if (!hasScrolled) {
        dotContainer.classList.remove('visible');
    }
}

window.addEventListener('scroll', handleScroll);

// Scroll to content when arrow is clicked
scrollArrow.addEventListener('click', () => {
    const infoSection = document.querySelector('.info-columns');
    infoSection.scrollIntoView({ behavior: 'smooth' });
});

// Slideshow functionality
let slideIndex = 0;
let slideTimeout;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');

function showSlide(n) {
    clearTimeout(slideTimeout);
    
    if (n >= slides.length) slideIndex = 0;
    if (n < 0) slideIndex = slides.length - 1;

    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    slides[slideIndex].classList.add('active');
    dots[slideIndex].classList.add('active');

    slideTimeout = setTimeout(() => showSlide(slideIndex + 1), 5000);
}

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        slideIndex = index;
        showSlide(slideIndex);
    });
});

showSlide(slideIndex);

// Mobile Navigation
const navSlide = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    burger.addEventListener('click', () => {
        // Toggle Nav
        nav.classList.toggle('nav-active');

        // Animate Links
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });

        // Burger Animation
        burger.classList.toggle('toggle');
    });
}

navSlide();

// Stats Animation
function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        // Scale duration based on target number (larger numbers take longer)
        const duration = Math.min(1000 + (target / 10) * 20, 2000);
        const startTime = performance.now();
        const startValue = 0;
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Changed to easeOutExpo for snappier end
            const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            
            // Calculate current value with easing
            const currentValue = Math.floor(startValue + (target - startValue) * easeOutExpo);
            
            stat.textContent = currentValue;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        
        // Add a small random delay to start each animation
        setTimeout(() => {
            requestAnimationFrame(update);
        }, Math.random() * 200);
    });
}

// Intersection Observer for triggering animation when in view
const statsSection = document.querySelector('.stats-section');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateStats();
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.2
});

if (statsSection) {
    observer.observe(statsSection);
}
