const fs = require('fs');
const path = require('path');
const marked = require('marked');
const matter = require('gray-matter');

// Configure marked options
marked.setOptions({
  breaks: true,
  gfm: true,
  headerIds: true,
  headerPrefix: 'heading-'
});

// Directories
const SRC_DIR = path.join(__dirname, '../src');
const DIST_DIR = path.join(__dirname, '../dist');
const CONTENT_DIR = path.join(SRC_DIR, 'content');

// Create dist directory
if (!fs.existsSync(DIST_DIR)) {
  fs.mkdirSync(DIST_DIR, { recursive: true });
}

// Copy assets
function copyAssets() {
  const assetsDir = path.join(SRC_DIR, 'assets');
  const distAssetsDir = path.join(DIST_DIR, 'assets');

  if (fs.existsSync(assetsDir)) {
    copyDir(assetsDir, distAssetsDir);
  }
}

// Copy directory recursively
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const files = fs.readdirSync(src);

  files.forEach(file => {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);

    if (fs.statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

// Read layout file
function readLayout(layoutName) {
  const layoutPath = path.join(SRC_DIR, '_layouts', `${layoutName}.html`);
  if (fs.existsSync(layoutPath)) {
    return fs.readFileSync(layoutPath, 'utf8');
  }
  return '';
}

// Read include file
function readInclude(includeName) {
  const includePath = path.join(SRC_DIR, '_includes', `${includeName}.html`);
  if (fs.existsSync(includePath)) {
    return fs.readFileSync(includePath, 'utf8');
  }
  return '';
}

// Process content
function processContent(content, metadata = {}) {
  let processedContent = content;

  // Replace includes
  processedContent = processedContent.replace(/{% include '([^']+)' %}/g, (match, includeName) => {
    return readInclude(includeName);
  });

  // Replace metadata variables
  Object.keys(metadata).forEach(key => {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
    processedContent = processedContent.replace(regex, metadata[key] || '');
  });

  return processedContent;
}

// Parse markdown files in a directory
function parseMarkdownFiles(dir) {
  const files = fs.readdirSync(dir);
  const posts = [];

  files.forEach(file => {
    if (file.endsWith('.md')) {
      const filePath = path.join(dir, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data: metadata, content } = matter(fileContent);

      posts.push({
        metadata,
        content: marked.parse(content),
        filename: file.replace('.md', ''),
        slug: file.replace('.md', '').toLowerCase().replace(/\s+/g, '-')
      });
    }
  });

  // Sort by date if available
  posts.sort((a, b) => {
    const dateA = new Date(a.metadata.date || 0);
    const dateB = new Date(b.metadata.date || 0);
    return dateB - dateA;
  });

  return posts;
}

// Build home page
function buildHomePage() {
  const layout = readLayout('base');
  const contentPath = path.join(CONTENT_DIR, 'index.md');

  if (fs.existsSync(contentPath)) {
    const { data: metadata, content } = matter(fs.readFileSync(contentPath, 'utf8'));

    // Get blog posts for featured section
    const blogDir = path.join(CONTENT_DIR, 'blog');
    let blogPosts = [];

    if (fs.existsSync(blogDir)) {
      blogPosts = parseMarkdownFiles(blogDir).slice(0, 6); // Show first 6 posts
    }

    // Create blog posts HTML
    const blogPostsHTML = blogPosts.map(post => `
      <article class="post-card">
        <img src="${post.metadata.coverImage || '/assets/images/default-post.jpg'}" alt="${post.metadata.title}">
        <div class="post-card-content">
          <h4>${post.metadata.title}</h4>
          <p>${post.metadata.excerpt || post.content.replace(/<[^>]*>/g, '').substring(0, 150)}...</p>
        </div>
      </article>
    `).join('');

    const processedContent = marked.parse(content) + `
      <section class="featured-posts">
        <h3>Featured Posts</h3>
        <div class="posts-grid">
          ${blogPostsHTML}
        </div>
        <a href="/blogs.html" class="show-all-btn">View All Posts</a>
      </section>
    `;

    const finalHTML = processContent(layout, {
      content: processedContent,
      title: metadata.title || 'The Fool\'s Blog',
      ...metadata
    });

    fs.writeFileSync(path.join(DIST_DIR, 'index.html'), finalHTML);
  }
}

