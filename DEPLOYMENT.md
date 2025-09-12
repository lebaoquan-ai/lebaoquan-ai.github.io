# Deployment Guide for The Fool's Blog

This guide will help you deploy your static blog to GitHub Pages with a custom domain.

## Prerequisites

- A GitHub account
- A custom domain (optional)
- Node.js installed locally

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run serve
```

3. Build the site:
```bash
npm run build
```

The built site will be in the `dist/` directory.

## GitHub Pages Deployment

### Step 1: Push to GitHub

1. Make sure your repository is on GitHub
2. Commit your changes:
```bash
git add .
git commit -m "Setup static blog"
git push origin main
```

### Step 2: Configure GitHub Pages

1. Go to your repository on GitHub
2. Click on "Settings"
3. Navigate to "Pages" in the left sidebar
4. Under "Build and deployment", select "GitHub Actions" as the source

The site will automatically deploy to: `https://your-username.github.io/your-repo-name/`

### Step 3: Custom Domain Setup (Optional)

1. **Update CNAME in build script:**
   Edit `scripts/build.js` and change:
   ```javascript
   fs.writeFileSync(cnamePath, 'your-custom-domain.com');
   ```
   Replace `your-custom-domain.com` with your actual domain.

2. **Update GitHub Actions workflow:**
   Edit `.github/workflows/deploy.yml` and change:
   ```yaml
   cname: your-custom-domain.com
   ```

3. **Configure DNS settings:**
   - Go to your domain registrar's DNS settings
   - Add an `A` record pointing to GitHub Pages IPs:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - Or add a `CNAME` record pointing to `your-username.github.io`

4. **Enable HTTPS:**
   - After DNS propagates, GitHub Pages will automatically provision SSL certificates
   - Enable "Enforce HTTPS" in the GitHub Pages settings

## Content Management

### Adding Blog Posts

1. Create a new markdown file in `src/content/blog/`
2. Use this frontmatter template:

```markdown
---
title: "Your Post Title"
date: "YYYY-MM-DD"
description: "Brief description of your post"
author: "The Fool"
coverImage: "/assets/images/your-image.jpg"
slug: "your-post-slug"
---

# Your Post Title

Write your content here...
```

### Adding Pages

1. Create a new markdown file in `src/content/`
2. Include appropriate frontmatter
3. Update the build script if needed to handle the new page

### Styling

- Edit CSS files in `src/assets/css/`
- Add images to `src/assets/images/`
- Update JavaScript in `src/assets/js/`

## Troubleshooting

### Build Issues

If the build fails:
1. Check that all dependencies are installed: `npm install`
2. Verify all markdown files have proper frontmatter
3. Check the console for specific error messages

### Deployment Issues

If deployment fails:
1. Check the GitHub Actions logs in your repository
2. Ensure your repository is public or has GitHub Pages enabled
3. Verify the workflow file is in `.github/workflows/deploy.yml`

### Custom Domain Issues

If your custom domain isn't working:
1. Verify DNS settings are correct
2. Wait 24-48 hours for DNS propagation
3. Check that the CNAME file is properly generated
4. Ensure the domain is correctly set in GitHub Pages settings

## Project Structure

```
src/
├── _layouts/          # HTML templates
├── _includes/         # Reusable components
├── assets/            # CSS, JS, images
├── content/           # Markdown content
│   ├── index.md       # Home page
│   ├── about.md       # About page
│   └── blog/          # Blog posts
scripts/
├── build.js           # Build script
└── serve.js           # Development server
dist/                  # Built site (generated)
```

## Features

- **Static Site Generation**: Converts Markdown to HTML
- **Multi-theme Support**: Light, Dark, Blue, Green themes
- **Responsive Design**: Works on all devices
- **Blog Pagination**: Automatic post listing
- **SEO-friendly**: Clean HTML structure
- **Fast Loading**: Optimized static files

## Support

If you encounter any issues:
1. Check the console for error messages
2. Verify all file paths are correct
3. Ensure Node.js dependencies are up to date
4. Review the build script for any customization needs

Happy blogging! 🚀