/* ==========================================
   Animations — PSI PHI INDIA Website
   ========================================== */

/* ---------- Scroll Reveal ---------- */
class ScrollReveal {
    constructor() {
        this.observer = null;
        this.init();
    }

    init() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    // Don't unobserve — keep for re-navigation
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
    }

    observe() {
        // Reset and re-observe all scroll-reveal elements
        document.querySelectorAll('.scroll-reveal').forEach(el => {
            el.classList.remove('revealed');
            this.observer.observe(el);
        });

        // Immediately reveal elements already in viewport
        setTimeout(() => {
            document.querySelectorAll('.scroll-reveal').forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight * 0.95) {
                    el.classList.add('revealed');
                }
            });
        }, 150);

        // Safety fallback — reveal ALL unrevealed elements after 1.5s
        // Prevents content staying invisible if IntersectionObserver fails
        setTimeout(() => {
            document.querySelectorAll('.scroll-reveal:not(.revealed)').forEach(el => {
                el.classList.add('revealed');
            });
        }, 1500);
    }

    disconnect() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}

/* ---------- Stats Counter ---------- */
class StatsCounter {
    constructor() {
        this.observed = false;
    }

    init() {
        this.observed = false;
        const statsSection = document.getElementById('statsSection');
        if (!statsSection) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.observed) {
                    this.observed = true;
                    this.animateCounters();
                    observer.disconnect();
                }
            });
        }, { threshold: 0.3 });

        observer.observe(statsSection);
    }

    animateCounters() {
        document.querySelectorAll('.stat-number').forEach(counter => {
            const target = parseInt(counter.dataset.target);
            const duration = 2000; // ms
            const startTime = performance.now();

            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Ease out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = Math.round(eased * target);
                
                counter.textContent = current.toLocaleString();

                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };

            requestAnimationFrame(animate);
        });
    }
}

/* ---------- Navbar Scroll Effect ---------- */
class NavbarEffect {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.lastScroll = 0;
        this.init();
    }

    init() {
        if (!this.navbar) return;

        window.addEventListener('scroll', () => {
            const currentScroll = window.scrollY;
            
            if (currentScroll > 50) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }

            this.lastScroll = currentScroll;
        }, { passive: true });
    }
}

/* ---------- Smooth Page Links ---------- */
class PageLinks {
    constructor() {
        this.init();
    }

    init() {
        // Handle all clicks on elements with data-page attribute
        document.addEventListener('click', (e) => {
            const link = e.target.closest('[data-page]');
            if (link) {
                e.preventDefault();
                const pageName = link.dataset.page;
                if (window.router) {
                    window.router.navigate(pageName);
                }
            }
        });
    }
}

// Create global instances
window.scrollReveal = new ScrollReveal();
window.statsCounter = new StatsCounter();
window.navbarEffect = new NavbarEffect();
window.pageLinks = new PageLinks();
