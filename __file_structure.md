
├── public/                # This will be your build output directory (static files for deployment)
│   ├── index.html
│   ├── about.html
│   ├── blog/
│   │   ├── my-first-post/
│   │   │   └── index.html
│   │   └── another-post/
│   │       └── index.html
│   └── assets/
│       ├── css/
│       │   └── style.css
│       ├── js/
│       │   └── main.js
│       └── fonts/
│           └── ...
│
├── src/                   # Your source files
│   ├── _includes/         # HTML partials for consistent layout (header, footer, nav)
│   │   ├── head.html
│   │   ├── header.html
│   │   └── footer.html
│   ├── _layouts/          # Base HTML templates where content will be injected
│   │   ├── base.html      # Main layout for most pages
│   │   └── post.html      # Layout for blog posts
│   ├── assets/
│   │   ├── css/
│   │   │   ├── _variables.css # CSS custom properties for themes
│   │   │   ├── _base.css
│   │   │   ├── _typography.css
│   │   │   └── style.css  # Main stylesheet importing others
│   │   ├── js/
│   │   │   ├── theme-picker.js
│   │   │   ├── typed-text.js
│   │   │   └── main.js
│   │   └── fonts/
│   │       └── ...
│   ├── content/           # Your markdown content
│   │   ├── index.md       # For the homepage
│   │   ├── about.md
│   │   └── blog/
│   │       ├── my-first-post.md
│   │       └── another-post.md
│   └── scripts/           # Your build scripts
│       └── build.js
│
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
