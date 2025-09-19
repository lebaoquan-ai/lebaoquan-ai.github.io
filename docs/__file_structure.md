├── public/                # This will be your build output directory (static files for deployment)
│   ├── index.html
│   ├── about.html
│   ├── blog/
│   │   ├── blog-title-1/
│   │   │   └── index.html
│   │   ├── blog-title-2/
│   │   │   └── index.html
│   │   ├── blog-title-3/
│   │   │   └── index.html
│   │   ├── css-grid-vs-flexbox/
│   │   │   └── index.html
│   │   ├── javascript-closures/
│   │   │   └── index.html
│   │   └── sample-post/
│   │       └── index.html
│   └── assets/
│       ├── css/
│       │   ├── _base.css
│       │   ├── _themes.css
│       │   ├── _typography.css
│       │   └── style.css
│       ├── js/
│       │   ├── initial-theme.js
│       │   ├── main.js
│       │   ├── theme-switcher.js
│       │   └── typed_text.js
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
│   │   │   ├── _base.css
│   │   │   ├── _themes.css
│   │   │   ├── _typography.css
│   │   │   └── style.css  # Main stylesheet importing others
│   │   ├── js/
│   │   │   ├── initial-theme.js
│   │   │   ├── main.js
│   │   │   ├── theme-switcher.js
│   │   │   └── typed_text.js
│   │   └── fonts/
│   │       └── ...
│   ├── content/           # Your markdown content
│   │   ├── index.md       # For the homepage
│   │   ├── about.md
│   │   └── blog/
│   │       ├── blog-title-1.md
│   │       ├── blog-title-2.md
│   │       ├── blog-title-3.md
│   │       ├── css-grid-vs-flexbox.md
│   │       ├── javascript-closures.md
│   │       └── sample-post.md
│   │       ├── Emperors-NEw-CLothes.jpg
│   │       └── the-fool.jpg
│   └── scripts/           # Your build scripts
│       └── build.js
│
├── .gitignore
├── package.json
├── package-lock.json
└── README.md