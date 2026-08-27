const root = document.body;
const themeColor = document.querySelector('meta[name="theme-color"]');
const themeToggle = document.querySelector('.theme-toggle');
const themePopover = document.querySelector('.theme-popover');
const themeButtons = [...document.querySelectorAll('[data-theme]')];
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const supportsSvgBackdrop = CSS.supports('backdrop-filter', 'url("#nav-liquid-refraction") blur(1px)') || CSS.supports('-webkit-backdrop-filter', 'url("#nav-liquid-refraction") blur(1px)');
const usesChromiumEngine = /(?:Chrome|Chromium|Edg)\//.test(navigator.userAgent);
if (supportsSvgBackdrop && usesChromiumEngine) document.documentElement.classList.add('supports-refraction');
const allowedThemes = ['light', 'dark', 'pink'];
const savedTheme = localStorage.getItem('portfolio-theme');
let activeTheme = allowedThemes.includes(savedTheme) ? savedTheme : (systemPrefersDark ? 'dark' : 'light');

function applyTheme(theme, persist = true) {
    activeTheme = theme;
    root.classList.toggle('dark', theme === 'dark');
    root.classList.toggle('pink', theme === 'pink');
    root.dataset.theme = theme;

    themeButtons.forEach(button => {
        button.setAttribute('aria-checked', String(button.dataset.theme === theme));
    });

    const themeColors = { light: '#f5f5f7', dark: '#000000', pink: '#fff3f8' };
    themeColor.setAttribute('content', themeColors[theme]);
    if (persist) localStorage.setItem('portfolio-theme', theme);
}

function setThemePopover(open, returnFocus = false) {
    themePopover.classList.toggle('open', open);
    themeToggle.setAttribute('aria-expanded', String(open));

    if (open) {
        const current = themeButtons.find(button => button.dataset.theme === activeTheme);
        requestAnimationFrame(() => current?.focus());
    } else if (returnFocus) {
        themeToggle.focus();
    }
}

themeToggle.addEventListener('click', () => {
    setThemePopover(!themePopover.classList.contains('open'));
    setMenu(false);
});

themeButtons.forEach(button => {
    button.addEventListener('click', () => {
        applyTheme(button.dataset.theme);
        setThemePopover(false, true);
    });
});

themePopover.addEventListener('keydown', event => {
    const currentIndex = themeButtons.indexOf(document.activeElement);
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    const direction = event.key === 'ArrowDown' ? 1 : -1;
    themeButtons[(currentIndex + direction + themeButtons.length) % themeButtons.length].focus();
});

applyTheme(activeTheme, false);

const menuButton = document.querySelector('.menu-button');
const navLinks = document.querySelector('.nav-links');

function setMenu(open) {
    navLinks.classList.toggle('open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? '关闭导航菜单' : '打开导航菜单');
}

menuButton.addEventListener('click', () => {
    setMenu(!navLinks.classList.contains('open'));
    setThemePopover(false);
});

document.addEventListener('click', event => {
    if (!event.target.closest('.nav-shell')) {
        setMenu(false);
        setThemePopover(false);
    }
});

document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;

    if (themePopover.classList.contains('open')) {
        setThemePopover(false, true);
    } else if (navLinks.classList.contains('open')) {
        setMenu(false);
        menuButton.focus();
    }
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => setMenu(false));
});

const siteHeader = document.querySelector('.site-header');
const navShell = document.querySelector('.nav-shell');
const glassHighlight = document.querySelector('.glass-highlight');
const refractionDisplacement = document.querySelector('#nav-refraction-displacement');
const backToTop = document.querySelector('.back-to-top');
let scrollFramePending = false;
let refractionScale = 26;
let refractionTarget = 26;
let refractionFrame = 0;
let glassHovered = false;
let glassPressed = false;

function animateRefraction() {
    refractionScale += (refractionTarget - refractionScale) * .2;
    refractionDisplacement.setAttribute('scale', refractionScale.toFixed(2));

    if (Math.abs(refractionTarget - refractionScale) > .08) {
        refractionFrame = requestAnimationFrame(animateRefraction);
    } else {
        refractionScale = refractionTarget;
        refractionDisplacement.setAttribute('scale', String(refractionTarget));
        refractionFrame = 0;
    }
}

function syncRefractionStrength() {
    const materialThickness = window.scrollY > 24 ? 31 : 26;
    refractionTarget = materialThickness + (glassHovered ? 5 : 0) + (glassPressed ? 5 : 0);

    if (prefersReducedMotion) {
        refractionScale = refractionTarget;
        refractionDisplacement.setAttribute('scale', String(refractionTarget));
    } else if (!refractionFrame) {
        refractionFrame = requestAnimationFrame(animateRefraction);
    }
}

function updateFloatingChrome() {
    siteHeader.classList.toggle('is-scrolled', window.scrollY > 24);
    backToTop.classList.toggle('visible', window.scrollY > 520);
    syncRefractionStrength();
    scrollFramePending = false;
}

window.addEventListener('scroll', () => {
    if (scrollFramePending) return;
    scrollFramePending = true;
    requestAnimationFrame(updateFloatingChrome);
}, { passive: true });

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
});

if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !prefersReducedMotion) {
    navShell.addEventListener('pointerenter', () => {
        glassHovered = true;
        syncRefractionStrength();
    });

    navShell.addEventListener('pointermove', event => {
        const bounds = navShell.getBoundingClientRect();
        const x = event.clientX - bounds.left - 75;
        glassHighlight.style.transform = `translate3d(${x}px, -50%, 0)`;
        glassHighlight.style.opacity = '.62';
    });

    navShell.addEventListener('pointerleave', () => {
        glassHovered = false;
        glassPressed = false;
        syncRefractionStrength();
        glassHighlight.style.transform = 'translate3d(-80px, -50%, 0)';
        glassHighlight.style.opacity = '.42';
    });

    navShell.addEventListener('pointerdown', () => {
        glassPressed = true;
        syncRefractionStrength();
    });

    const releaseGlass = () => {
        glassPressed = false;
        syncRefractionStrength();
    };
    navShell.addEventListener('pointerup', releaseGlass);
    navShell.addEventListener('pointercancel', releaseGlass);
}

updateFloatingChrome();

const revealItems = document.querySelectorAll('.reveal');

if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach(item => item.classList.add('is-visible'));
} else {
    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
        });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    revealItems.forEach(item => revealObserver.observe(item));
}

const navigationItems = [...document.querySelectorAll('.nav-links a')];
const sections = navigationItems
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

const sectionObserver = new IntersectionObserver(entries => {
    const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;
    navigationItems.forEach(link => {
        const isCurrent = link.getAttribute('href') === `#${visible.target.id}`;
        if (isCurrent) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
    });
}, { rootMargin: '-24% 0px -60% 0px', threshold: [0.01, 0.25, 0.5] });

sections.forEach(section => sectionObserver.observe(section));

const initialSection = location.hash ? document.querySelector(location.hash) : null;
if (initialSection) {
    requestAnimationFrame(() => initialSection.scrollIntoView({ behavior: 'auto', block: 'start' }));
}

document.querySelector('#year').textContent = new Date().getFullYear();
