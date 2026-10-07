document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initTerminalTyping();
    initFilterTabs();
    initMobileMenu();
    initCopyButtons();
    initNavHighlight();
});

function initThemeToggle() {
    const button = document.getElementById('theme-toggle');
    const icon = document.getElementById('theme-toggle-icon');
    const text = document.getElementById('theme-toggle-text');
    if (!button) return;

    const saved = localStorage.getItem('stitch-user-theme');
    const preferredDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = saved || (preferredDark ? 'dark' : 'light');
    applyTheme(initial);

    button.addEventListener('click', () => {
        const next = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
        localStorage.setItem('stitch-user-theme', next);
        applyTheme(next);
    });

    function applyTheme(theme) {
        const dark = theme === 'dark';
        document.documentElement.classList.toggle('dark', dark);
        if (icon) icon.className = dark ? 'fa-solid fa-sun text-amber-400' : 'fa-solid fa-moon text-brand-700';
        if (text) text.textContent = dark ? 'MODE TERANG' : 'MODE GELAP';
    }
}

function initTerminalTyping() {
    const target = document.getElementById('terminal-typing');
    if (!target) return;

    const commands = [
        'cat profile.json',
        'git status --short',
        "echo '[SYS.01] Portfolio Ready'",
        'npm run validate:portfolio'
    ];
    let commandIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function type() {
        const command = commands[commandIndex];
        if (deleting) {
            charIndex--;
            target.textContent = command.substring(0, charIndex);
        } else {
            charIndex++;
            target.textContent = command.substring(0, charIndex);
        }

        let delay = deleting ? 30 : 55;
        if (!deleting && charIndex === command.length) {
            deleting = true;
            delay = 1700;
        } else if (deleting && charIndex === 0) {
            deleting = false;
            commandIndex = (commandIndex + 1) % commands.length;
            delay = 400;
        }
        setTimeout(type, delay);
    }
    type();
}

function initFilterTabs() {
    const buttons = document.querySelectorAll('.filter-tab-btn');
    const cards = document.querySelectorAll('.filterable-card');
    if (!buttons.length) return;

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            buttons.forEach(item => item.classList.remove('active'));
            button.classList.add('active');

            cards.forEach(card => {
                const show = filter === 'all' || (card.dataset.category || '').includes(filter);
                card.style.display = show ? '' : 'none';
            });
        });
    });
}

function initMobileMenu() {
    const button = document.getElementById('mobile-menu-toggle');
    const menu = document.getElementById('mobile-menu');
    if (!button || !menu) return;

    button.addEventListener('click', () => {
        menu.classList.toggle('hidden');
        const icon = button.querySelector('i');
        if (icon) icon.className = menu.classList.contains('hidden') ? 'fa-solid fa-bars' : 'fa-solid fa-xmark';
    });

    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.add('hidden');
            const icon = button.querySelector('i');
            if (icon) icon.className = 'fa-solid fa-bars';
        });
    });
}

function initCopyButtons() {
    document.querySelectorAll('.copy-text-btn').forEach(button => {
        button.addEventListener('click', async () => {
            const value = button.dataset.copy;
            if (!value) return;
            const original = button.innerHTML;

            try {
                if (navigator.clipboard && window.isSecureContext) {
                    await navigator.clipboard.writeText(value);
                } else {
                    const area = document.createElement('textarea');
                    area.value = value;
                    area.style.position = 'fixed';
                    area.style.opacity = '0';
                    document.body.appendChild(area);
                    area.focus();
                    area.select();
                    document.execCommand('copy');
                    area.remove();
                }
                button.innerHTML = '<i class="fa-solid fa-check"></i><span>EMAIL TERSALIN!</span>';
            } catch (error) {
                button.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i><span>GAGAL MENYALIN</span>';
            }
            setTimeout(() => { button.innerHTML = original; }, 2000);
        });
    });
}

function initNavHighlight() {
    const sections = document.querySelectorAll('main section[id]');
    const links = document.querySelectorAll('.nav-link');
    if (!sections.length || !links.length || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            links.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
        });
    }, { rootMargin: '-25% 0px -65% 0px', threshold: 0 });

    sections.forEach(section => observer.observe(section));
}
