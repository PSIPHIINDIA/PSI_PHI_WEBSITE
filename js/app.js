/* ==========================================
   App Entry Point — PSI PHI INDIA Website
   Multi-page (static) site — no client-side router.
   ========================================== */

(function() {
    'use strict';

    // Mobile menu toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // Per-page initialisation
    function initPage() {
        if (window.scrollReveal) window.scrollReveal.observe();
        if (window.statsCounter) window.statsCounter.init();
        initContactForm();
    }

    function initContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        // -------------------------------------------------------
        // FORMSPREE: form submissions are sent to vikas@psiphi.in
        // via this endpoint. Replace the ID to point elsewhere.
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

        // Floating label behaviour
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

            if (input.value) {
                input.closest('.form-group')?.classList.add('filled');
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPage);
    } else {
        initPage();
    }

})();
