const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);
const readdir = promisify(fs.readdir);
const copyFile = promisify(fs.copyFile);

class PostProcessor {
  constructor() {
    this.srcDir = path.join(__dirname, "../..");
    this.contentDir = path.join(this.srcDir, "src", "content", "blog");
    this.publicDir = path.join(this.srcDir, "public");
    this.blogDir = path.join(this.publicDir, "blog");
  }

  async processPosts() {
    console.log("📝 Processing blog posts...");

    try {
      // Ensure blog directory exists
      await mkdir(this.blogDir, { recursive: true });

      // Read all markdown files from content/blog directory
      const files = await readdir(this.contentDir);
      const markdownFiles = files.filter((file) => file.endsWith(".md"));

      const posts = [];

      for (const file of markdownFiles) {
        const post = await this.processPostFile(file);
        if (post) {
          posts.push(post);
        }
      }

      // Sort posts by date (newest first)
      posts.sort((a, b) => new Date(b.date) - new Date(a.date));

      // Generate blog listing page
      await this.generateBlogListing(posts);

      // Generate individual post pages
      for (const post of posts) {
        await this.generatePostPage(post);
      }

      console.log(`✅ Processed ${posts.length} blog posts`);
      return posts;
    } catch (error) {
      console.error("❌ Error processing posts:", error);
      throw error;
    }
  }

  async processPostFile(filename) {
    const filePath = path.join(this.contentDir, filename);
    const content = await readFile(filePath, "utf8");

    // Extract frontmatter
    const frontmatterMatch = content.match(
      /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/,
    );

    if (!frontmatterMatch) {
      console.warn(`⚠️  No frontmatter found in ${filename}`);
      return null;
    }

    const [, frontmatter, markdownContent] = frontmatterMatch;

    // Parse frontmatter
    const frontmatterData = this.parseFrontmatter(frontmatter);

    // Generate slug if not provided
    const slug =
      frontmatterData.slug ||
      this.generateSlug(frontmatterData.title || filename.replace(".md", ""));

    // Convert markdown to HTML
    const htmlContent = this.markdownToHtml(markdownContent);

    // Extract quotes and code blocks
    const { quotes, codeBlocks, mainContent } =
      this.extractSpecialContent(htmlContent);

    return {
      ...frontmatterData,
      slug,
      filename,
      content: htmlContent,
      mainContent,
      quotes,
      codeBlocks,
      excerpt: this.generateExcerpt(markdownContent),
    };
  }

