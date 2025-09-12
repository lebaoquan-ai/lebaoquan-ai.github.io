const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'src/assets')));
app.use('/src', express.static(path.join(__dirname, 'src')));

// Serve HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/blogs', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'blogs.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

// API endpoint to get blog posts (for future dynamic content)
app.get('/api/posts', (req, res) => {
    // In a real app, you'd read from markdown files or a database
    const posts = [
        {
            id: 1,
            title: "Getting Started with Web Development",
            date: "2024-01-15",
            excerpt: "A comprehensive guide to beginning your journey in web development...",
            coverImage: "/assets/images/blog1.jpg",
            slug: "getting-started-web-development"
        },
        {
            id: 2,
            title: "Understanding JavaScript Closures",
            date: "2024-01-10",
            excerpt: "Deep dive into one of JavaScript's most powerful concepts...",
            coverImage: "/assets/images/blog2.jpg",
            slug: "understanding-javascript-closures"
        },
        {
            id: 3,
            title: "CSS Grid vs Flexbox",
            date: "2024-01-05",
            excerpt: "When to use CSS Grid and when to use Flexbox...",
            coverImage: "/assets/images/blog3.jpg",
            slug: "css-grid-vs-flexbox"
        },
        {
            id: 4,
            title: "Building Responsive layouts",
            date: "2024-01-01",
            excerpt: "Best practices for creating responsive web designs...",
            coverImage: "/assets/images/blog4.jpg",
            slug: "building-responsive-layouts"
        },
        {
            id: 5,
            title: "Introduction to React Hooks",
            date: "2023-12-28",
            excerpt: "Learn how to use React Hooks to manage state and side effects...",
            coverImage: "/assets/images/blog5.jpg",
            slug: "introduction-react-hooks"
        },
        {
            id: 6,
            title: "Node.js Best Practices",
            date: "2023-12-25",
            excerpt: "Essential best practices for Node.js development...",
            coverImage: "/assets/images/blog6.jpg",
            slug: "nodejs-best-practices"
        },
        {
            id: 7,
            title: "Database Design Principles",
            date: "2023-12-20",
            excerpt: "Fundamental principles for designing efficient databases...",
            coverImage: "/assets/images/blog7.jpg",
            slug: "database-design-principles"
        },
        {
            id: 8,
            title: "API Security Best Practices",
            date: "2023-12-15",
            excerpt: "How to secure your APIs from common vulnerabilities...",
            coverImage: "/assets/images/blog8.jpg",
            slug: "api-security-best-practices"
        }
    ];

    res.json(posts);
});

// Handle 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📱 Home page: http://localhost:${PORT}/`);
    console.log(`📝 Blogs page: http://localhost:${PORT}/blogs`);
    console.log(`👤 About page: http://localhost:${PORT}/about`);
    console.log(`\n🎉 Your blog is now running locally!`);
    console.log(`💡 Use Ctrl+C to stop the server`);
});
