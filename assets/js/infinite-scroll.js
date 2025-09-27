class InfiniteScroll {
    constructor(options = {}) {
        this.container = options.container || '#blogContainer';
        this.loadingIndicator = options.loadingIndicator || '#loadingIndicator';
        this.pageSize = options.pageSize || 4;
        this.currentPage = 1;
        this.isLoading = false;
        this.hasMore = true;

        this.init();
    }

    init() {
        this.container = document.querySelector(this.container);
        this.loadingIndicator = document.querySelector(this.loadingIndicator);

        if (!this.container) {
            console.error('Container element not found');
            return;
        }

        this.bindEvents();
    }

    bindEvents() {
        // Scroll event
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });

        // Resize event
        window.addEventListener('resize', () => {
            this.handleScroll();
        });
    }

    handleScroll() {
        if (this.isLoading || !this.hasMore) return;

        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;

        // Load more when user is 300px from bottom
        if (scrollTop + clientHeight >= scrollHeight - 300) {
            this.loadMore();
        }
    }

    async loadMore() {
        if (this.isLoading || !this.hasMore) return;

        this.isLoading = true;
        this.showLoading();

        try {
            // Simulate API call delay
            await this.delay(1000);

            const newPosts = this.generateMockPosts(this.currentPage, this.pageSize);

            if (newPosts.length > 0) {
                this.appendPosts(newPosts);
                this.currentPage++;
            } else {
                this.hasMore = false;
                this.showEndMessage();
            }
        } catch (error) {
            console.error('Error loading more posts:', error);
            this.showErrorMessage();
        } finally {
            this.isLoading = false;
            this.hideLoading();
        }
    }

    generateMockPosts(page, pageSize) {
        const allPosts = [
            {
                title: "Understanding React Context API",
                excerpt: "Learn how to use React Context API for state management and avoid prop drilling in your applications.",
                image: "/assets/images/blog-post-9.jpg",
                date: "Aug 25, 2024",
                readTime: "8 min read",
                category: "React"
            },
            {
                title: "CSS Animations and Transitions",
                excerpt: "Master CSS animations and transitions to create smooth, engaging user interfaces.",
                image: "/assets/images/blog-post-10.jpg",
                date: "Aug 22, 2024",
                readTime: "6 min read",
                category: "CSS"
            },
            {
                title: "TypeScript Best Practices",
                excerpt: "Discover the best practices for writing clean, maintainable TypeScript code in your projects.",
                image: "/assets/images/blog-post-11.jpg",
                date: "Aug 20, 2024",
                readTime: "10 min read",
                category: "TypeScript"
            },
            {
                title: "Building RESTful APIs with Node.js",
                excerpt: "Learn how to build robust RESTful APIs using Node.js, Express, and best practices.",
                image: "/assets/images/blog-post-12.jpg",
                date: "Aug 18, 2024",
                readTime: "12 min read",
                category: "Node.js"
            },
            {
                title: "Introduction to Docker",
                excerpt: "Get started with Docker and learn how to containerize your applications for development and deployment.",
                image: "/assets/images/blog-post-13.jpg",
                date: "Aug 15, 2024",
                readTime: "9 min read",
                category: "DevOps"
            },
            {
                title: "Modern JavaScript Features",
                excerpt: "Explore the latest JavaScript features and how to use them in your projects today.",
                image: "/assets/images/blog-post-14.jpg",
                date: "Aug 12, 2024",
                readTime: "7 min read",
                category: "JavaScript"
            },
            {
                title: "Building a Portfolio Website",
                excerpt: "Learn how to create an impressive portfolio website that showcases your skills and projects.",
                image: "/assets/images/blog-post-15.jpg",
                date: "Aug 10, 2024",
                readTime: "11 min read",
                category: "Web Development"
            },
            {
                title: "Understanding Web Accessibility",
                excerpt: "Learn the importance of web accessibility and how to make your websites accessible to everyone.",
                image: "/assets/images/blog-post-16.jpg",
                date: "Aug 8, 2024",
                readTime: "8 min read",
                category: "Accessibility"
            },
            {
                title: "Testing JavaScript Applications",
                excerpt: "Discover different testing strategies and tools for testing JavaScript applications effectively.",
                image: "/assets/images/blog-post-17.jpg",
                date: "Aug 5, 2024",
                readTime: "10 min read",
                category: "Testing"
            },
            {
                title: "Getting Started with Vue.js",
                excerpt: "Learn the basics of Vue.js and how to build modern web applications with this popular framework.",
                image: "/assets/images/blog-post-18.jpg",
                date: "Aug 3, 2024",
                readTime: "9 min read",
                category: "Vue.js"
            }
        ];

        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;

        return allPosts.slice(startIndex, endIndex);
    }

    appendPosts(posts) {
        posts.forEach(post => {
            const postElement = this.createPostElement(post);
            this.container.appendChild(postElement);
        });
    }

    createPostElement(post) {
        const article = document.createElement('article');
        article.className = 'blog-list__item';
        article.innerHTML = `
            <div class="blog-list__content">
                <img src="${post.image}" alt="${post.title}" class="blog-list__image">
                <div class="blog-list__text">
                    <h2 class="blog-list__title">${post.title}</h2>
                    <p class="blog-list__excerpt">${post.excerpt}</p>
                    <div class="blog-list__meta">
                        <span class="blog-list__date">📅 ${post.date}</span>
                        <span class="blog-list__read-time">⏱️ ${post.readTime}</span>
                        <span class="blog-list__category">🏷️ ${post.category}</span>
                    </div>
                </div>
            </div>
        `;
        return article;
    }

    showLoading() {
        if (this.loadingIndicator) {
            this.loadingIndicator.style.display = 'block';
        }
    }

    hideLoading() {
        if (this.loadingIndicator) {
            this.loadingIndicator.style.display = 'none';
        }
    }

    showEndMessage() {
        const endMessage = document.createElement('div');
        endMessage.className = 'blog-list__end';
        endMessage.innerHTML = '<p>You\'ve reached the end of the posts!</p>';
        this.container.appendChild(endMessage);
    }

    showErrorMessage() {
        const errorMessage = document.createElement('div');
        errorMessage.className = 'blog-list__error';
        errorMessage.innerHTML = '<p>Failed to load more posts. Please try again later.</p>';
        this.container.appendChild(errorMessage);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize infinite scroll when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on the blog page
    if (document.querySelector('.blog-list')) {
        new InfiniteScroll({
            container: '#blogContainer',
            loadingIndicator: '#loadingIndicator',
            pageSize: 4
        });
    }
});
