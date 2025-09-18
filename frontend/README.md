# SigAndSys Frontend

This directory contains the static frontend application for the SigAndSys blog, designed for deployment to Cloudflare Pages.

## Structure

```
frontend/
├── index.html          # Main homepage
├── about.html          # About page
├── archive.html        # Articles archive
├── topics.html         # Topics listing
├── tools.html          # Tools and resources
├── styles.css          # Main stylesheet
├── script.js           # Core JavaScript functionality
├── tools.js            # Tools page JavaScript
├── tools.json          # Tools data
├── articles/           # Article content
│   ├── manifest.json   # Article index
│   ├── DNS.json        # DNS-related articles
│   ├── sample.json     # Sample content
│   └── sample2.json    # Sample content
└── Ads/                # Media assets
    ├── Banner/         # Banner advertisements
    ├── Side/           # Sidebar media
    └── popup/          # Overlay content
```

## Features

- **Responsive Design**: Works on desktop and mobile devices
- **Dynamic Content**: Articles loaded via JSON manifests
- **Search Functionality**: Real-time article filtering
- **Theme Toggle**: Light/dark mode support
- **Social Integration**: Links to various platforms
- **Media Management**: Dynamic ad and media rotation

## Development

### Local Development
```bash
# From project root
npm run dev

# Or using Wrangler directly
npx wrangler pages dev frontend
```

### Build
No build step required - this is a static site that serves files directly.

## Deployment

### Cloudflare Pages Configuration
- **Build Command**: None (static site)
- **Build Output Directory**: `frontend`
- **Root Directory**: `frontend`

### Automatic Deployment
Deployment is handled automatically via GitHub Actions when changes are pushed to the main branch.

## Content Management

### Adding Articles
1. Create article JSON file in `articles/` directory
2. Update `articles/manifest.json` to include the new article
3. Articles are automatically loaded and displayed

### Managing Media
- Banner ads: `Ads/Banner/`
- Sidebar content: `Ads/Side/`
- Popup content: `Ads/popup/`
- Each directory has a `manifest.json` for dynamic loading

## Browser Compatibility

- Modern browsers with ES6+ support
- Progressive enhancement for older browsers
- CSS Grid and Flexbox for layout
- Responsive design with CSS media queries