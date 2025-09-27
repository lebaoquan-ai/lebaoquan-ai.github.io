#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const PostProcessor = require("./post-processor");

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const copyFile = promisify(fs.copyFile);
const mkdir = promisify(fs.mkdir);

class StaticSiteGenerator {
  constructor() {
    this.srcDir = path.join(__dirname, "../..");
    this.publicDir = path.join(this.srcDir, "public");
    this.assetsDir = path.join(this.publicDir, "assets");
    this.postProcessor = new PostProcessor();
  }

  async build() {
    console.log("🚀 Starting build process...");

    try {
      // Clean public directory
      await this.cleanPublicDir();

      // Copy assets
      await this.copyAssets();

      // Build homepage
      await this.buildHomepage();

      // Build blog pages using new post processor
      const blogPosts = await this.postProcessor.processPosts();

      // Build homepage with featured posts
      await this.buildHomepage(blogPosts.slice(0, 6));

      // Build about page
      await this.buildAboutPage();

      // Build 404 page
      await this.buildNotFoundPage();

      console.log("✅ Build completed successfully!");
    } catch (error) {
      console.error("❌ Build failed:", error);
      process.exit(1);
    }
  }

  async cleanPublicDir() {
    console.log("🧹 Cleaning public directory...");

    if (fs.existsSync(this.publicDir)) {
      const files = fs.readdirSync(this.publicDir);
      for (const file of files) {
        const filePath = path.join(this.publicDir, file);
        if (fs.lstatSync(filePath).isDirectory()) {
          fs.rmSync(filePath, { recursive: true, force: true });
        } else {
          fs.unlinkSync(filePath);
        }
      }
    }

    // Create necessary directories
    await mkdir(this.assetsDir, { recursive: true });
    await mkdir(path.join(this.assetsDir, "css"), { recursive: true });
    await mkdir(path.join(this.assetsDir, "js"), { recursive: true });
    await mkdir(path.join(this.assetsDir, "images"), { recursive: true });
    await mkdir(path.join(this.publicDir, "blog"), { recursive: true });
    await mkdir(path.join(this.publicDir, "about"), { recursive: true });
  }

  async copyAssets() {
    console.log("📦 Copying assets...");

    // Copy CSS files
    const cssFiles = [
      "style.css",
      "_base.css",
      "_typography.css",
      "_components.css",
      "_themes.css",
    ];

    for (const file of cssFiles) {
      const srcPath = path.join(this.srcDir, "src", "assets", "css", file);
      const destPath = path.join(this.assetsDir, "css", file);

      if (fs.existsSync(srcPath)) {
        await copyFile(srcPath, destPath);
      }
    }

    // Copy JavaScript files
    const jsFiles = [
      "theme-switcher.js",
      "typed_text.js",
      "infinite-scroll.js",
      "main.js",
      "initial-theme.js",
    ];

    for (const file of jsFiles) {
      const srcPath = path.join(this.srcDir, "src", "assets", "js", file);
      const destPath = path.join(this.assetsDir, "js", file);

      if (fs.existsSync(srcPath)) {
        await copyFile(srcPath, destPath);
      }
    }

    // Copy images from source assets
    const imageFiles = [
      "profile.jpg",
      "profile-large.jpg",
      "blog-post-1.jpg",
      "blog-post-2.jpg",
      "blog-post-3.jpg",
      "blog-post-4.jpg",
      "blog-post-5.jpg",
      "blog-post-6.jpg",
    ];

    for (const file of imageFiles) {
      const srcPath = path.join(this.srcDir, "src", "assets", "images", file);
      const destPath = path.join(this.assetsDir, "images", file);

      if (fs.existsSync(srcPath)) {
        await copyFile(srcPath, destPath);
      } else {
        console.warn(
          `Warning: ${file} not found in source assets, creating placeholder`,
        );
        await writeFile(destPath, `Placeholder for ${file}`);
      }
    }
  }

