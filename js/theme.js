const toggleTheme = (theme) => {
    if (theme === 'system') {
        localStorage.removeItem('theme');
        document.documentElement.removeAttribute('data-theme');
    } else {
        localStorage.setItem('theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
    }
    updateActiveButton(theme);
};

const updateActiveButton = (theme) => {
    const currentTheme = theme || localStorage.getItem('theme') || 'system';
    document.querySelectorAll('.theme-toggle button').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === currentTheme);
    });
};

// Initialize theme immediately to prevent flash
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
}

document.addEventListener('DOMContentLoaded', () => {
    updateActiveButton();
    document.querySelectorAll('.theme-toggle button').forEach(btn => {
        btn.addEventListener('click', () => toggleTheme(btn.dataset.theme));
    });
});