// Build blogs page
function buildBlogsPage() {
  const layout = readLayout('base');
  const blogDir = path.join(CONTENT_DIR, 'blog');

  if (fs.existsSync(blogDir)) {
    const blogPosts = parseMarkdownFiles(blogDir);

    const blogPostsHTML = blogPosts.map(post => `
      <article class="blog-item">
        <img src="${post.metadata.coverImage || '/assets/images/default-post.jpg'}" alt="${post.metadata.title}">
        <div class="blog-content">
          <h3>${post.metadata.title}</h3>
          <div class="blog-meta">${new Date(post.metadata.date || Date.now()).toLocaleDateString()}</div>
          <p class="blog-excerpt">${post.metadata.excerpt || post.content.replace(/<[^>]*>/g, '').substring(0, 200)}...</p>
        </div>
      </article>
    `).join('');

    const blogsPageContent = `
      <div class="blogs-container">
        <h2>All Blog Posts</h2>
        <div class="blog-list">
          ${blogPostsHTML}
        </div>
      </div>
    `;

    const finalHTML = processContent(layout, {
      content: blogsPageContent,
      title: 'All Posts - The Fool\'s Blog'
    });

    fs.writeFileSync(path.join(DIST_DIR, 'blogs.html'), finalHTML);
  }
}

// Build about page
function buildAboutPage() {
  const layout = readLayout('base');
  const contentPath = path.join(CONTENT_DIR, 'about.md');

  if (fs.existsSync(contentPath)) {
    const { data: metadata, content } = matter(fs.readFileSync(contentPath, 'utf8'));

    const processedContent = `
      <div class="about-container">
        ${marked.parse(content)}
      </div>
    `;

    const finalHTML = processContent(layout, {
      content: processedContent,
      title: metadata.title || 'About - The Fool\'s Blog',
      ...metadata
    });

    fs.writeFileSync(path.join(DIST_DIR, 'about.html'), finalHTML);
  }
}

// Build individual blog posts
function buildBlogPosts() {
  const layout = readLayout('base');
  const blogDir = path.join(CONTENT_DIR, 'blog');

  if (fs.existsSync(blogDir)) {
    const blogPosts = parseMarkdownFiles(blogDir);

    blogPosts.forEach(post => {
      const processedContent = `
        <article class="blog-post">
          <h1>${post.metadata.title}</h1>
          <div class="blog-meta">
            <span>${new Date(post.metadata.date || Date.now()).toLocaleDateString()}</span>
            ${post.metadata.author ? `<span>by ${post.metadata.author}</span>` : ''}
          </div>
          <div class="blog-content">
            ${post.content}
          </div>
        </article>
      `;

      const finalHTML = processContent(layout, {
        content: processedContent,
        title: `${post.metadata.title} - The Fool\'s Blog`,
        ...post.metadata
      });

      fs.writeFileSync(path.join(DIST_DIR, `${post.slug}.html`), finalHTML);
    });
  }
}

// Build CNAME file for custom domain
function buildCNAME() {
  const cnamePath = path.join(DIST_DIR, 'CNAME');
  fs.writeFileSync(cnamePath, 'your-custom-domain.com'); // Replace with your actual domain
}

// Main build function
function build() {
  console.log('Building static site...');

  // Clean dist directory
  if (fs.existsSync(DIST_DIR)) {
    fs.rmSync(DIST_DIR, { recursive: true });
  }

  // Create dist directory
  fs.mkdirSync(DIST_DIR, { recursive: true });

  // Copy assets
  copyAssets();

  // Build pages
  buildHomePage();
  buildBlogsPage();
  buildAboutPage();
  buildBlogPosts();
  buildCNAME();

  console.log('Build completed successfully!');
  console.log('Site built to:', DIST_DIR);
}

// Run build
if (require.main === module) {
  build();
}

module.exports = { build };