  parseFrontmatter(frontmatter) {
    const data = {};
    const lines = frontmatter.split("\n");

    for (const line of lines) {
      const match = line.match(/^(\w+):\s*(.*)$/);
      if (match) {
        const [, key, value] = match;

        // Handle different data types
        if (value.startsWith('"') && value.endsWith('"')) {
          data[key] = value.slice(1, -1);
        } else if (value.startsWith("[") && value.endsWith("]")) {
          data[key] = value
            .slice(1, -1)
            .split(",")
            .map((item) => item.trim().replace(/^["']|["']$/g, ""));
        } else if (value === "true") {
          data[key] = true;
        } else if (value === "false") {
          data[key] = false;
        } else if (!isNaN(value)) {
          data[key] = Number(value);
        } else {
          data[key] = value;
        }
      }
    }

    return data;
  }

  generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }

  markdownToHtml(markdown) {
    let html = markdown;

    // Headers
    html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>");
    html = html.replace(/^## (.*$)/gim, "<h2>$1</h2>");
    html = html.replace(/^# (.*$)/gim, "<h1>$1</h1>");

    // Bold and italic
    html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");

    // Inline code
    html = html.replace(/`(.*?)`/g, "<code>$1</code>");

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

    // Images
    html = html.replace(
      /!\[([^\]]*)\]\(([^)]+)\)/g,
      '<img src="$2" alt="$1" class="post-image">',
    );

    // Blockquotes
    html = html.replace(/^> (.*$)/gim, "<blockquote>$1</blockquote>");

    // Code blocks
    html = html.replace(
      /```(\w+)?\n([\s\S]*?)```/g,
      (match, language, code) => {
        const lang = language ? ` class="language-${language}"` : "";
        return `<pre><code${lang}>${code.trim()}</code></pre>`;
      },
    );

    // Line breaks
    html = html.replace(/\n\n/g, "</p><p>");
    html = `<p>${html}</p>`;

    // Fix nested paragraph tags
    html = html.replace(/<p>(<h[1-6]>.*?<\/h[1-6]>)<\/p>/g, "$1");
    html = html.replace(/<p>(<blockquote>.*?<\/blockquote>)<\/p>/g, "$1");
    html = html.replace(/<p>(<pre>.*?<\/pre>)<\/p>/g, "$1");
    html = html.replace(/<p>(<img.*?>)<\/p>/g, "$1");

    // Lists
    html = html.replace(/<p>(\d+\..*?)<\/p>/g, "<li>$1</li>");
    html = html.replace(/<p>(- .*?)<\/p>/g, "<li>$1</li>");
    html = html.replace(/(<li>.*?<\/li>)/s, "<ol>$1</ol>");
    html = html.replace(/(<li>- .*?<\/li>)/s, "<ul>$1</ul>");
    html = html.replace(/<li>- (.*?)<\/li>/g, "<li>$1</li>");

    return html;
  }

  extractSpecialContent(html) {
    const quotes = [];
    const codeBlocks = [];

    // Extract blockquotes
    const quoteRegex = /<blockquote>(.*?)<\/blockquote>/gis;
    let match;
    while ((match = quoteRegex.exec(html)) !== null) {
      quotes.push(match[1]);
      html = html.replace(match[0], "");
    }

    // Extract code blocks
    const codeRegex = /<pre><code(.*?)>(.*?)<\/code><\/pre>/gis;
    while ((match = codeRegex.exec(html)) !== null) {
      const language = match[1].match(/language-(\w+)/)?.[1] || "";
      codeBlocks.push({
        language,
        code: match[2],
      });
      html = html.replace(match[0], "");
    }

    return { quotes, codeBlocks, mainContent: html };
  }

  generateExcerpt(markdown) {
    // Remove frontmatter
    const contentWithoutFrontmatter = markdown.replace(
      /^---\s*\n[\s\S]*?\n---\s*\n/,
      "",
    );

    // Get first paragraph
    const firstParagraph = contentWithoutFrontmatter.split("\n\n")[0];

    // Remove markdown formatting
    const plainText = firstParagraph
      .replace(/[*#>`]/g, "")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/`([^`]+)`/g, "$1")
      .trim();

    // Limit to 150 characters
    return plainText.length > 150
      ? plainText.substring(0, 150) + "..."
      : plainText;
  }

  async generateBlogListing(posts) {
    const template = `
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
                ${posts
                  .map(
                    (post) => `
                <article class="blog-list__item">
                    <div class="blog-list__content">
                        <img src="/blog/${post.slug}/${post.slug}-thumbnail.png" alt="${post.title}" class="blog-list__image">
                        <div class="blog-list__text">
                            <h2 class="blog-list__title"><a href="/blog/${post.slug}/">${post.title}</a></h2>
                            <p class="blog-list__excerpt">${post.excerpt}</p>
                            <div class="blog-list__meta">
                                <span class="blog-list__date">📅 ${this.formatDate(post.date)}</span>
                                <span class="blog-list__read-time">⏱️ ${post.readingTime || 5} min read</span>
                                <span class="blog-list__category">🏷️ ${post.category || "General"}</span>
                            </div>
                            <div class="blog-list__tags">
                                ${this.generateTagsHtml(post.tags || [])}
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

    await writeFile(path.join(this.blogDir, "index.html"), template);
  }

  async generatePostPage(post) {
    const postDir = path.join(this.blogDir, post.slug);
    await mkdir(postDir, { recursive: true });

    // Generate or copy images for this post
    await this.generatePostImages(post, postDir);

    const quotesHtml = post.quotes
      .map((quote) => `<blockquote class="sidebar-quote">${quote}</blockquote>`)
      .join("");

    const codeBlocksHtml = post.codeBlocks
      .map(
        (block) =>
          `<div class="code-snippet">
        <h4>${block.language ? `${block.language.charAt(0).toUpperCase() + block.language.slice(1)} Example` : "Code Example"}</h4>
        <pre><code class="language-${block.language}">${block.code}</code></pre>
      </div>`,
      )
      .join("");

    const template = `
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
    <meta property="og:title" content="${post.title}">
    <meta property="og:description" content="${post.description}">
    <meta property="og:image" content="/blog/${post.slug}/${post.slug}-cover.jpg">
    <meta property="og:url" content="/blog/${post.slug}/">
    <meta property="og:type" content="article">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${post.title}">
    <meta name="twitter:description" content="${post.description}">
    <meta name="twitter:image" content="/blog/${post.slug}/${post.slug}-cover.jpg">
</head>
<body>
    ${await this.getHeaderHTML()}

    <main class="post-layout">
        <article class="post-content">
            <header class="post-header">
                <div class="post-header__content">
                    <div class="post-header__text">
                        <h1>${post.title}</h1>
                        <p class="post-meta">📅 ${this.formatDate(post.date)} • ⏱️ ${post.readingTime || 5} min read</p>
                        <p class="post-description">${post.description}</p>
                        <div class="post-tags">
                            ${this.generateTagsHtml(post.tags || [])}
                        </div>
                    </div>
                    <div class="post-header__image">
                        <img src="/blog/${post.slug}/${post.slug}-thumbnail.png" alt="${post.title}" class="post-thumbnail">
                    </div>
                </div>
                <img src="/blog/${post.slug}/${post.slug}-cover.jpg" alt="${post.title}" class="post-cover">
            </header>

            <div class="post-body">
                <div class="post-main">
                    <div class="post-content-wrapper">
                        ${post.mainContent}

                        ${
                          post.codeBlocks.length > 0
                            ? `
                        <div class="post-code-section">
                            <h3>Code Examples</h3>
                            ${codeBlocksHtml}
                        </div>
                        `
                            : ""
                        }

                        ${
                          post.quotes.length > 0
                            ? `
                        <div class="post-quotes-section">
                            <h3>Key Insights</h3>
                            ${quotesHtml}
                        </div>
                        `
                            : ""
                        }
                    </div>

                    ${
                      post.quotes.length > 0 || post.codeBlocks.length > 0
                        ? `
                <aside class="post-sidebar">
                    ${
                      post.quotes.length > 0
                        ? `
                    <div class="quotes-sidebar">
                        <h4>💡 Key Quotes</h4>
                        ${quotesHtml}
                    </div>
                    `
                        : ""
                    }
                    ${
                      post.codeBlocks.length > 0
                        ? `
                    <div class="code-sidebar">
                        <h4>💻 Code Snippets</h4>
                        ${codeBlocksHtml}
                    </div>
                    `
                        : ""
                    }
                </aside>
                `
                        : ""
                    }
                </div>
            </div>

            <footer class="post-footer">
                <div class="post-navigation">
                    <div class="post-nav-prev">
                        <a href="/blog/">← Back to all posts</a>
                    </div>
                    <div class="post-share">
                        <h4>Share this post</h4>
                        <div class="share-buttons">
                            <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://lebaoquan.dev/blog/${post.slug}/`)}" target="_blank" rel="noopener" class="share-button share-twitter">🐦 Twitter</a>
                            <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://lebaoquan.dev/blog/${post.slug}/`)}" target="_blank" rel="noopener" class="share-button share-linkedin">💼 LinkedIn</a>
                            <a href="https://github.com/lebaoquan?tab=repositories" target="_blank" rel="noopener" class="share-button share-github">🐙 GitHub</a>
                        </div>
                    </div>
                </div>

                <div class="post-author">
                    <img src="/assets/images/profile.jpg" alt="${post.author}" class="author-avatar">
                    <div class="author-info">
                        <h4>About the author</h4>
                        <p>${post.author || "The Fool"}</p>
                        <p>Passionate developer sharing insights on web development and technology.</p>
                    </div>
                </div>
            </footer>
        </article>
    </main>

    ${await this.getFooterHTML()}
    ${this.getThemePanelHTML()}

    <script src="/assets/js/theme-switcher.js"></script>
    <script src="/assets/js/main.js"></script>
    <script src="/assets/js/prism.js"></script>
</body>
</html>`;

    await writeFile(path.join(postDir, "index.html"), template);
  }

  async generatePostImages(post, postDir) {
    const imagesDir = path.join(postDir, "images");
    await mkdir(imagesDir, { recursive: true });

    // Generate placeholder images for now
    // In production, these would be replaced with AI-generated images
    const thumbnailPlaceholder = this.generateImagePlaceholder(
      post.slug,
      "thumbnail",
    );
    const coverPlaceholder = this.generateImagePlaceholder(post.slug, "cover");

    // Create placeholder image files
    await writeFile(
      path.join(imagesDir, `${post.slug}-thumbnail.png`),
      thumbnailPlaceholder,
    );
    await writeFile(
      path.join(imagesDir, `${post.slug}-cover.jpg`),
      coverPlaceholder,
    );

    // Copy existing coverImage if specified, or use placeholder
    if (
      post.coverImage &&
      post.coverImage !== `/assets/images/blog-post-default.jpg`
    ) {
      try {
        const sourcePath = path.join(this.srcDir, "public", post.coverImage);
        const destPath = path.join(imagesDir, `${post.slug}-cover.jpg`);
        await copyFile(sourcePath, destPath);
      } catch (error) {
        console.warn(
          `Could not copy cover image for ${post.slug}: ${error.message}`,
        );
      }
    }

    console.log(`🖼️  Generated placeholder images for: ${post.slug}`);
  }

  generateImagePlaceholder(slug, type) {
    const size = type === "thumbnail" ? "400x300" : "1200x630";
    const description = type === "thumbnail" ? "Thumbnail" : "Cover image";

    return `# AI Generated Image Placeholder - ${description}
# Post: ${slug}
# Size: ${size}
# Type: ${type}

# Instructions for AI Image Generation:
# Replace this placeholder with an AI-generated image using these parameters:

# For Thumbnail (${size}):
# Style: Minimalist, clean, professional icon
# Content: Technology-related to the post topic
# Format: PNG with transparent background
# Colors: Consistent with blog theme

# For Cover Image (${size}):
# Style: Modern, elegant, high-quality blog cover
# Content: Visually appealing representation of post topic
# Format: JPG with subtle gradients
# Colors: Professional and eye-catching

# AI Prompt Suggestions:
# 1. Use the post title and description to generate relevant prompts
# 2. Maintain consistent visual style across all blog images
# 3. Ensure images are appropriate for a professional tech blog
# 4. Optimize for web performance and fast loading
`;
  }

  generateTagsHtml(tags) {
    if (!tags || tags.length === 0) return "";

    return tags.map((tag) => `<span class="post-tag">${tag}</span>`).join("");
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

// Export for use in build.js
module.exports = PostProcessor;

// Run directly if called from command line
if (require.main === module) {
  const processor = new PostProcessor();
  processor.processPosts().catch(console.error);
}
