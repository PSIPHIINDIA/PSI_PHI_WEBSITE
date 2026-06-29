/* ==========================================
   App Entry Point — PSI PHI INDIA Website
   ========================================== */

(function() {
    'use strict';

    // Configure routes
    const router = window.router;
    router.addRoute('home', 'pages/home.html');
    router.addRoute('about', 'pages/about.html');
    router.addRoute('products', 'pages/products.html');
    router.addRoute('departments', 'pages/departments.html');
    router.addRoute('contact', 'pages/contact.html');

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

    // Determine initial page from hash
    function getInitialPage() {
        const hash = window.location.hash.replace('#', '');
        const validPages = ['home', 'about', 'products', 'departments', 'contact'];
        return validPages.includes(hash) ? hash : 'home';
    }

    // Handle hash changes
    window.addEventListener('hashchange', () => {
        // Empty hash (e.g. back button to the clean home URL) maps to home
        const page = window.location.hash.replace('#', '') || 'home';
        if (router.routes[page]) {
            router.navigate(page);
        }
    });

    // Initialize — single entry point, no double-fire
    function startApp() {
        const initialPage = getInitialPage();
        router.navigate(initialPage);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startApp);
    } else {
        startApp();
    }

    // Preload all pages in background after initial load
    setTimeout(() => {
        Object.keys(router.routes).forEach(page => {
            if (!router.routes[page].loaded) {
                router.loadPage(page);
            }
        });
    }, 2000);

})();
