(function () {
    const body = document.body;
    const splash = document.getElementById('splash');
    const dot = document.getElementById('splash-dot');
    const name = document.getElementById('splash-name');
    const status = document.getElementById('splash-status');
    const statusWord = document.getElementById('splash-status-word');
    const percentEl = document.getElementById('splash-percent');
    const barWrap = document.getElementById('splash-bar-wrap');
    const barFill = document.getElementById('splash-bar-fill');

    if (!splash) return;
    
    const SPLASH_SEEN_KEY = 'splashSeen';

    if (sessionStorage.getItem(SPLASH_SEEN_KEY)) {
        splash.style.display = 'none';
        body.classList.remove('is-loading');
        // Initialiser les révélations même si le splash est skip
        initScrollReveal();
        return;
    }
    sessionStorage.setItem(SPLASH_SEEN_KEY, 'true');

    const messages = [
        'Initializing...',
        'Connecting ideas...',
        'collecting data...',
        'Loading experience...',
        'Rendering content...',
        'Synchronizing modules...',
        'Building memories...',
        'Finalizing setup...',
        'Starting now...',
    ];

    const DOT_RISE_DELAY = 600;
    const DOT_RISE_DURATION = 900;
    const LOAD_DURATION = 8000;

    // 1. le point monte
    setTimeout(() => dot.classList.add('rise'), DOT_RISE_DELAY);

    // 2. le nom + la vidéo apparaissent
    setTimeout(() => {
        name.classList.add('in');
    }, DOT_RISE_DELAY + DOT_RISE_DURATION - 150);

    // 3-4-5. statut, %, barre apparaissent puis progressent ensemble
    setTimeout(() => {
        status.classList.add('in');
        percentEl.classList.add('in');
        barWrap.classList.add('in');
        startLoading();
    }, DOT_RISE_DELAY + DOT_RISE_DURATION);

    function startLoading() {
        let progress = 0;
        let msgIndex = 0;
        statusWord.textContent = messages[0];

        const stepTime = 40;
        const steps = LOAD_DURATION / stepTime;
        const increment = 100 / steps;

        const interval = setInterval(() => {
            progress = Math.min(100, progress + increment);

            barFill.style.width = progress + '%';
            percentEl.textContent = Math.floor(progress) + '%';

            const expected = Math.min(
                messages.length - 1,
                Math.floor(progress / (100 / messages.length))
            );
            if (expected !== msgIndex) {
                msgIndex = expected;
                statusWord.classList.add('swap');
                setTimeout(() => {
                    statusWord.textContent = messages[msgIndex];
                    statusWord.classList.remove('swap');
                }, 220);
            }

            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(finishLoading, 350);
            }
        }, stepTime);
    }

    // 6. sortie du splash -> révèle le vrai site
    function finishLoading() {
        splash.classList.add('exit');
        setTimeout(() => {
            splash.style.display = 'none';
            body.classList.remove('is-loading');
            // Initialiser le scroll reveal après le splash
            initScrollReveal();
        }, 900);
    }

    // ============================================
    // DROPDOWN
    // ============================================
    const dropdown = document.querySelector('.nav-dropdown');
    if (dropdown) {
        const trigger = dropdown.querySelector('.nav-dropdown-trigger');

        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = dropdown.classList.toggle('open');
            trigger.setAttribute('aria-expanded', isOpen);
        });

        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('open');
                trigger.setAttribute('aria-expanded', 'false');
            }
        });

        dropdown.querySelectorAll('.nav-dropdown-menu a').forEach(link => {
            link.addEventListener('click', () => {
                dropdown.classList.remove('open');
                trigger.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // ============================================
    // SCROLL REVEAL
    // ============================================
    function initScrollReveal() {
        const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
        
        if (revealElements.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        });

        revealElements.forEach(el => observer.observe(el));

        // Si certains éléments sont déjà visibles (pas de scroll)
        setTimeout(() => {
            revealElements.forEach(el => {
                const rect = el.getBoundingClientRect();
                const winHeight = window.innerHeight;
                if (rect.top < winHeight - 100) {
                    el.classList.add('visible');
                }
            });
        }, 300);
    }

    // Si le splash est déjà passé (pas de splash au chargement), init direct
    if (!splash.style.display || splash.style.display === 'none') {
        initScrollReveal();
    }
})();