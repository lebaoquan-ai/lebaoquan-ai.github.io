# Deployment Guide for imafool.dev

## Overview
This guide explains how to deploy your static website to imafool.dev using your current GitHub repository.

## Prerequisites
- Domain: imafool.dev
- GitHub repository: lebaoquan-ai/lebaoquan-ai.github.io.git
- Static site build process: `npm run build`

## Deployment Options

### Option 1: GitHub Pages (Recommended)
1. **Configure GitHub Pages**:
   ```bash
   # Build the site
   npm run build
   
   # The public/ directory contains your built site
   ```
   
2. **GitHub Pages Settings**:
   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: main
   - Directory: /public
   - Custom domain: imafool.dev

3. **DNS Configuration**:
   - Add CNAME record: `www.imafool.dev` → `lebaoquan-ai.github.io`
   - Add A record: `imafool.dev` → `185.199.108.153`
   - Add A record: `imafool.dev` → `185.199.109.153`
   - Add A record: `imafool.dev` → `185.199.110.153`
   - Add A record: `imafool.dev` → `185.199.111.153`

### Option 2: Netlify
1. **Connect to Netlify**:
   - Connect your GitHub repository to Netlify
   - Build command: `npm run build`
   - Publish directory: `public`

2. **Custom Domain**:
   - Add `imafool.dev` in Netlify domain settings
   - Configure DNS as above

### Option 3: Vercel
1. **Deploy to Vercel**:
   - Import your GitHub repository to Vercel
   - Build command: `npm run build`
   - Output directory: `public`

2. **Custom Domain**:
   - Add `imafool.dev` in Vercel domain settings
   - Configure DNS as above

## Build Process
Your site uses a custom build script that:
1. Cleans the public directory
2. Copies assets from src/
3. Generates HTML from layout files
4. Creates all necessary pages (home, blog, about)

## Files to Deploy
- `public/` directory (built site)
- `src/` directory (source files)
- `package.json` (dependencies)
- `src/scripts/build.js` (build script)

## Ignored Files
- `node_modules/`
- `dist/`
- Temporary files and logs
- Development files

## Continuous Deployment
For automated deployment, set up GitHub Actions or use the hosting platform's built-in CI/CD.

## Post-Deployment
1. Test all pages: Home, Blog, About
2. Verify theme switcher functionality
3. Check responsive design
4. Test social media links
5. Verify custom Substack logo display

## Troubleshooting
- Build fails: Run `npm install` first
- Domain issues: Check DNS propagation
- Styling issues: Verify CSS files are copied correctly
- Broken links: Check file paths in built HTML