#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const copyFile = promisify(fs.copyFile);
const mkdir = promisify(fs.mkdir);

class StaticSiteGenerator {
  constructor() {
    this.srcDir = path.join(__dirname, "../..");
    this.publicDir = path.join(this.srcDir, "public");
    this.assetsDir = path.join(this.publicDir, "assets");

    // Blog posts data (in a real scenario, this would come from markdown files)
    this.blogPosts = [
      {
        slug: "getting-started-with-web-development",
        title: "Getting Started with Web Development",
        description:
          "A comprehensive guide to beginning your journey in web development",
        date: "2024-09-15",
        readingTime: 5,
        coverImage: "/assets/images/blog-post-1.jpg",
        category: "Web Development",
        excerpt:
          "A comprehensive guide to beginning your journey in web development, covering essential technologies and best practices.",
      },
      {
        slug: "javascript-best-practices",
        title: "JavaScript Best Practices",
        description:
          "Learn the most important JavaScript best practices for clean code",
        date: "2024-09-12",
        readingTime: 8,
        coverImage: "/assets/images/blog-post-2.jpg",
        category: "JavaScript",
        excerpt:
          "Learn the most important JavaScript best practices that every developer should know to write clean, maintainable code.",
      },
      {
        slug: "building-responsive-layouts",
        title: "Building Responsive Layouts",
        description: "Master the art of creating responsive web layouts",
        date: "2024-09-10",
        readingTime: 6,
        coverImage: "/assets/images/blog-post-3.jpg",
        category: "CSS",
        excerpt:
          "Master the art of creating responsive web layouts that work perfectly across all devices and screen sizes.",
      },
      {
        slug: "css-grid-vs-flexbox",
        title: "CSS Grid vs Flexbox",
        description:
          "Understanding when to use CSS Grid and when to use Flexbox",
        date: "2024-09-08",
        readingTime: 7,
        coverImage: "/assets/images/blog-post-4.jpg",
        category: "CSS",
        excerpt:
          "Explore CSS Grid and learn how to create complex, responsive layouts with ease and precision.",
      },
      {
        slug: "mastering-git-workflow",
        title: "Mastering Git Workflow",
        description:
          "Deep dive into Git workflows and collaboration techniques",
        date: "2024-09-05",
        readingTime: 10,
        coverImage: "/assets/images/blog-post-5.jpg",
        category: "Git",
        excerpt:
          "A deep dive into Git workflows and how to use them effectively in your development process.",
      },
      {
        slug: "web-performance-optimization",
        title: "Web Performance Optimization",
        description: "Essential techniques for optimizing website performance",
        date: "2024-09-03",
        readingTime: 12,
        coverImage: "/assets/images/blog-post-6.jpg",
        category: "Performance",
        excerpt:
          "Learn essential techniques to optimize your website's performance and provide a better user experience.",
      },
    ];
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

      // Build blog pages
      await this.buildBlogPages();

      // Build about page
      await this.buildAboutPage();

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

    // Copy placeholder images (in a real scenario, these would be actual images)
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
      const destPath = path.join(this.assetsDir, "images", file);
      // Create a placeholder image file
      await writeFile(destPath, `Placeholder for ${file}`);
    }
  }

  async buildHomepage() {
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

    // Build homepage by combining layout files
    let homepageHTML = baseLayout
      .replace('{% include "header.html" %}', header)
      .replace('{% include "footer.html" %}', footer)
      .replace("{{content}}", homeLayout)
      .replace("{{title}}", "Home")
      .replace(
        "{{description}}",
        "Welcome to The Fool's Blog - A personal blog about web development, technology, and life",
      );

    await writeFile(path.join(this.publicDir, "index.html"), homepageHTML);
  }

  async buildBlogPages() {
    console.log("📝 Building blog pages...");

    // Build blog listing page
    const blogListingTemplate = `
<!DOCTYPE html>
<html lang="en" data-theme="default">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Blog posts from The Fool's Blog - A personal blog about web development, technology, and life">
    <meta name="theme-color" content="#f7f7f9">
    <title>Blogs - The Fool's Blog</title>
    <link rel="stylesheet" href="/assets/css/style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
    <script src="/assets/js/initial-theme.js" defer></script>
</head>
<body>
    ${await this.getHeaderHTML()}

    <main>
        <section class="blog-list">
            <div class="blog-list__header">
                <h1 class="blog-list__title">All Posts</h1>
                <p class="blog-list__subtitle">Discover my thoughts and insights on web development, technology, and life</p>
            </div>

            <div class="blog-list__container" id="blogContainer">
                ${this.blogPosts
                  .map(
                    (post) => `
                <article class="blog-list__item">
                    <div class="blog-list__content">
                        <img src="${post.coverImage}" alt="${post.title}" class="blog-list__image">
                        <div class="blog-list__text">
                            <h2 class="blog-list__title"><a href="/blog/${post.slug}/">${post.title}</a></h2>
                            <p class="blog-list__excerpt">${post.excerpt}</p>
                            <div class="blog-list__meta">
                                <span class="blog-list__date">📅 ${this.formatDate(post.date)}</span>
                                <span class="blog-list__read-time">⏱️ ${post.readingTime} min read</span>
                                <span class="blog-list__category">🏷️ ${post.category}</span>
                            </div>
                        </div>
                    </div>
                </article>
                `,
                  )
                  .join("")}
            </div>

            <div class="blog-list__loading" id="loadingIndicator" style="display: none;">
                <div class="loading-spinner"></div>
                <p>Loading more posts...</p>
            </div>
        </section>
    </main>

    ${await this.getFooterHTML()}
    ${this.getThemePanelHTML()}

    <script src="/assets/js/theme-switcher.js"></script>
    <script src="/assets/js/main.js"></script>
    <script src="/assets/js/infinite-scroll.js"></script>
</body>
</html>`;

    await writeFile(
      path.join(this.publicDir, "blog", "index.html"),
      blogListingTemplate,
    );

    // Build individual blog post pages
    for (const post of this.blogPosts) {
      const postDir = path.join(this.publicDir, "blog", post.slug);
      await mkdir(postDir, { recursive: true });

      const postTemplate = `
<!DOCTYPE html>
<html lang="en" data-theme="default">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${post.description}">
    <meta name="theme-color" content="#f7f7f9">
    <title>${post.title} - The Fool's Blog</title>
    <link rel="stylesheet" href="/assets/css/style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet">
    <script src="/assets/js/initial-theme.js" defer></script>
</head>
<body>
    ${await this.getHeaderHTML()}

    <main class="post-layout">
        <article class="post-content">
            <header class="post-header">
                <h1>${post.title}</h1>
                <p class="post-meta">📅 ${this.formatDate(post.date)} • ⏱️ ${post.readingTime} min read</p>
                <p class="post-description">${post.description}</p>
                <img src="${post.coverImage}" alt="${post.title}" class="post-cover">
            </header>

            <div class="post-body">
                <div class="post-main">
                    <h2>Introduction</h2>
                    <p>This is a placeholder for the actual blog post content. In a real implementation, this would be populated from markdown files with full blog content, including proper formatting, code blocks, quotes, and images.</p>

                    <h2>What You'll Learn</h2>
                    <p>This article covers important concepts related to ${post.title.toLowerCase()}. The complete implementation would include:</p>

                    <ul>
                        <li>Detailed explanations and examples</li>
                        <li>Code snippets with syntax highlighting</li>
                        <li>Best practices and common pitfalls</li>
                        <li>Real-world applications and case studies</li>
                        <li>Further reading and resources</li>
                    </ul>

                    <h2>Conclusion</h2>
                    <p>Thank you for reading! This is a simplified version of what would be a comprehensive blog post with rich content, proper formatting, and interactive elements.</p>

                    <blockquote>
                        "The best way to learn is by doing. Practice what you've learned and build amazing things!"
                    </blockquote>
                </div>

                <div class="post-sidebar">
                    <div class="quotes-sidebar">
                        <blockquote class="sidebar-quote">
                            "Learning never exhausts the mind."
                        </blockquote>
                        <blockquote class="sidebar-quote">
                            "The only way to do great work is to love what you do."
                        </blockquote>
                        <blockquote class="sidebar-quote">
                            "Innovation distinguishes between a leader and a follower."
                        </blockquote>
                    </div>

                    <div class="code-sidebar">
                        <div class="code-snippet">
                            <h4>Example Code</h4>
                            <pre><code>// Example snippet
function example() {
    console.log("Hello, World!");
    return "This is a code example";
}</code></pre>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    </main>

    ${await this.getFooterHTML()}
    ${this.getThemePanelHTML()}

    <script src="/assets/js/theme-switcher.js"></script>
    <script src="/assets/js/main.js"></script>
</body>
</html>`;

      await writeFile(path.join(postDir, "index.html"), postTemplate);
    }
  }

  async buildAboutPage() {
    console.log("👤 Building about page...");

    const aboutTemplate = `
<!DOCTYPE html>
<html lang="en" data-theme="default">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="About Le Bao Quan - The Fool's Blog author and web developer">
    <meta name="theme-color" content="#f7f7f9">
    <title>About - The Fool's Blog</title>
    <link rel="stylesheet" href="/assets/css/style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
    <script src="/assets/js/initial-theme.js" defer></script>
</head>
<body>
    ${await this.getHeaderHTML()}

    <main class="about-page">
        <section class="about-hero">
            <div class="about-hero__content">
                <h1 class="about-hero__title">About Me</h1>
                <p class="about-hero__subtitle">Developer, Writer, and Lifelong Learner</p>
            </div>
        </section>

        <section class="about-intro">
            <div class="about-intro__content">
                <div class="about-intro__image">
                    <img src="/assets/images/profile-large.jpg" alt="Le Bao Quan" class="about-intro__photo">
                </div>
                <div class="about-intro__text">
                    <h2>Hello, I'm Le Bao Quan</h2>
                    <p>I'm a passionate web developer and writer who believes in the power of sharing knowledge and continuous learning. My journey in tech started with curiosity and has evolved into a career where I get to build things that matter.</p>
                    <p>When I'm not coding or writing, you can find me exploring new technologies, reading about philosophy, or working on my calisthenics practice. I believe that personal growth and professional development go hand in hand.</p>
                    <div class="about-intro__stats">
                        <div class="stat-item">
                            <span class="stat-number">5+</span>
                            <span class="stat-label">Years Experience</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">50+</span>
                            <span class="stat-label">Projects Completed</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">100+</span>
                            <span class="stat-label">Blog Posts</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="about-story">
            <div class="about-story__content">
                <h2>My Story</h2>
                <p>My journey into web development began during my college years when I discovered the magic of creating something from nothing but code. What started as a hobby quickly turned into a passion as I realized I could build solutions to real-world problems.</p>

                <p>Over the years, I've worked with various technologies and frameworks, from vanilla JavaScript to modern React applications. Each project taught me something new, not just about coding, but about problem-solving, communication, and the importance of user experience.</p>

                <div class="about-story__timeline">
                    <div class="timeline-item">
                        <div class="timeline-year">2019</div>
                        <div class="timeline-content">
                            <h3>Started Coding Journey</h3>
                            <p>Began learning HTML, CSS, and JavaScript. Built my first static website.</p>
                        </div>
                    </div>
                    <div class="timeline-item">
                        <div class="timeline-year">2020</div>
                        <div class="timeline-content">
                            <h3>First Professional Project</h3>
                            <p>Worked on a real-world project for a local business. Learned about version control and collaboration.</p>
                        </div>
                    </div>
                    <div class="timeline-item">
                        <div class="timeline-year">2021</div>
                        <div class="timeline-content">
                            <h3>Full-Stack Development</h3>
                            <p>Expanded skills to include backend development with Node.js and databases.</p>
                        </div>
                    </div>
                    <div class="timeline-item">
                        <div class="timeline-year">2022</div>
                        <div class="timeline-content">
                            <h3>Started The Fool's Blog</h3>
                            <p>Launched this blog to share my learning journey and help others in the tech community.</p>
                        </div>
                    </div>
                    <div class="timeline-item">
                        <div class="timeline-year">2023</div>
                        <div class="timeline-content">
                            <h3>Focus on Performance</h3>
                            <p>Specialized in web performance optimization and accessibility best practices.</p>
                        </div>
                    </div>
                    <div class="timeline-item">
                        <div class="timeline-year">2024</div>
                        <div class="timeline-content">
                            <h3>Continuous Learning</h3>
                            <p>Exploring AI integration, modern frameworks, and sharing knowledge through teaching.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="about-contact">
            <div class="about-contact__content">
                <h2>Let's Connect</h2>
                <p>I'm always interested in connecting with fellow developers, writers, and learners. Whether you want to collaborate on a project, discuss ideas, or just say hello, feel free to reach out!</p>

                <div class="contact-methods">
                    <div class="contact-method">
                        <span class="contact-icon">📧</span>
                        <div class="contact-info">
                            <h4>Email</h4>
                            <a href="mailto:contact@example.com">contact@example.com</a>
                        </div>
                    </div>
                    <div class="contact-method">
                        <span class="contact-icon">🐦</span>
                        <div class="contact-info">
                            <h4>Twitter</h4>
                            <a href="https://twitter.com/lebaoquan" target="_blank" rel="noopener noreferrer">@lebaoquan</a>
                        </div>
                    </div>
                    <div class="contact-method">
                        <span class="contact-icon">💼</span>
                        <div class="contact-info">
                            <h4>LinkedIn</h4>
                            <a href="https://linkedin.com/in/lebaoquan" target="_blank" rel="noopener noreferrer">lebaoquan</a>
                        </div>
                    </div>
                    <div class="contact-method">
                        <span class="contact-icon">📝</span>
                        <div class="contact-info">
                            <h4>Substack</h4>
                            <a href="https://lebaoquan.substack.com" target="_blank" rel="noopener noreferrer">lebaoquan.substack.com</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>

    ${await this.getFooterHTML()}
    ${this.getThemePanelHTML()}

    <script src="/assets/js/theme-switcher.js"></script>
    <script src="/assets/js/main.js"></script>
</body>
</html>`;

    await writeFile(
      path.join(this.publicDir, "about", "index.html"),
      aboutTemplate,
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
}

// Run the build process
if (require.main === module) {
  const generator = new StaticSiteGenerator();
  generator.build();
}

module.exports = StaticSiteGenerator;
