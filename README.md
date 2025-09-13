# The Fool's Blog

A modern, responsive static blog built with HTML, CSS, JavaScript, and Node.js. Features multi-theme support, Markdown content management, and automatic deployment to GitHub Pages.

## Features

- **Static Site Generation**: Fast, secure, and easy to deploy
- **Multi-theme Support**: Light, Dark, Blue, and Green themes
- **Responsive Design**: Works beautifully on all devices
- **Markdown Content**: Write posts in Markdown with frontmatter
- **SEO Friendly**: Clean HTML structure and meta tags
- **GitHub Pages Ready**: Automatic deployment via GitHub Actions
- **Custom Domain Support**: Easy domain configuration

## Quick Start

### Prerequisites

- Node.js 16+
- Git
- A GitHub account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/lebaoquan-ai.github.io.git
cd lebaoquan-ai.github.io
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run serve
```

4. Open http://localhost:3000 in your browser

## Development

### Available Scripts

- `npm run serve` - Start development server with auto-build
- `npm run build` - Build the static site to `dist/` directory
- `npm run deploy` - Build and deploy to GitHub Pages

### Project Structure

```
src/
├── _layouts/          # HTML templates
│   └── base.html      # Base layout
├── _includes/         # Reusable components
│   ├── header.html    # Navigation header
│   └── footer.html    # Site footer
├── assets/            # Static assets
│   ├── css/           # Stylesheets
│   │   ├── base.css   # Main styles
│   │   └── themes.css # Theme variables
│   ├── js/            # JavaScript
│   └── images/        # Images
└── content/           # Content files
    ├── index.md       # Home page
    ├── about.md       # About page
    └── blog/          # Blog posts
```

### Adding Contenon to get LSP support for GitHub Actions workflow files.
Zed Extension CLI - The official command-line tool for creating and managing Zed extensions.
zedtutor - An interactive tutorial to learn the Zed IDE by doing.t

#### Blog Posts

Create a new file in `src/content/blog/` with this structure:

```markdown
---
title: "Your Post Title"
date: "2024-01-15"
description: "Brief description"
author: "The Fool"
coverImage: "/assets/images/post-image.jpg"
slug: "your-post-slug"
---

# Your Post Title

Write your content here...
```

#### Pages

Add pages to `src/content/` with appropriate frontmatter.

### Themes

The blog supports four themes:
- **Light**: Default theme
- **Dark**: Dark color scheme
- **Blue**: Blue accent theme
- **Green**: Green accent theme

Users can switch themes using the palette icon in the navigation.

## Deployment

### GitHub Pages

1. Push your changes to GitHub
2. GitHub Actions will automatically build and deploy your site
3. Your site will be available at `https://your-username.github.io/your-repo-name/`

### Custom Domain

1. Update your domain in `scripts/build.js` and `.github/workflows/deploy.yml`
2. Configure DNS settings with your domain registrar
3. Enable HTTPS in GitHub Pages settings

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

## Customization

### Styling

- Edit `src/assets/css/base.css` for main styles
- Modify `src/assets/css/themes.css` for theme colors
- Add custom CSS in the appropriate files

### Layout

- Modify `src/_layouts/base.html` for the main layout
- Update `src/_includes/` for reusable components

### Functionality

- Edit `src/assets/js/main.js` for interactive features
- Modify `src/assets/js/theme-switcher.js` for theme handling

## Technologies Used

- **Node.js**: Build tool and development server
- **Express**: Local development server
- **Marked**: Markdown to HTML conversion
- **Gray-matter**: Frontmatter parsing
- **GitHub Actions**: Automated deployment
- **Font Awesome**: Icons
- **Inter**: Font family

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Commit and push to your branch
5. Open a pull request

## License

MIT License - see [LICENSE](LICENSE) for details.

## Author

The Fool - [GitHub Profile](https://github.com/your-username)

## Acknowledgments

- Inspired by modern static site generators
- Built with love for the web development community
- Theme ideas from various design systems

---

> "Ideas is to share, Attention is to keep"
