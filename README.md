# The Fool's Blog

A modern, responsive static blog with 10 color themes, built with HTML, CSS, and JavaScript.

## Features

- 🎨 10 themes (Light, Dark, Beach, Choco, Moomoo, Bowser, Yoshi, Rainbow, Lobster, Hacker News)
- 📱 Fully responsive design
- ⚡ Fast static site generation
- 🔄 Infinite scroll on blog pages
- 📝 3-column blog post layout
- 🧠 Smart theme switcher with persistence
- ♿ Accessibility-first design

## Quick Start

```bash
# Install dependencies
npm install

# Build the static site
npm run build

# Start development server
npm run dev
```

## Project Structure

```
src/
├── assets/          # CSS, JS, images
├── content/         # Markdown content (preserved)
├── _includes/       # HTML partials
├── _layouts/       # Page templates
└── scripts/        # Build scripts

public/             # Generated static site
```

## Themes

- **Default** - Clean light theme
- **Dark** - Dark mode with system preference support
- **Beach** - Warm coastal colors
- **Choco** - Rich brown tones
- **Moomoo** - Soft pastel pink
- **Bowser** - Dark purple with green accents
- **Yoshi** - Fresh green theme
- **Rainbow** - Animated colorful theme
- **Lobster** - Pink with custom fonts
- **Hacker News** - Classic HN orange theme

## Development

The build script generates static HTML files from templates. Content can be added as markdown files in `src/content/` (currently preserved from original structure).

## License

MIT