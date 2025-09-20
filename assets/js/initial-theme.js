// Initial theme setup - prevents flash of unstyled content
(function () {
  // Check for saved theme preference
  const savedTheme = localStorage.getItem("theme");

  // Check for system preference
  const systemPrefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)",
  ).matches;

  // Determine initial theme
  let initialTheme = "default";
  if (savedTheme) {
    initialTheme = savedTheme;
  } else if (systemPrefersDark) {
    initialTheme = "dark";
  }

  // Apply theme immediately
  document.documentElement.setAttribute("data-theme", initialTheme);

  // Set meta theme-color
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
      themeColors[initialTheme] || themeColors.default,
    );
  }
})();
