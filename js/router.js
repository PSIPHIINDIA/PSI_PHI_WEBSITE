/* ==========================================
   SPA Router — PSI PHI INDIA Website
   ========================================== */

class Router {
    constructor() {
        this.routes = {};
        this.currentPage = null;
        this.appContainer = document.getElementById('app');
        this.isTransitioning = false;
    }

    addRoute(name, htmlPath) {
        this.routes[name] = {
            htmlPath: htmlPath,
            content: null,
            loaded: false
        };
    }

    async loadPage(pageName) {
        const route = this.routes[pageName];
        if (!route) return;

        if (!route.loaded) {
            try {
                const response = await fetch(route.htmlPath);
                if (!response.ok) throw new Error(`Failed to load ${route.htmlPath}`);
                route.content = await response.text();
                route.loaded = true;
            } catch (error) {
                console.error(`Error loading page: ${pageName}`, error);
                route.content = `<div class="page" style="min-height:60vh;display:flex;align-items:center;justify-content:center;padding-top:100px;"><h2>Page could not be loaded</h2></div>`;
                route.loaded = true;
            }
        }

        return route.content;
    }

    async navigate(pageName) {
        if (this.isTransitioning || pageName === this.currentPage) return;
        this.isTransitioning = true;

        // Update nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.dataset.page === pageName);
        });

        // Close mobile menu
        document.getElementById('navMenu')?.classList.remove('active');
        document.getElementById('navToggle')?.classList.remove('active');

        // Fade out current page
        const currentPageEl = this.appContainer.querySelector('.page.active');
        if (currentPageEl) {
            currentPageEl.classList.remove('visible');
            await this.wait(300);
        }

        // Load and insert new page
        const content = await this.loadPage(pageName);
        this.appContainer.innerHTML = content;

        // Activate new page
        const newPageEl = this.appContainer.querySelector('.page');
        if (newPageEl) {
            newPageEl.classList.add('active');
            // Force reflow
            newPageEl.offsetHeight;
            requestAnimationFrame(() => {
                newPageEl.classList.add('visible');
            });
        }

        this.currentPage = pageName;

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'instant' });

        // Initialize page-specific features
        this.initPageFeatures(pageName);

        // Initialize scroll reveal for new page
        if (window.scrollReveal) {
            window.scrollReveal.observe();
        }

        // Initialize stats counter if on home page
        if (pageName === 'home' && window.statsCounter) {
            window.statsCounter.init();
        }

        this.isTransitioning = false;

        // Update hash
        window.location.hash = pageName;
    }

    initPageFeatures(pageName) {
        if (pageName === 'contact') {
            this.initContactForm();
        }
    }

    initContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        // -------------------------------------------------------
        // FORMSPREE SETUP:
        // 1. Go to https://formspree.io and create a free account
        // 2. Create a new form for vikas@psiphi.in
        // 3. Replace YOUR_FORMSPREE_ID below with your form's ID
        //    (looks like: xyzabcde)
        // -------------------------------------------------------
        const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xnjryzea';

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Basic validation
            let valid = true;
            const requiredFields = form.querySelectorAll('[required]');
            requiredFields.forEach(field => {
                const group = field.closest('.form-group');
                if (!field.value.trim()) {
                    group?.classList.add('error');
                    valid = false;
                } else {
                    group?.classList.remove('error');
                }
            });
            if (!valid) return;

            const btn = form.querySelector('.submit-btn');
            if (!btn) return;

            btn.classList.add('loading');
            btn.disabled = true;

            try {
                const data = new FormData(form);
                const response = await fetch(FORMSPREE_ENDPOINT, {
                    method: 'POST',
                    body: data,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    btn.classList.remove('loading');
                    btn.classList.add('success');
                    setTimeout(() => {
                        btn.classList.remove('success');
                        btn.disabled = false;
                        form.reset();
                        form.querySelectorAll('.form-group').forEach(group => {
                            group.classList.remove('filled', 'error');
                        });
                    }, 2500);
                } else {
                    throw new Error('Server error');
                }
            } catch (err) {
                btn.classList.remove('loading');
                btn.disabled = false;
                alert('Sorry, there was a problem sending your message. Please email us directly at vikas@psiphi.in');
            }
        });

        // Floating label behavior
        form.querySelectorAll('.form-input, .form-textarea, .form-select').forEach(input => {
            input.addEventListener('focus', () => {
                input.closest('.form-group')?.classList.add('focused');
            });

            input.addEventListener('blur', () => {
                const group = input.closest('.form-group');
                group?.classList.remove('focused');
                if (input.value) {
                    group?.classList.add('filled');
                } else {
                    group?.classList.remove('filled');
                }
            });

            // Check initial state
            if (input.value) {
                input.closest('.form-group')?.classList.add('filled');
            }
        });
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Create global router instance
window.router = new Router();
