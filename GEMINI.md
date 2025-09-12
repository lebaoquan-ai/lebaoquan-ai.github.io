# Overview
* Build a static blog
* Use HTML, CSS and JS to build the sitel; use Markdown and MDX for blog content

# UI

the layout is as follow:

## Header

* A profile picture (circular image with border) on the top left corner
* A title "The Fool's blog" next to the profile picture
* Navbar on the top right corner with links to "Home", "Blogs" and "About". These button has hover effect which underlines the text when hovered
* A theme picker toggle button on the top right corner next to the navbar. Upon clicking, it toggle a top panel for the user to select between available color themes.  The selected theme is applied to the entire site and is saved in local storage to persist across sessions.

## Body

### Home

* <intro> A header section to introduce myself
* <featured posts>  Main body section to show top 6 recent blogs
* feature posts are displayed in a grid layout with 2 columns and 3 rows
* each post preview includes a title and cover image, upon hovering over the post,
  ** the cover image slightly zooms in with a smooth transition
  ** a brief excerpt of the blog is displayed overlaying the cover image with a semi-transparent background.
* a button <show all posts> which links to the blogs page

### Blogs

* List of blogs
* Each blog entry includes a title, date, cover image, and a brief excerpt
* Blogs are displayed in a single column layout with infinite scroll (load 5 posts each time, only load more when scroll to last post)

* For individual post, the format is as follow:
** Title, Brief description and date, cover image
** use simple column the main text
** quotes are placed in secondary column on the right (if there's quote)
** images are placed in columns on the left (if there's image)
** code block (if available) is rendered in main column, with option to copy

### About

* A section with an image on the left and text on the right to intro
* A section below with longer post to share more about myself

## Footer

* A footer at the bottom of the page with copyright information (left), links to social media profiles (right) and in the middle is a favourite quote "Ideas to share, Attention to keep"
* Social links include Github, Facebook, X and Substack. Each with their respective icons. Each icon has hover effect which changes the icon color to indicate interactivity.
