# Theme Switcher Implementation Documentation

## Overview

This repository contains a comprehensive theme switcher implementation that allows users to switch between different color themes and typographic styles. The system uses CSS custom properties (variables) and JavaScript to provide a smooth, accessible theme switching experience.

## Architecture

### Core Components

1. **CSS Custom Properties** - All theme colors are defined as CSS variables
2. **Theme Picker JavaScript** - Handles theme switching logic and persistence
3. **Theme Configuration** - Centralized theme definitions (likely in a data file)
4. **HTML Template** - Renders the theme picker UI
5. **Generated CSS** - Final theme styles compiled from templates

### File Structure

```
src/
├── assets/
│   ├── scripts/common/themepicker.js     # Main theme switching logic
│   └── styles/
│       ├── components/_themepicker.scss  # Theme picker UI styles
│       ├── base/_typography.scss         # Typography styles
│       ├── base/_fonts.scss              # Font declarations
│       ├── utils/_variables.scss         # Base variables
│       └── main.scss                     # Main stylesheet entry
├── themes.njk                            # Template for generating themes.css
└── includes/initialtheme.njk             # Initial theme setup script
```

## Color Palette System

### CSS Custom Properties

Each theme defines the following color variables:

```css
:root {
    --color-bg: #ffffff;                /* Main background color */
    --color-bg-offset: #f7f7f9;         /* Secondary background color */
    --color-text: #373a3c;              /* Main text color */
    --color-text-offset: #818a91;       /* Secondary text color */
    --color-border: #eceeef;            /* Border color */
    --color-primary: #ff335f;           /* Primary accent color */
    --color-primary-offset: #ff1447;    /* Primary hover/active color */
    --color-secondary: #43a9a3;         /* Secondary accent color */
}
```

### Available Themes

1. **Default** - Light theme with coral red primary color
2. **Dark** - Dark theme adapted from default
3. **Beach** - Light, airy theme with orange accents
4. **Choco** - Warm brown theme with peach accents
5. **Moomoo** - Soft pastel theme with pink accents
6. **Bowser** - Dark purple theme with green accents
7. **Yoshi** - Light green theme with orange accents
8. **Rainbow** - Neon theme with animated background
9. **Lobster** - Pink theme with custom fonts
10. **HackerNews** - Classic HN orange theme

### Theme-Specific Customizations

Some themes include additional customizations:

- **Rainbow**: Animated stars background and rainbow text effects
- **Lobster**: Custom font family and cursor
- **HackerNews**: Verdana font family, reduced font size, and "considered harmful" text addition

## Typography and Font System

### Font Stack

The system uses a carefully chosen font stack:

```scss
$font-family-sans-serif: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
    'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
$font-family-serif: 'Noe Display', Georgia, Times, serif;
$font-family-monospace: 'Fira Code', Menlo, Monaco, Consolas, 'Andale Mono',
    'Courier New', monospace;
$font-family-base: $font-family-sans-serif;
```

### Custom Fonts

Two custom fonts are loaded:

1. **Noe Display** - Used for headings (`font-family-display`)
2. **Lobster** - Used in the Lobster theme

### Typography Variables

```scss
$font-size-root: 100%;
$font-size-base: 1rem;
$line-height: 1.625;
```

### Heading Structure

```css
h1, h2, h3 {
    font-family: var(--font-family-display);
    font-weight: 500;
    text-rendering: optimizeLegibility;
}

h1, .h1 { font-size: 2.5rem; }
h2, .h2 { font-size: 2.25rem; }
h3, .h3 { font-size: 2rem; }
```

## Theme Switching Implementation

### JavaScript Logic (`themepicker.js`)

The theme picker is implemented as a class with the following features:

#### Class Structure

```javascript
class ThemePicker {
    constructor() {
        this.isOpen = false
        this.activeTheme = 'default'
        this.hasLocalStorage = typeof Storage !== 'undefined'
        this.hasThemeColorMeta = /* check for meta theme-color tag */
        
        // DOM elements
        this.picker = document.querySelector(SELECTORS.picker)
        this.toggleBtn = document.querySelector(SELECTORS.toggleBtn)
        // ... other elements
        
        this.init()
    }
}
```

#### Initialization Flow

1. Check system preference for dark mode
2. Check localStorage for saved theme
3. Set active theme based on priority: stored > system > default
4. Set active UI state
5. Bind event listeners

#### Theme Persistence

Themes are saved to localStorage:

```javascript
setTheme(id) {
    this.activeTheme = id
    document.documentElement.setAttribute('data-theme', id)
    
    if (this.hasLocalStorage) {
        localStorage.setItem(THEME_STORAGE_KEY, id)
    }
    
    // Update meta theme-color
    if (this.hasThemeColorMeta) {
        const metaColor = window.metaColors[id]
        const metaTag = document.querySelector('meta[name="theme-color"]')
        metaTag.setAttribute('content', metaColor)
    }
}
```

#### System Preference Detection

```javascript
getSystemPreference() {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark'
    }
    return false
}
```

### CSS Implementation

#### Theme Application

Themes are applied using CSS data attributes:

```css
[data-theme='dark'] {
    --color-bg: #0e141b;
    --color-bg-offset: #252526;
    /* ... other color variables */
}
```

#### Automatic Dark Mode

The system also respects system dark mode preferences:

```css
@media(prefers-color-scheme: dark) {
    :root {
        --color-bg: #0e141b;
        /* ... dark mode variables */
    }
}
```

### HTML Structure

#### Theme Picker UI

The theme picker includes:

1. **Toggle button** - Opens/closes the theme selector
2. **Theme grid** - Visual representation of each theme
3. **Color previews** - Shows the main colors of each theme
4. **Active state indicator** - Shows currently selected theme

#### Theme Button Structure