  async buildHomepage(featuredPosts = []) {
    console.log("🏠 Building homepage...");

    // Read layout files
    const baseLayout = await readFile(
      path.join(this.srcDir, "src", "_layouts", "base.html"),
      "utf8",
    );
    const homeLayout = await readFile(
      path.join(this.srcDir, "src", "_layouts", "home.html"),
      "utf8",
    );
    const header = await readFile(
      path.join(this.srcDir, "src", "_includes", "header.html"),
      "utf8",
    );
    const footer = await readFile(
      path.join(this.srcDir, "src", "_includes", "footer.html"),
      "utf8",
    );

    // Generate featured posts HTML
    const featuredPostsHTML = featuredPosts
      .map(
        (post) => `
    <article class="post-card">
        <img
            src="/blog/${post.slug}/images/${post.slug}-thumbnail.png"
            alt="${post.title}"
            class="post-card__image"
        />
        <div class="post-card__content">
            <h3 class="post-card__title">
                ${post.title}
            </h3>
            <p class="post-card__excerpt">
                ${post.excerpt}
            </p>
            <div class="post-card__meta">
                <span class="post-card__date">📅 ${this.formatDate(post.date)}</span>
                <span class="post-card__read-time">⏱️ ${post.readingTime || 5} min read</span>
            </div>
        </div>
    </article>`,
      )
      .join("");

    // Replace featured posts in home layout
    const updatedHomeLayout = homeLayout.replace(
      "{{featuredPosts}}",
      featuredPostsHTML,
    );

    // Build homepage by combining layout files
    let homepageHTML = baseLayout
      .replace('{% include "header.html" %}', header)
      .replace('{% include "footer.html" %}', footer)
      .replace("{{content}}", updatedHomeLayout)
      .replace("{{title}}", "Home")
      .replace(
        "{{description}}",
        "Welcome to The Fool's Blog - A personal blog about web development, technology, and life",
      );

    await writeFile(path.join(this.publicDir, "index.html"), homepageHTML);
  }

