/* ========================================
   POXELBIT — Script Principal
   Particles, Scroll Effects, Interactions
   ======================================== */

// ============ PARTICLE SYSTEM ============
class ParticleSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 150 };
        this.resize();
        this.init();
        this.animate();

        window.addEventListener('resize', () => this.resize());
        this.canvas.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });
        this.canvas.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        this.particles = [];
        const count = Math.min(Math.floor((this.canvas.width * this.canvas.height) / 12000), 120);
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 0.5,
                speedX: (Math.random() - 0.5) * 0.8,
                speedY: (Math.random() - 0.5) * 0.8,
                opacity: Math.random() * 0.5 + 0.1
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach((p, i) => {
            // Move
            p.x += p.speedX;
            p.y += p.speedY;

            // Wrap
            if (p.x < 0) p.x = this.canvas.width;
            if (p.x > this.canvas.width) p.x = 0;
            if (p.y < 0) p.y = this.canvas.height;
            if (p.y > this.canvas.height) p.y = 0;

            // Mouse interaction
            if (this.mouse.x !== null) {
                const dx = p.x - this.mouse.x;
                const dy = p.y - this.mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < this.mouse.radius) {
                    const force = (this.mouse.radius - dist) / this.mouse.radius;
                    p.x += dx * force * 0.02;
                    p.y += dy * force * 0.02;
                }
            }

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(96, 165, 250, ${p.opacity})`;
            this.ctx.fill();

            // Draw connections
            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    const opacity = (1 - dist / 150) * 0.15;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = `rgba(6, 182, 212, ${opacity})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }
        });

        requestAnimationFrame(() => this.animate());
    }
}


// ============ TYPING EFFECT ============
class TypingEffect {
    constructor(elementId, words, speed = 100, pause = 2000) {
        this.element = document.getElementById(elementId);
        if (!this.element) return;
        this.words = words;
        this.speed = speed;
        this.pause = pause;
        this.wordIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.type();
    }

    type() {
        const currentWord = this.words[this.wordIndex];

        if (this.isDeleting) {
            this.charIndex--;
        } else {
            this.charIndex++;
        }

        this.element.textContent = currentWord.substring(0, this.charIndex);

        let typeSpeed = this.speed;

        if (this.isDeleting) {
            typeSpeed /= 2;
        }

        if (!this.isDeleting && this.charIndex === currentWord.length) {
            typeSpeed = this.pause;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.wordIndex = (this.wordIndex + 1) % this.words.length;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}


// ============ SCROLL REVEAL ============
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
        observer.observe(el);
    });
}


// ============ COUNTER ANIMATION ============
function initCounters() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-target'));
                const suffix = el.getAttribute('data-suffix') || '';
                const prefix = el.getAttribute('data-prefix') || '';
                const duration = 2000;
                const start = performance.now();

                function update(currentTime) {
                    const elapsed = currentTime - start;
                    const progress = Math.min(elapsed / duration, 1);

                    // Ease-out cubic
                    const eased = 1 - Math.pow(1 - progress, 3);
                    const current = Math.floor(eased * target);

                    el.textContent = prefix + current + suffix;

                    if (progress < 1) {
                        requestAnimationFrame(update);
                    } else {
                        el.textContent = prefix + target + suffix;
                    }
                }

                requestAnimationFrame(update);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-counter]').forEach(el => observer.observe(el));
}


// ============ NAVBAR SCROLL ============
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}


// ============ MOBILE MENU ============
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('open');
        document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('open');
            document.body.style.overflow = '';
        });
    });
}


// ============ SMOOTH SCROLL ============
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });
}


// ============ FAQ ACCORDION ============
function initFAQ() {
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            const isOpen = item.classList.contains('open');

            // Close all
            document.querySelectorAll('.faq-item').forEach(faq => faq.classList.remove('open'));

            // Open clicked if it wasn't open
            if (!isOpen) {
                item.classList.add('open');
            }
        });
    });
}


// ============ TESTIMONIAL CAROUSEL ============
function initTestimonials() {
    const track = document.querySelector('.testimonials-track');
    const dots = document.querySelectorAll('.testimonial-dots .dot');
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');
    if (!track) return;

    let current = 0;
    const slides = document.querySelectorAll('.testimonial-slide');
    const total = slides.length;
    let autoPlayInterval;

    function goTo(index) {
        current = ((index % total) + total) % total;
        track.style.transform = `translateX(-${current * 100}%)`;
        dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    function startAutoPlay() {
        autoPlayInterval = setInterval(() => goTo(current + 1), 5000);
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    if (prevBtn) prevBtn.addEventListener('click', () => { stopAutoPlay(); goTo(current - 1); startAutoPlay(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { stopAutoPlay(); goTo(current + 1); startAutoPlay(); });

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => { stopAutoPlay(); goTo(i); startAutoPlay(); });
    });

    startAutoPlay();
}


// ============ PARALLAX EFFECT ============
function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');

    function updateParallax() {
        const scrollY = window.pageYOffset;

        parallaxElements.forEach(el => {
            const speed = parseFloat(el.getAttribute('data-parallax')) || 0.5;
            const rect = el.getBoundingClientRect();
            const offset = (rect.top + scrollY) * speed;
            el.style.transform = `translateY(${scrollY * speed - offset}px)`;
        });
    }

    window.addEventListener('scroll', () => requestAnimationFrame(updateParallax));
}


// ============ ACTIVE NAV HIGHLIGHT ============
function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.style.color = '';
                    if (link.getAttribute('href') === `#${id}`) {
                        link.style.color = '#06B6D4';
                    }
                });
            }
        });
    }, { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' });

    sections.forEach(section => observer.observe(section));
}


// ============ INITIALIZATION ============
document.addEventListener('DOMContentLoaded', () => {
    // Particles
    new ParticleSystem('hero-canvas');

    // Typing Effect
    new TypingEffect('typing-target', [
        'Inteligencia Artificial',
        'Blockchain & Web3',
        'Agentes Virtuales',
        'Desarrollo Web',
        'Sistemas a Medida',
        'Transformación Digital'
    ], 80, 1800);

    // Initialize all modules
    initScrollReveal();
    initCounters();
    initNavbar();
    initMobileMenu();
    initSmoothScroll();
    initFAQ();
    initTestimonials();
    initParallax();
    initActiveNav();

    // Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});