```html
<div class="themepicker__item">
    <button class="themepicker__btn js-themepicker-themeselect" 
            data-theme="default" 
            aria-checked="true">
        <span class="themepicker__name">Default</span>
        <span class="themepicker__palette">
            <span class="themepicker__hue themepicker__hue--primary"></span>
            <span class="themepicker__hue themepicker__hue--secondary"></span>
            <span class="themepicker__hue themepicker__hue--border"></span>
            <span class="themepicker__hue themepicker__hue--textoffset"></span>
            <span class="themepicker__hue themepicker__hue--text"></span>
        </span>
    </button>
</div>
```

## Implementation for Static Blog

### Step 1: CSS Setup

1. **Create base CSS variables** in your main stylesheet:

```css
:root {
    --color-bg: #ffffff;
    --color-bg-offset: #f7f7f9;
    --color-text: #373a3c;
    --color-text-offset: #818a91;
    --color-border: #eceeef;
    --color-primary: #ff335f;
    --color-primary-offset: #ff1447;
    --color-secondary: #43a9a3;
    --font-family-display: 'Your Display Font', serif;
    --font-family-base: -apple-system, BlinkMacSystemFont, sans-serif;
}
```

2. **Create theme definitions**:

```css
[data-theme='dark'] {
    --color-bg: #0e141b;
    --color-bg-offset: #252526;
    /* ... other variables */
}
```

3. **Apply variables throughout your styles**:

```css
body {
    background-color: var(--color-bg);
    color: var(--color-text);
    font-family: var(--font-family-base);
}

a {
    color: var(--color-primary);
}

h1, h2, h3 {
    font-family: var(--font-family-display);
}
```

### Step 2: JavaScript Implementation

1. **Create theme switcher script**:

```javascript
class ThemeSwitcher {
    constructor() {
        this.themes = ['default', 'dark', 'beach', 'custom'];
        this.activeTheme = this.getInitialTheme();
        this.init();
    }
    
    getInitialTheme() {
        // Check localStorage first
        const saved = localStorage.getItem('theme');
        if (saved) return saved;
        
        // Check system preference
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        
        return 'default';
    }
    
    setTheme(themeName) {
        this.activeTheme = themeName;
        document.documentElement.setAttribute('data-theme', themeName);
        localStorage.setItem('theme', themeName);
        this.updateUI();
    }
    
    init() {
        this.setTheme(this.activeTheme);
        this.bindEvents();
    }
    
    bindEvents() {
        // Add event listeners to theme buttons
        document.querySelectorAll('[data-theme]').forEach(button => {
            button.addEventListener('click', () => {
                this.setTheme(button.dataset.theme);
            });
        });
    }
}
```

### Step 3: HTML Structure

1. **Add theme picker to your HTML**:

```html
<div class="theme-switcher">
    <button class="theme-switcher__toggle" aria-label="Toggle theme picker">
        <span class="theme-icon">🎨</span>
    </button>
    
    <div class="theme-switcher__options" hidden>
        <button data-theme="default" class="theme-option">Light</button>
        <button data-theme="dark" class="theme-option">Dark</button>
        <button data-theme="beach" class="theme-option">Beach</button>
    </div>
</div>
```

2. **Add meta theme-color support**:

```html
<meta name="theme-color" content="#f7f7f9">
```

### Step 4: Static Site Generator Integration

For static site generators, you have several options:

#### Option A: CSS Variables Only (Simplest)

Define all themes in a single CSS file and use the JavaScript above.

#### Option B: Template-Based (Advanced)

1. Create a data file with theme definitions:

```yaml
# themes.yml
themes:
  - id: default
    name: Default
    colors:
      background: "#ffffff"
      backgroundOffset: "#f7f7f9"
      text: "#373a3c"
      textOffset: "#818a91"
      border: "#eceeef"
      primary: "#ff335f"
      primaryOffset: "#ff1447"
      secondary: "#43a9a3"
```

2. Use your SSG's templating system to generate theme CSS

#### Option C: Build-Time CSS Generation

Use a build tool to generate theme CSS from configuration files.

### Step 5: Styling the Theme Picker

```css
.theme-switcher {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    z-index: 1000;
}

.theme-option {
    padding: 0.5rem 1rem;
    margin: 0.25rem;
    border: 1px solid var(--color-border);
    background: var(--color-bg);
    color: var(--color-text);
    border-radius: 0.25rem;
    cursor: pointer;
}

.theme-option:hover {
    background: var(--color-bg-offset);
}

.theme-option.active {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px var(--color-primary);
}
```

## Best Practices

1. **Accessibility**: Use proper ARIA attributes and keyboard navigation
2. **Performance**: Minimize CSS variables and use efficient JavaScript
3. **UX**: Provide visual feedback and smooth transitions
4. **SEO**: Ensure themes don't break search engine crawling
5. **Progressive Enhancement**: Make sure your site works without JavaScript

## Browser Support

- **CSS Custom Properties**: Modern browsers (IE 11+ with fallbacks)
- **LocalStorage**: All modern browsers
- **prefers-color-scheme**: Modern browsers
- **JavaScript**: ES6+ features (transpile for older browsers)

## Customization Tips

1. **Start simple**: Begin with light/dark themes only
2. **Use color theory**: Ensure proper contrast and readability
3. **Test accessibility**: Use tools like WCAG contrast checker
4. **Consider performance**: Avoid too many complex themes
5. **Add transitions**: Smooth color changes improve UX

## Troubleshooting

1. **Flash of unstyled content**: Use inline script to set initial theme
2. **localStorage not working**: Check browser privacy settings
3. **Colors not applying**: Verify CSS variable names and scoping
4. **JavaScript errors**: Check for missing DOM elements

This documentation provides a complete reference for implementing a similar theme switcher system in your own static blog website.