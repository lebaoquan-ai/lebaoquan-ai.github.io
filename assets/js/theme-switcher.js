class ThemeSwitcher {
  constructor() {
    this.themes = [
      { id: "default", name: "Default", icon: "☀️" },
      { id: "dark", name: "Dark", icon: "🌙" },
      { id: "beach", name: "Beach", icon: "🏖️" },
      { id: "choco", name: "Choco", icon: "🍫" },
      { id: "moomoo", name: "Moomoo", icon: "🐮" },
      { id: "bowser", name: "Bowser", icon: "👾" },
      { id: "yoshi", name: "Yoshi", icon: "🦖" },
      { id: "rainbow", name: "Rainbow", icon: "🌈" },
      { id: "lobster", name: "Lobster", icon: "🦞" },
      { id: "hackernews", name: "Hacker News", icon: "📰" },
    ];

    this.activeTheme = "default";
    this.isOpen = false;
    this.hasLocalStorage = typeof Storage !== "undefined";

    this.init();
  }

  init() {
    this.setupDOM();
    this.bindEvents();
    this.loadInitialTheme();
    this.updateUI();
  }

  setupDOM() {
    // Find existing theme toggle or create one
    this.themeToggle = document.querySelector(".theme-toggle");
    this.themePanel = document.querySelector(".theme-panel");

    if (!this.themeToggle) {
      this.createThemeToggle();
    }

    if (!this.themePanel) {
      this.createThemePanel();
    }
  }

  createThemeToggle() {
    const toggle = document.createElement("button");
    toggle.className = "theme-toggle";
    toggle.setAttribute("aria-label", "Toggle theme picker");
    toggle.setAttribute("aria-expanded", "false");
    toggle.innerHTML = `
            <span class="theme-toggle__icon">🎨</span>
        `;

    // Add to header
    const header = document.querySelector("header");
    if (header) {
      header.appendChild(toggle);
    }

    this.themeToggle = toggle;
  }

  createThemePanel() {
    const panel = document.createElement("div");
    panel.className = "theme-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "Theme selector");
    panel.innerHTML = `
            <div class="theme-panel__header">
                <h3>Choose Theme</h3>
                <button class="theme-panel__close" aria-label="Close theme picker">×</button>
            </div>
            <div class="theme-panel__grid">
                ${this.themes.map((theme) => this.createThemeButton(theme)).join("")}
            </div>
        `;

    document.body.appendChild(panel);
    this.themePanel = panel;
  }

  createThemeButton(theme) {
    return `
            <button class="theme-option" data-theme="${theme.id}" aria-label="Select ${theme.name} theme">
                <span class="theme-option__icon">${theme.icon}</span>
                <span class="theme-option__name">${theme.name}</span>
                <div class="theme-option__colors">
                    <span class="theme-color theme-color--primary" style="background-color: var(--color-primary)"></span>
                    <span class="theme-color theme-color--secondary" style="background-color: var(--color-secondary)"></span>
                    <span class="theme-color theme-color--accent" style="background-color: var(--color-accent)"></span>
                </div>
            </button>
        `;
  }

  bindEvents() {
    // Toggle theme panel
    this.themeToggle.addEventListener("click", () => this.togglePanel());

    // Close button
    const closeBtn = this.themePanel.querySelector(".theme-panel__close");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.closePanel());
    }

    // Theme options
    const themeOptions = this.themePanel.querySelectorAll(".theme-option");
    themeOptions.forEach((option) => {
      option.addEventListener("click", () => {
        const themeId = option.dataset.theme;
        this.setTheme(themeId);
        this.closePanel();
      });
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
      if (
        !this.themeToggle.contains(e.target) &&
        !this.themePanel.contains(e.target)
      ) {
        this.closePanel();
      }
    });

    // Close on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen) {
        this.closePanel();
      }
    });
  }

  loadInitialTheme() {
    // Check localStorage first
    const savedTheme = this.hasLocalStorage
      ? localStorage.getItem("theme")
      : null;

    // Check system preference
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    if (savedTheme && this.themes.find((t) => t.id === savedTheme)) {
      this.activeTheme = savedTheme;
    } else if (systemPrefersDark) {
      this.activeTheme = "dark";
    } else {
      this.activeTheme = "default";
    }

    this.applyTheme(this.activeTheme);
  }

  setTheme(themeId) {
    if (!this.themes.find((t) => t.id === themeId)) return;

    this.activeTheme = themeId;
    this.applyTheme(themeId);
    this.updateUI();

    // Save to localStorage
    if (this.hasLocalStorage) {
      localStorage.setItem("theme", themeId);
    }

    // Update meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      const themeColors = {
        default: "#f7f7f9",
        dark: "#0e141b",
        beach: "#fef3e2",
        choco: "#f1e9e5",
        moomoo: "#ffe0e6",
        bowser: "#1a0d1a",
        yoshi: "#dcfce7",
        rainbow: "#0a0a0a",
        lobster: "#ffe0e6",
        hackernews: "#f6f6ef",
      };

      metaThemeColor.setAttribute(
        "content",
        themeColors[themeId] || themeColors.default,
      );
    }
  }

  applyTheme(themeId) {
    document.documentElement.setAttribute("data-theme", themeId);

    // Special handling for rainbow theme
    if (themeId === "rainbow") {
      this.enableRainbowEffects();
    } else {
      this.disableRainbowEffects();
    }

    // Special handling for lobster theme
    if (themeId === "lobster") {
      this.enableLobsterFont();
    } else {
      this.disableLobsterFont();
    }
  }

  enableRainbowEffects() {
    if (document.getElementById("rainbow-style")) return;

    const style = document.createElement("style");
    style.id = "rainbow-style";
    style.textContent = `
            @keyframes rainbow-text {
                0% { color: #ff0000; }
                16.66% { color: #ff8000; }
                33.33% { color: #ffff00; }
                50% { color: #00ff00; }
                66.66% { color: #0080ff; }
                83.33% { color: #8000ff; }
                100% { color: #ff0000; }
            }

            .rainbow-text {
                animation: rainbow-text 3s linear infinite;
                background: linear-gradient(45deg, #ff0000, #ff8000, #ffff00, #00ff00, #0080ff, #8000ff);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }
        `;
    document.head.appendChild(style);
  }

  disableRainbowEffects() {
    const style = document.getElementById("rainbow-style");
    if (style) {
      style.remove();
    }
  }

  enableLobsterFont() {
    if (document.getElementById("lobster-font")) return;

    const link = document.createElement("link");
    link.id = "lobster-font";
    link.href = "https://fonts.googleapis.com/css2?family=Lobster&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }

  disableLobsterFont() {
    const link = document.getElementById("lobster-font");
    if (link) {
      link.remove();
    }
  }

  togglePanel() {
    this.isOpen = !this.isOpen;
    this.updatePanelState();
  }

  openPanel() {
    this.isOpen = true;
    this.updatePanelState();
  }

  closePanel() {
    this.isOpen = false;
    this.updatePanelState();
  }

  updatePanelState() {
    if (this.isOpen) {
      this.themePanel.classList.add("active");
      this.themeToggle.setAttribute("aria-expanded", "true");
    } else {
      this.themePanel.classList.remove("active");
      this.themeToggle.setAttribute("aria-expanded", "false");
    }
  }

  updateUI() {
    // Update active theme button
    const themeOptions = this.themePanel.querySelectorAll(".theme-option");
    themeOptions.forEach((option) => {
      option.classList.toggle(
        "active",
        option.dataset.theme === this.activeTheme,
      );
    });

    // Update toggle button icon
    const activeThemeObj = this.themes.find((t) => t.id === this.activeTheme);
    if (activeThemeObj && this.themeToggle) {
      const icon = this.themeToggle.querySelector(".theme-toggle__icon");
      if (icon) {
        icon.textContent = activeThemeObj.icon;
      }
    }
  }
}

// Initialize theme switcher when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new ThemeSwitcher();
});
