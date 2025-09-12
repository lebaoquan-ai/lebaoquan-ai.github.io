---
title: "CSS Grid vs Flexbox: When to Use What"
date: "2024-01-05"
description: "Understanding the differences between CSS Grid and Flexbox and when to use each"
author: "The Fool"
coverImage: "/assets/images/css-grid-flexbox.jpg"
slug: "css-grid-vs-flexbox-when-to-use-what"
---

# CSS Grid vs Flexbox: When to Use What

CSS Grid and Flexbox are two powerful layout systems in CSS. While they might seem similar at first glance, they're designed for different purposes. Understanding when to use each is crucial for modern web development.

## The Core Difference

> "Grid is for layout, Flexbox is for alignment."

- **CSS Grid**: Two-dimensional layout system (rows and columns)
- **Flexbox**: One-dimensional layout system (row or column)

## CSS Grid: The Layout Specialist

CSS Grid excels at creating complex layouts with multiple rows and columns.

### When to Use Grid:
- **Page layouts**: Header, sidebar, main content, footer
- **Card grids**: Pinterest-style layouts
- **Dashboard layouts**: Complex UI with multiple sections
- **Image galleries**: Irregular grid layouts

### Example: Basic Grid Layout

```css
.container {
    display: grid;
    grid-template-columns: 1fr 3fr 1fr;
    grid-template-rows: auto 1fr auto;
    grid-template-areas:
        "header header header"
        "sidebar main aside"
        "footer footer footer";
    gap: 20px;
    height: 100vh;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.aside { grid-area: aside; }
.footer { grid-area: footer; }
```

### Advanced Grid Features

```css
.card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
}

/* Responsive grid */
.responsive-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    grid-auto-rows: minmax(200px, auto);
}
```

## Flexbox: The Alignment Expert

Flexbox is perfect for arranging items in a single dimension.

### When to Use Flexbox:
- **Navigation bars**: Horizontal or vertical menu items
- **Form elements**: Aligning inputs and labels
- **Centering content**: Both horizontally and vertically
- **Card components**: Distributing items within a card

### Example: Navigation Bar

```css
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background-color: #f0f0f0;
}

.nav-links {
    display: flex;
    gap: 2rem;
    list-style: none;
}
```

### Flexbox for Form Alignment

```css
.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.form-row {
    display: flex;
    gap: 1rem;
    align-items: flex-end;
}

.form-row .form-group {
    flex: 1;
}
```

## Combining Grid and Flexbox

The real power comes from combining both systems:

```css
/* Grid for overall layout */
.page-layout {
    display: grid;
    grid-template-areas:
        "header header"
        "sidebar main"
        "footer footer";
    grid-template-columns: 250px 1fr;
    grid-template-rows: auto 1fr auto;
    min-height: 100vh;
}

/* Flexbox for component internal layout */
.card {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.card-content {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.card-footer {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
}
```

## Practical Examples

### 1. Responsive Sidebar

```css
.sidebar-layout {
    display: grid;
    grid-template-columns: 250px 1fr;
    gap: 2rem;
}

@media (max-width: 768px) {
    .sidebar-layout {
        grid-template-columns: 1fr;
    }
    
    .sidebar {
        display: none; /* Or use a hamburger menu */
    }
}
```

### 2. Product Card

```css
.product-card {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.product-image {
    height: 200px;
    object-fit: cover;
}

.product-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1rem;
}

.product-title {
    margin-bottom: 0.5rem;
}

.product-price {
    margin-top: auto;
    font-weight: bold;
    font-size: 1.2rem;
}

.product-actions {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
}
```

### 3. Complex Dashboard

```css
.dashboard {
    display: grid;
    grid-template-columns: 200px 1fr 300px;
    grid-template-rows: 60px 1fr 60px;
    gap: 1rem;
    height: 100vh;
}

.dashboard-header {
    grid-column: 1 / -1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
}

.widget {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.widget-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.widget-content {
    flex: 1;
}
```

## Browser Support

Both CSS Grid and Flexbox are well-supported in modern browsers:

- **Flexbox**: Supported in all modern browsers (since 2017)
- **CSS Grid**: Supported in all modern browsers (since 2017)

```css
/* Fallback for older browsers */
@supports not (display: grid) {
    .grid-layout {
        display: flex;
        flex-wrap: wrap;
    }
    
    .grid-item {
        flex: 1 0 300px;
        margin: 10px;
    }
}
```

## Performance Considerations

1. **Grid**: Generally more performant for complex layouts
2. **Flexbox**: Excellent for dynamic content and alignment
3. **Combined**: Use Grid for structure, Flexbox for components

## Common Mistakes

1. **Using Grid for simple centering**: Flexbox is simpler
2. **Using Flexbox for complex layouts**: Grid is more appropriate
3. **Nesting too deeply**: Keep your layout simple and maintainable
4. **Ignoring browser support**: Use feature queries for fallbacks

## Conclusion

CSS Grid and Flexbox are not competitors - they're complementary tools. Use Grid for page-level layouts and complex two-dimensional designs. Use Flexbox for component-level alignment and one-dimensional layouts.

The best approach is to:
- **Plan your layout structure** with Grid
- **Use Flexbox for component alignment**
- **Combine both** for optimal results
- **Keep it simple** and maintainable

Remember: the right tool for the right job! 🛠️