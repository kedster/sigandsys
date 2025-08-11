# SigAndSys

A personal blog and knowledge base focused on systems engineering, signal processing, and practical software architecture.

## Features

- **Search:** Instantly filter articles by title, excerpt, or tags.
- **Responsive Design:** Looks great on desktop and mobile.
- **Smooth Navigation:** Easy scrolling between sections.
- **Sidebar:** Recent posts, topics, newsletter, and case studies.

## File Structure

- `index.html` — Main HTML page with articles, sidebar, and navigation.
- `styles.css` — Custom styles for layout, typography, and responsiveness.
- `script.js` — Search functionality and smooth scroll for navigation links.
- `readme.md` — Project documentation.

## Getting Started

1. Clone or download the repository.
2. Open `index.html` in your browser.
3. Edit/add articles directly in the HTML.

## Customization

- Add new articles by copying the `<article class="article">` block in `index.html`.
- Update sidebar topics and recent posts in the `<aside class="sidebar">` section.
- Modify styles in `styles.css` for branding or layout changes.
- Extend JavaScript in `script.js` for new interactive features.

## Adding Articles Easily

- To add a new article, create a separate HTML file for each article in an `articles/` folder (e.g., `articles/my-new-article.html`).
- Update `index.html` to dynamically load articles from the `articles/` folder using JavaScript, or manually include them as `<article>` blocks.
- For dynamic loading, add a list of article filenames in `script.js` and use JavaScript to fetch and display them in the main content area.
- This approach keeps articles organized and makes it easy to add, edit, or remove content without modifying the main HTML structure.

## License

MIT License
