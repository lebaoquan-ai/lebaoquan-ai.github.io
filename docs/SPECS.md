# Overview
* Build a static blog.
* Choose the most efficient (fast) framework to build
* Use HTML, CSS and JS to build the site; use Markdown and MDX for blog content and blog template auto automate the process of convert raw markdown file (which I write as personal note, then later on edit and push to post as blog)
* Responsive for mobile and laptop views, use best practice technique to increase web page loading time

# UI

the layout is as follow:

## Header

* A profile picture (circular image with border) on the top left corner
* A title "The Fool's blog" next to the profile picture
* Navbar on the top right corner with links to "Home", "Blogs" and "About". These button has hover effect which underlines the text when hovered.
* A theme picker toggle button on the top right corner next to the navbar. Upon clicking, it toggle a top panel (dropdown) for the user to select between available color themes.  The selected theme is applied to the entire site and is saved in local storage to persist across sessions.

### Home

* <intro> A header section to introduce myself
  (Heading Text)
  ** A Fool's Blog
  ** I am <Typed_text> Le Bao Quan/ a developer <>
  (Smaller text)
  ** This is the corner of the Internet where I write

* <tags> 3 icons represent the 3 main topics of interest for this website, [Programming], [Calisthenics], [Lifestyle], plus an extra [Discover] which leads to blog page to see all blogs. These button has hover effect.

* <featured posts>  Main body section to show top 6 recent blogs
  ** feature posts are displayed in a grid layout with 2 columns and 3 rows
  ** each post preview includes a title and cover image, upon hovering over the post
  ** the cover image slightly zooms in with a smooth transition
  ** title is always shown
  ** a brief excerpt of the blog is displayed overlaying the cover image with a semi-transparent background (shown opon hover)

## Footer
  ** on the right are icons to social links (facebook page, x, substack and email)
  ** on the left is my Motto writing this blog: Ideas is to share, Attention is to keep (with copyright trademark icon)


### Blogs (List of blogs)
* Each blog entry includes a title, date, cover image, and a brief excerpt
* Blogs are displayed in a single column layout with infinite scroll (choose the best way to make loading posts fastest, prioritize user experience)

* For individual post, the format is as follow:
** Title, Brief description and date, cover image
** use simple column the main text
** quotes are placed in secondary column on the left (if there's quote)
** code blocks are placed in 3rd column on the right (if there's code block), code block are sticky (not scrollable) to a sub-section of a blog post
** in mobile view, codeblocks and quotes are in main text column

### About

* A section with an image on the left and text on the right to intro
* A section below with longer post to share more about myself
