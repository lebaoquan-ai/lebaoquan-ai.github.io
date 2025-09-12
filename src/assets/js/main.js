// Sample blog data (in a real app, this would come from a CMS or API)
const blogPosts = [
    {
        id: 1,
        title: "Getting Started with Web Development",
        date: "2024-01-15",
        excerpt: "A comprehensive guide to beginning your journey in web development...",
        coverImage: "https://picsum.photos/seed/web-dev/400/300.jpg",
        content: "Full blog content here..."
    },
    {
        id: 2,
        title: "Understanding JavaScript Closures",
        date: "2024-01-10",
        excerpt: "Deep dive into one of JavaScript's most powerful concepts...",
        coverImage: "https://picsum.photos/seed/javascript/400/300.jpg",
        content: "Full blog content here..."
    },
    {
        id: 3,
        title: "CSS Grid vs Flexbox",
        date: "2024-01-05",
        excerpt: "When to use CSS Grid and when to use Flexbox...",
        coverImage: "https://picsum.photos/seed/css-grid/400/300.jpg",
        content: "Full blog content here..."
    },
    {
        id: 4,
        title: "Building Responsive layouts",
        date: "2024-01-01",
        excerpt: "Best practices for creating responsive web designs...",
        coverImage: "https://picsum.photos/seed/responsive/400/300.jpg",
        content: "Full blog content here..."
    },
    {
        id: 5,
        title: "Introduction to React Hooks",
        date: "2023-12-28",
        excerpt: "Learn how to use React Hooks to manage state and side effects...",
        coverImage: "https://picsum.photos/seed/react-hooks/400/300.jpg",
        content: "Full blog content here..."
    },
    {
        id: 6,
        title: "Node.js Best Practices",
        date: "2023-12-25",
        excerpt: "Essential best practices for Node.js development...",
        coverImage: "https://picsum.photos/seed/nodejs/400/300.jpg",
        content: "Full blog content here..."
    },
    {
        id: 7,
        title: "Database Design Principles",
        date: "2023-12-20",
        excerpt: "Fundamental principles for designing efficient databases...",
        coverImage: "https://picsum.photos/seed/database/400/300.jpg",
        content: "Full blog content here..."
    },
    {
        id: 8,
        title: "API Security Best Practices",
        date: "2023-12-15",
        excerpt: "How to secure your APIs from common vulnerabilities...",
        coverImage: "https://picsum.photos/seed/api-security/400/300.jpg",
        content: "Full blog content here..."
    }
];

// Blog pagination functionality
class BlogPagination {
    constructor() {
        this.postsPerPage = 5;
        this.currentPage = 1;
        this.blogContainer = document.querySelector('.blog-list');
        this.paginationContainer = document.querySelector('.pagination');

        if (this.blogContainer) {
            this.renderBlogs();
            this.renderPagination();
        }
    }

    renderBlogs() {
        const startIndex = (this.currentPage - 1) * this.postsPerPage;
        const endIndex = startIndex + this.postsPerPage;
        const postsToShow = blogPosts.slice(startIndex, endIndex);

        this.blogContainer.innerHTML = postsToShow.map(post => `
            <article class="blog-item">
                <img src="${post.coverImage}" alt="${post.title}">
                <div class="blog-content">
                    <h3>${post.title}</h3>
                    <div class="blog-meta">${new Date(post.date).toLocaleDateString()}</div>
                    <p class="blog-excerpt">${post.excerpt}</p>
                </div>
            </article>
        `).join('');
    }

    renderPagination() {
        const totalPages = Math.ceil(blogPosts.length / this.postsPerPage);

        let paginationHTML = '';

        // Previous button
        paginationHTML += `
            <button ${this.currentPage === 1 ? 'disabled' : ''} onclick="blogPagination.goToPage(${this.currentPage - 1})">
                <i class="fas fa-chevron-left"></i> Previous
            </button>
        `;

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            paginationHTML += `
                <button class="${i === this.currentPage ? 'active' : ''}" onclick="blogPagination.goToPage(${i})">
                    ${i}
                </button>
            `;
        }

        // Next button
        paginationHTML += `
            <button ${this.currentPage === totalPages ? 'disabled' : ''} onclick="blogPagination.goToPage(${this.currentPage + 1})">
                Next <i class="fas fa-chevron-right"></i>
            </button>
        `;

        this.paginationContainer.innerHTML = paginationHTML;
    }

    goToPage(page) {
        const totalPages = Math.ceil(blogPosts.length / this.postsPerPage);
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.renderBlogs();
            this.renderPagination();

            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
}

// Featured posts functionality
class FeaturedPosts {
    constructor() {
        this.container = document.querySelector('.posts-grid');

        if (this.container) {
            this.renderFeaturedPosts();
        }
    }

    renderFeaturedPosts() {
        const featuredPosts = blogPosts.slice(0, 6); // Show first 6 posts

        this.container.innerHTML = featuredPosts.map(post => `
            <article class="post-card">
                <img src="${post.coverImage}" alt="${post.title}">
                <div class="post-card-content">
                    <h4>${post.title}</h4>
                    <p>${post.excerpt}</p>
                </div>
            </article>
        `).join('');
    }
}

// Initialize components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.blogPagination = new BlogPagination();
    new FeaturedPosts();

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add loading animation
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });
});
