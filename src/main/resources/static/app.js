const state = { dark: localStorage.getItem('linye-theme') === 'dark' };

const setTheme = () => {
    document.body.classList.toggle('dark', state.dark);
    document.querySelector('.sun-icon').textContent = state.dark ? '☾' : '☼';
};

document.querySelector('.theme-toggle').addEventListener('click', () => {
    state.dark = !state.dark;
    localStorage.setItem('linye-theme', state.dark ? 'dark' : 'light');
    setTheme();
});
setTheme();

const menuButton = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');
menuButton.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', open);
});
document.querySelectorAll('.nav-links a').forEach(link => link.addEventListener('click', () => navLinks.classList.remove('open')));

const filters = document.querySelectorAll('.filter');
const projects = document.querySelectorAll('.project-card');
filters.forEach(filter => filter.addEventListener('click', () => {
    filters.forEach(item => item.classList.remove('active'));
    filter.classList.add('active');
    const selected = filter.dataset.filter;
    projects.forEach(project => {
        const visible = selected === 'all' || project.dataset.category === selected;
        project.style.display = visible ? '' : 'none';
    });
}));

const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));

const form = document.querySelector('#contact-form');
form.addEventListener('submit', async event => {
    event.preventDefault();
    const status = form.querySelector('.form-status');
    const payload = Object.fromEntries(new FormData(form).entries());
    status.textContent = '发送中…';
    try {
        const response = await fetch('/api/contact', {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error('request failed');
        status.textContent = '收到你的消息了，我会尽快回复。';
        form.reset();
    } catch (error) {
        status.textContent = '暂时无法发送，请直接邮件联系我。';
    }
});

async function hydrateContent() {
    try {
        const [statsResponse, timelineResponse] = await Promise.all([fetch('/api/stats'), fetch('/api/timeline')]);
        if (statsResponse.ok) {
            const stats = await statsResponse.json();
            document.querySelector('#stats-grid').innerHTML = stats.map(item => `<div class="stat"><strong>${item.number}</strong><span>${item.label}</span><small>${item.suffix}</small></div>`).join('');
        }
        if (timelineResponse.ok) {
            const timeline = await timelineResponse.json();
            document.querySelector('#timeline').innerHTML = timeline.map(item => `<div class="timeline-item"><span>${item.date}</span><div><h3>${item.title}</h3><p>${item.description}</p></div></div>`).join('');
        }
    } catch (error) {
        // Static fallback content keeps the first render useful when the API is unavailable.
    }
}
hydrateContent();
