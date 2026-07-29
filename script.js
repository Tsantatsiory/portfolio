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
    const splashAlreadySeen = !!sessionStorage.getItem(SPLASH_SEEN_KEY);

    if (splashAlreadySeen) {
        splash.style.display = 'none';
        body.classList.remove('is-loading');
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.classList.add('hero-visible');
            setTimeout(() => startHeroAnimations(), 400);
        }
        setTimeout(() => initScrollReveal(), 600);
    } else {
        sessionStorage.setItem(SPLASH_SEEN_KEY, 'true');
    }

    const messages = [
        'Initializing...',
        'Connecting ideas...',
        'Collecting data...',
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

    if (!splashAlreadySeen) {
        setTimeout(() => dot.classList.add('rise'), DOT_RISE_DELAY);

        setTimeout(() => {
            name.classList.add('in');
        }, DOT_RISE_DELAY + DOT_RISE_DURATION - 150);

        setTimeout(() => {
            status.classList.add('in');
            percentEl.classList.add('in');
            barWrap.classList.add('in');
            startLoading();
        }, DOT_RISE_DELAY + DOT_RISE_DURATION);
    }

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

    function finishLoading() {
        splash.classList.add('exit');

        setTimeout(() => {
            splash.style.display = 'none';
            body.classList.remove('is-loading');

            const hero = document.querySelector('.hero');
            if (hero) {
                hero.classList.add('hero-visible');
            }
            setTimeout(() => {
                startHeroAnimations();
                initScrollReveal();
            }, 400);
        }, 900);
    }

    // ============================================
    // HERO ANIMATIONS - gestion des délais en cascade
    // ============================================
    function startHeroAnimations() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        const heroCategory = hero.querySelector('.hero-category');
        const heroTitle = hero.querySelector('.hero-title');
        const heroSub = hero.querySelector('.hero-sub');
        const heroScrollHint = hero.querySelector('.hero-scroll-hint');
        const heroBg = hero.querySelector('.hero-bg-word');

        if (heroCategory) {
            setTimeout(() => heroCategory.classList.add('animate-in'), 150);
        }

        if (heroBg) {
            setTimeout(() => heroBg.classList.add('animate-in'), 300);
        }

        if (heroTitle) {
            setTimeout(() => heroTitle.classList.add('animate-in'), 400);
        }

        if (heroSub) {
            setTimeout(() => heroSub.classList.add('animate-in'), 650);
        }

        if (heroScrollHint) {
            setTimeout(() => heroScrollHint.classList.add('animate-in'), 850);
        }
    }

    // ============================================
    // BOTTOM NAV — indicateur glissant + scrollspy
    // ============================================
    (function initBottomNav() {
        const nav = document.getElementById('bottomNav');
        const indicator = document.getElementById('bottomNavIndicator');
        if (!nav || !indicator) return;

        const items = nav.querySelectorAll('.bottom-nav-item');

        function setActiveTab(tabName) {
            items.forEach(item => item.classList.toggle('active', item.dataset.tab === tabName));
            const activeItem = nav.querySelector('[data-tab="' + tabName + '"]');
            if (!activeItem) return;
            const navRect = nav.getBoundingClientRect();
            const itemRect = activeItem.getBoundingClientRect();
            indicator.style.left = (itemRect.left - navRect.left) + 'px';
            indicator.classList.add('ready');
        }

        const path = window.location.pathname;
        const isCreationsPage = path.includes('design.html') || path.includes('gallery.html');

        if (isCreationsPage) {
            setActiveTab('creations');
        } else {
            // scrollspy sur la home : about / projects / contact
            const sections = ['about', 'projects', 'contact']
                .map(id => document.getElementById(id))
                .filter(Boolean);

            let currentTab = 'home';
            setActiveTab('home');

            if (sections.length) {
                const spy = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const id = entry.target.id;
                            const tab = id === 'projects' ? 'work' : id;
                            if (tab !== currentTab) {
                                currentTab = tab;
                                setActiveTab(tab);
                            }
                        }
                    });
                }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

                sections.forEach(section => spy.observe(section));

                // en haut de page = Home
                window.addEventListener('scroll', () => {
                    if (window.scrollY < 200 && currentTab !== 'home') {
                        currentTab = 'home';
                        setActiveTab('home');
                    }
                }, { passive: true });
            }
        }

        // recalcule la position au resize (changement d'orientation, etc.)
        window.addEventListener('resize', () => {
            const activeItem = nav.querySelector('.bottom-nav-item.active');
            if (activeItem) {
                const navRect = nav.getBoundingClientRect();
                const itemRect = activeItem.getBoundingClientRect();
                indicator.style.left = (itemRect.left - navRect.left) + 'px';
            }
        });
    })();

    // ============================================
    // GALLERY — filtres + lightbox (actif seulement si présents sur la page)
    // ============================================
    (function initGallery() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const items = document.querySelectorAll('.masonry-item');
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxClose = document.getElementById('lightbox-close');
        const lightboxPrev = document.getElementById('lightbox-prev');
        const lightboxNext = document.getElementById('lightbox-next');
        const lightboxCounter = document.getElementById('lightbox-counter');

        if (!items.length || !lightbox) return;

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.dataset.filter;
                items.forEach(item => {
                    const match = filter === 'all' || item.dataset.cat === filter;
                    item.classList.toggle('is-hidden', !match);
                });
            });
        });

        let visibleItems = [];
        let currentIndex = 0;

        function getVisibleItems() {
            return Array.from(items).filter(item => !item.classList.contains('is-hidden'));
        }

        function openLightbox(item) {
            visibleItems = getVisibleItems();
            currentIndex = visibleItems.indexOf(item);
            updateLightbox();
            lightbox.classList.add('open');
            document.body.style.overflow = 'hidden';
        }

        function updateLightbox() {
            const img = visibleItems[currentIndex].querySelector('img');
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightboxCounter.textContent = (currentIndex + 1) + ' / ' + visibleItems.length;
        }

        function closeLightbox() {
            lightbox.classList.remove('open');
            document.body.style.overflow = '';
        }

        function showPrev() {
            currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
            updateLightbox();
        }

        function showNext() {
            currentIndex = (currentIndex + 1) % visibleItems.length;
            updateLightbox();
        }

        items.forEach(item => {
            item.addEventListener('click', () => openLightbox(item));
        });

        if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
        if (lightboxPrev) lightboxPrev.addEventListener('click', showPrev);
        if (lightboxNext) lightboxNext.addEventListener('click', showNext);

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('open')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'ArrowRight') showNext();
        });
    })();

    // ============================================
    // NAV MOBILE — hamburger toggle
    // ============================================
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('open');
            navToggle.classList.toggle('open', isOpen);
            navToggle.setAttribute('aria-expanded', isOpen);
            document.body.classList.toggle('nav-open', isOpen);
        });

        // ferme le menu au clic sur un lien simple (pas le trigger du dropdown)
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                navToggle.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('nav-open');
            });
        });

        // ferme le menu si on repasse en desktop (resize)
        window.addEventListener('resize', () => {
            if (window.innerWidth > 860 && navLinks.classList.contains('open')) {
                navLinks.classList.remove('open');
                navToggle.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('nav-open');
            }
        });
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
    // CONTACT FORM — envoi AJAX via Web3Forms
    // ============================================
    (function initContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        const submitBtn = document.getElementById('contactSubmitBtn');
        const statusEl = document.getElementById('formStatus');

        function showStatus(type, message) {
            statusEl.className = 'form-status show ' + type;
            const icon = type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill';
            statusEl.innerHTML = '<i class="bi ' + icon + '"></i> ' + message;
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            submitBtn.classList.add('is-loading');
            statusEl.className = 'form-status';

            const formData = new FormData(form);
            const payload = Object.fromEntries(formData.entries());

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                    body: JSON.stringify(payload)
                });

                const result = await response.json();

                if (result.success) {
                    showStatus('success', 'Message sent — I\'ll get back to you soon.');
                    form.reset();
                } else {
                    showStatus('error', 'Something went wrong. Please try again or email me directly.');
                }
            } catch (err) {
                showStatus('error', 'Network error. Please check your connection and try again.');
            } finally {
                submitBtn.classList.remove('is-loading');
            }
        });
    })();

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

        setTimeout(() => {
            revealElements.forEach(el => {
                const rect = el.getBoundingClientRect();
                const winHeight = window.innerHeight;
                if (rect.top < winHeight - 100) {
                    el.classList.add('visible');
                }
            });
        }, 600);
    }

    if (!splash.style.display || splash.style.display === 'none') {
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.classList.add('hero-visible');
            setTimeout(() => startHeroAnimations(), 400);
        }
        setTimeout(() => initScrollReveal(), 600);
    }
})();