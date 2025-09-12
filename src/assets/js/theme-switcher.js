class ThemeSwitcher {
    constructor() {
        this.themes = ['light', 'dark', 'blue', 'green'];
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.themeToggle = document.getElementById('themeToggle');
        this.themePanel = document.getElementById('themePanel');
        this.themeOptions = document.querySelectorAll('.theme-option');

        this.init();
    }

    init() {
        // Apply saved theme
        this.applyTheme(this.currentTheme);

        // Toggle theme panel
        this.themeToggle.addEventListener('click', () => {
            this.themePanel.classList.toggle('active');
        });

        // Close theme panel when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.themeToggle.contains(e.target) && !this.themePanel.contains(e.target)) {
                this.themePanel.classList.remove('active');
            }
        });

        // Theme option clicks
        this.themeOptions.forEach(option => {
            option.addEventListener('click', () => {
                const theme = option.dataset.theme;
                this.applyTheme(theme);
                this.themePanel.classList.remove('active');
            });
        });
    }

    applyTheme(theme) {
        // Remove all theme classes
        document.body.classList.remove('dark-theme', 'blue-theme', 'green-theme');

        // Add new theme class if not light
        if (theme !== 'light') {
            document.body.classList.add(`${theme}-theme`);
        }

        // Save to localStorage
        localStorage.setItem('theme', theme);
        this.currentTheme = theme;

        // Update active state
        this.themeOptions.forEach(option => {
            option.classList.toggle('active', option.dataset.theme === theme);
        });
    }
}

// Initialize theme switcher when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ThemeSwitcher();
});