  async buildAboutPage() {
    console.log("👤 Building about page...");

    // Read about.md content
    const aboutContent = await readFile(
      path.join(this.srcDir, "src", "content", "about.md"),
      "utf8",
    );

    // Parse frontmatter from about.md
    const frontmatterMatch = aboutContent.match(
      /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/,
    );
    if (!frontmatterMatch) {
      throw new Error("Invalid about.md format - missing frontmatter");
    }

    const frontmatter = frontmatterMatch[1];
    const content = frontmatterMatch[2];

    // Parse frontmatter properties
    const titleMatch = frontmatter.match(/title:\s*"([^"]+)"/);
    const descriptionMatch = frontmatter.match(/description:\s*"([^"]+)"/);
    const authorMatch = frontmatter.match(/author:\s*"([^"]+)"/);
    const dateMatch = frontmatter.match(/date:\s*"([^"]+)"/);

    const title = titleMatch ? titleMatch[1] : "About";
    const description = descriptionMatch ? descriptionMatch[1] : "About page";
    const author = authorMatch ? authorMatch[1] : "The Fool";
    const date = dateMatch
      ? dateMatch[1]
      : new Date().toISOString().split("T")[0];

    // Read layout files
    const baseLayout = await readFile(
      path.join(this.srcDir, "src", "_layouts", "base.html"),
      "utf8",
    );
    const aboutLayout = await readFile(
      path.join(this.srcDir, "src", "_layouts", "about.html"),
      "utf8",
    );
    const header = await readFile(
      path.join(this.srcDir, "src", "_includes", "header.html"),
      "utf8",
    );
    const footer = await readFile(
      path.join(this.srcDir, "src", "_includes", "footer.html"),
      "utf8",
    );

    // Parse sections from content and create zigzag layout
    const sections = this.parseAboutSections(content);

    // ABOUT PAGE STRUCTURE EXPLANATION:
    // The about page now displays section headers prominently:
    // 1. Hero section (title and subtitle from frontmatter)
    // 2. Content sections with visible headers positioned left/right:
    //    - Section 1: Header on left, centered text content
    //    - Section 2: Header on right, centered text content
    //    - Section 3: Header centered, centered text content
    // Each section title from ## headers becomes a prominent visual element

    // Create header-based layout
    let layoutContent = "";
    sections.forEach((section, index) => {
      const headerHtml = `<h2 class="about-section__header">${section.title}</h2>`;

      if (index === 0) {
        // First section: header on left, content centered
        layoutContent += `
          <div class="about-section about-section--header-left">
            <div class="about-section__header-container">
              ${headerHtml}
            </div>
            <div class="about-section__content-centered">
              ${section.content}
            </div>
          </div>`;
      } else if (index === sections.length - 1) {
        // Last section: header centered, content centered
        layoutContent += `
          <div class="about-section about-section--header-center">
            <div class="about-section__header-container about-section__header-container--center">
              ${headerHtml}
            </div>
            <div class="about-section__content-centered">
              ${section.content}
            </div>
          </div>`;
      } else {
        // Middle sections: header on right, content centered
        layoutContent += `
          <div class="about-section about-section--header-right">
            <div class="about-section__content-centered">
              ${section.content}
            </div>
            <div class="about-section__header-container">
              ${headerHtml}
            </div>
          </div>`;
      }
    });

    // Replace template variables in about layout
    const processedAboutLayout = aboutLayout
      .replace("{{title}}", title)
      .replace("{{description}}", description)
      .replace("{{content}}", layoutContent);

    // Build final about page
    let aboutHTML = baseLayout
      .replace('{% include "header.html" %}', header)
      .replace('{% include "footer.html" %}', footer)
      .replace("{{content}}", processedAboutLayout)
      .replace("{{title}}", title)
      .replace("{{description}}", description);

    await writeFile(
      path.join(this.publicDir, "about", "index.html"),
      aboutHTML,
    );
  }

  parseAboutSections(content) {
    // SECTION PARSING LOGIC:
    // This method splits the about.md content into sections based on ## headers
    // Example about.md structure:
    //   # A Fool's Blog (ignored - main title)
    //   ## Section 1 Header -> becomes section 1
    //   Content for section 1...
    //   ## Section 2 Header -> becomes section 2
    //   Content for section 2...

    const lines = content.split("\n");
    const sections = [];
    let currentSection = { title: "", content: "" };

    for (const line of lines) {
      const h2Match = line.match(/^##\s+(.+)$/);

      if (h2Match) {
        // Save previous section if it has content
        if (currentSection.content.trim()) {
          sections.push({ ...currentSection });
        }

        // Start new section with the header title
        currentSection = {
          title: h2Match[1],
          content: "",
        };
      } else {
        // Add line to current section (skip the main # title)
        if (line.trim() && !line.startsWith("# ")) {
          if (currentSection.content) {
            currentSection.content += "\n";
          }
          currentSection.content += line;
        }
      }
    }

    // Add the last section
    if (currentSection.content.trim()) {
      sections.push(currentSection);
    }

    // Convert markdown to HTML for each section
    return sections.map((section) => ({
      title: section.title,
      content: this.convertMarkdownToHTML(section.content),
    }));
  }

  convertMarkdownToHTML(markdown) {
    return markdown
      .replace(/^# (.*$)/gim, '<h1 class="about-heading">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="about-subheading">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="about-section">$1</h3>')
      .replace(/^\* (.*$)/gim, '<li class="about-list-item">$1</li>')
      .replace(/\n\n/gim, '</p><p class="about-paragraph">')
      .replace(/^(?!<[h|l])/gim, '<p class="about-paragraph">')
      .replace(/$/gim, "</p>")
      .replace(/<p class="about-paragraph"><\/p>/g, "")
      .replace(
        /<li class="about-list-item">(.*?)<\/li>/g,
        '<ul class="about-list"><li class="about-list-item">$1</li></ul>',
      )
      .replace(/<\/ul>\s*<ul class="about-list">/g, "")
      .replace(
        /<blockquote>\s*<p class="about-paragraph">(.*?)<\/p>\s*<\/blockquote>/g,
        '<blockquote class="about-quote">$1</blockquote>',
      );
  }

  async getHeaderHTML() {
    return await readFile(
      path.join(this.srcDir, "src", "_includes", "header.html"),
      "utf8",
    );
  }

  async getFooterHTML() {
    return await readFile(
      path.join(this.srcDir, "src", "_includes", "footer.html"),
      "utf8",
    );
  }

  getThemePanelHTML() {
    return `
    <div class="theme-panel" role="dialog" aria-label="Theme selector">
        <div class="theme-panel__header">
            <h3>Choose Theme</h3>
            <button class="theme-panel__close" aria-label="Close theme picker">×</button>
        </div>
        <div class="theme-panel__grid">
            <button class="theme-option" data-theme="default" aria-label="Select Default theme">
                <span class="theme-option__icon">☀️</span>
                <span class="theme-option__name">Default</span>
                <div class="theme-option__colors">
                    <span class="theme-color theme-color--primary" style="background-color: var(--color-primary)"></span>
                    <span class="theme-color theme-color--secondary" style="background-color: var(--color-secondary)"></span>
                    <span class="theme-color theme-color--accent" style="background-color: var(--color-accent)"></span>
                </div>
            </button>
            <button class="theme-option" data-theme="dark" aria-label="Select Dark theme">
                <span class="theme-option__icon">🌙</span>
                <span class="theme-option__name">Dark</span>
                <div class="theme-option__colors">
                    <span class="theme-color theme-color--primary" style="background-color: var(--color-primary)"></span>
                    <span class="theme-color theme-color--secondary" style="background-color: var(--color-secondary)"></span>
                    <span class="theme-color theme-color--accent" style="background-color: var(--color-accent)"></span>
                </div>
            </button>
            <button class="theme-option" data-theme="beach" aria-label="Select Beach theme">
                <span class="theme-option__icon">🏖️</span>
                <span class="theme-option__name">Beach</span>
                <div class="theme-option__colors">
                    <span class="theme-color theme-color--primary" style="background-color: var(--color-primary)"></span>
                    <span class="theme-color theme-color--secondary" style="background-color: var(--color-secondary)"></span>
                    <span class="theme-color theme-color--accent" style="background-color: var(--color-accent)"></span>
                </div>
            </button>
            <button class="theme-option" data-theme="choco" aria-label="Select Choco theme">
                <span class="theme-option__icon">🍫</span>
                <span class="theme-option__name">Choco</span>
                <div class="theme-option__colors">
                    <span class="theme-color theme-color--primary" style="background-color: var(--color-primary)"></span>
                    <span class="theme-color theme-color--secondary" style="background-color: var(--color-secondary)"></span>
                    <span class="theme-color theme-color--accent" style="background-color: var(--color-accent)"></span>
                </div>
            </button>
            <button class="theme-option" data-theme="moomoo" aria-label="Select Moomoo theme">
                <span class="theme-option__icon">🐮</span>
                <span class="theme-option__name">Moomoo</span>
                <div class="theme-option__colors">
                    <span class="theme-color theme-color--primary" style="background-color: var(--color-primary)"></span>
                    <span class="theme-color theme-color--secondary" style="background-color: var(--color-secondary)"></span>
                    <span class="theme-color theme-color--accent" style="background-color: var(--color-accent)"></span>
                </div>
            </button>
            <button class="theme-option" data-theme="bowser" aria-label="Select Bowser theme">
                <span class="theme-option__icon">👾</span>
                <span class="theme-option__name">Bowser</span>
                <div class="theme-option__colors">
                    <span class="theme-color theme-color--primary" style="background-color: var(--color-primary)"></span>
                    <span class="theme-color theme-color--secondary" style="background-color: var(--color-secondary)"></span>
                    <span class="theme-color theme-color--accent" style="background-color: var(--color-accent)"></span>
                </div>
            </button>
            <button class="theme-option" data-theme="yoshi" aria-label="Select Yoshi theme">
                <span class="theme-option__icon">🦖</span>
                <span class="theme-option__name">Yoshi</span>
                <div class="theme-option__colors">
                    <span class="theme-color theme-color--primary" style="background-color: var(--color-primary)"></span>
                    <span class="theme-color theme-color--secondary" style="background-color: var(--color-secondary)"></span>
                    <span class="theme-color theme-color--accent" style="background-color: var(--color-accent)"></span>
                </div>
            </button>
            <button class="theme-option" data-theme="rainbow" aria-label="Select Rainbow theme">
                <span class="theme-option__icon">🌈</span>
                <span class="theme-option__name">Rainbow</span>
                <div class="theme-option__colors">
                    <span class="theme-color theme-color--primary" style="background-color: var(--color-primary)"></span>
                    <span class="theme-color theme-color--secondary" style="background-color: var(--color-secondary)"></span>
                    <span class="theme-color theme-color--accent" style="background-color: var(--color-accent)"></span>
                </div>
            </button>
            <button class="theme-option" data-theme="lobster" aria-label="Select Lobster theme">
                <span class="theme-option__icon">🦞</span>
                <span class="theme-option__name">Lobster</span>
                <div class="theme-option__colors">
                    <span class="theme-color theme-color--primary" style="background-color: var(--color-primary)"></span>
                    <span class="theme-color theme-color--secondary" style="background-color: var(--color-secondary)"></span>
                    <span class="theme-color theme-color--accent" style="background-color: var(--color-accent)"></span>
                </div>
            </button>
            <button class="theme-option" data-theme="hackernews" aria-label="Select Hacker News theme">
                <span class="theme-option__icon">📰</span>
                <span class="theme-option__name">Hacker News</span>
                <div class="theme-option__colors">
                    <span class="theme-color theme-color--primary" style="background-color: var(--color-primary)"></span>
                    <span class="theme-color theme-color--secondary" style="background-color: var(--color-secondary)"></span>
                    <span class="theme-color theme-color--accent" style="background-color: var(--color-accent)"></span>
                </div>
            </button>
        </div>
    </div>`;
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  async buildNotFoundPage() {
    console.log("🚫 Building 404 page...");

    // Read layout files
    const baseLayout = await readFile(
      path.join(this.srcDir, "src", "_layouts", "base.html"),
      "utf8",
    );
    const notFoundLayout = await readFile(
      path.join(this.srcDir, "src", "_layouts", "404.html"),
      "utf8",
    );
    const header = await readFile(
      path.join(this.srcDir, "src", "_includes", "header.html"),
      "utf8",
    );
    const footer = await readFile(
      path.join(this.srcDir, "src", "_includes", "footer.html"),
      "utf8",
    );

    // Build 404 page by combining layout files
    let notFoundHTML = baseLayout
      .replace('{% include "header.html" %}', header)
      .replace('{% include "footer.html" %}', footer)
      .replace("{{content}}", notFoundLayout)
      .replace("{{title}}", "404 - Page Not Found")
      .replace(
        "{{description}}",
        "The page you're looking for doesn't exist. Return to The Fool's Blog homepage.",
      );

    await writeFile(path.join(this.publicDir, "404.html"), notFoundHTML);
  }
}

if (require.main === module) {
  const generator = new StaticSiteGenerator();
  generator.build();
}

module.exports = StaticSiteGenerator;
