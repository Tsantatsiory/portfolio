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

    const messages = [
        'Initializing...',
        'Connexion...',
        'Préparation des données...',
        'Chargement des ressources...',
        'Optimisation...',
        'Finalisation...',
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
        }, 900);
    }
})();