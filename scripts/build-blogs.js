const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');
const glob = require('glob');

// Configure marked options
marked.setOptions({
    breaks: true,
    gfm: true,
    headerIds: true,
    headerPrefix: 'heading-'
});

// Create custom renderer for better markdown parsing
const renderer = new marked.Renderer();

// Custom code block rendering
renderer.code = function(code, language) {
    const lang = language || 'text';
    return `<pre><code class="language-${lang}">${code}</code></pre>`;
};

// Custom image rendering
renderer.image = function(href, title, text) {
    return `<img src="${href}" alt="${text || ''}" title="${title || ''}" />`;
};

// Custom heading rendering
renderer.heading = function(text, level) {
    return `<h${level} id="${text.toLowerCase().replace(/\s+/g, '-')}">${text}</h${level}>`;
};

marked.setOptions({ renderer });

// Template engine for Handlebars-like syntax
function renderTemplate(template, data) {
    return template.replace(/{{#if (\w+)}}([\s\S]*?){{\/if}}/g, (match, field, content) => {
        return data[field] ? content : '';
    }).replace(/{{#each (\w+)}}([\s\S]*?){{\/each}}/g, (match, field, template) => {
        if (!data[field] || !Array.isArray(data[field])) return '';
        return data[field].map(item => {
            return template.replace(/{{this}}/g, item);
        }).join('');
    }).replace(/{{(\w+)}}/g, (match, field) => {
        return data[field] || '';
    });
}

// Calculate reading time
function calculateReadingTime(content) {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
}

// Extract images from markdown content
function extractImages(content) {
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    const images = [];
    let match;

    while ((match = imageRegex.exec(content)) !== null) {
        images.push(match[2]);
    }

    return images;
}

// Extract quotes from markdown content
function extractQuotes(content) {
    const quoteRegex = /^>\s*(.+)$/gm;
    const quotes = [];
    let match;

    while ((match = quoteRegex.exec(content)) !== null) {
        quotes.push(match[1]);
    }

    return quotes;
}

// Process a single blog post
function processBlogPost(filePath) {
    try {
        // Read the markdown file
        const fileContent = fs.readFileSync(filePath, 'utf8');

        // Parse front matter
        const { data, content } = matter(fileContent);

        // Validate required fields
        if (!data.title || !data.date || !data.description) {
            console.warn(`Missing required fields in ${filePath}`);
            return null;
        }

        // Process content
        const processedContent = marked(content);
        const images = extractImages(content);
        const quotes = extractQuotes(content);
        const readingTime = calculateReadingTime(content);

        // Create blog post data
        const blogData = {
            title: data.title,
            date: new Date(data.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            description: data.description,
            author: data.author || 'The Fool',
            coverImage: data.coverImage || '/assets/images/default-blog-cover.jpg',
            content: processedContent,
            images: images,
            quotes: quotes,
            readingTime: readingTime,
            slug: data.slug || path.basename(filePath, '.md').toLowerCase().replace(/\s+/g, '-')
        };

        return blogData;
    } catch (error) {
        console.error(`Error processing ${filePath}:`, error);
        return null;
    }
}

// Generate HTML for a blog post
function generateBlogHTML(blogData, templatePath) {
    try {
        const template = fs.readFileSync(templatePath, 'utf8');
        return renderTemplate(template, blogData);
    } catch (error) {
        console.error('Error generating HTML:', error);
        return null;
    }
}

// Create blog index data for the main blog page
function generateBlogIndex(blogPosts) {
    return blogPosts.map(post => ({
        title: post.title,
        date: post.date,
        excerpt: post.description,
        coverImage: post.coverImage,
        slug: post.slug,
        readingTime: post.readingTime
    }));
}

// Main build function
function buildBlogs() {
    const sourceDir = path.join(__dirname, '../src/content/blog');
    const outputDir = path.join(__dirname, '../public/blog');
    const templatePath = path.join(__dirname, '../src/_layouts/blog-post.html');
    const indexPath = path.join(__dirname, '../public/assets/js/blog-data.js');

    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Find all markdown files
    const mdFiles = glob.sync(path.join(sourceDir, '*.md'));

    if (mdFiles.length === 0) {
        console.log('No blog posts found in src/content/blog');
        return;
    }

    console.log(`Found ${mdFiles.length} blog posts`);

    const blogPosts = [];
    const blogIndex = [];

    // Process each blog post
    mdFiles.forEach(filePath => {
        console.log(`Processing ${path.basename(filePath)}`);

        const blogData = processBlogPost(filePath);
        if (!blogData) return;

        blogPosts.push(blogData);

        // Generate HTML
        const html = generateBlogHTML(blogData, templatePath);
        if (!html) return;

        // Write individual blog post
        const outputPath = path.join(outputDir, `${blogData.slug}.html`);
        fs.writeFileSync(outputPath, html);

        // Add to index
        blogIndex.push({
            title: blogData.title,
            date: blogData.date,
            excerpt: blogData.description,
            coverImage: blogData.coverImage,
            slug: blogData.slug,
            readingTime: blogData.readingTime
        });

        console.log(`Generated ${blogData.slug}.html`);
    });

    // Sort blog posts by date (newest first)
    blogIndex.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Write blog index data
    const jsContent = `const blogPosts = ${JSON.stringify(blogIndex, null, 2)};`;
    fs.writeFileSync(indexPath, jsContent);

    console.log(`Successfully built ${blogPosts.length} blog posts`);
    console.log(`Blog index written to ${indexPath}`);
}

// Run build if called directly
if (require.main === module) {
    buildBlogs();
}

module.exports = { buildBlogs, processBlogPost };
