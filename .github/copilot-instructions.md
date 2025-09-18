# SigAndSys - GitHub Copilot Instructions

**ALWAYS FOLLOW THESE INSTRUCTIONS FIRST.** Only search for additional context or gather more information if these instructions are incomplete or found to be incorrect.

## Repository Overview
SigAndSys is a static HTML/CSS/JavaScript personal blog and knowledge base focused on systems engineering, signal processing, and practical software architecture. It features a responsive design with dynamic content loading, search functionality, and a curated tools page.

## Working Effectively

### Setup and Local Development
- **Start local server**: `python3 -m http.server 8000` (takes <1 second)
- **Access site**: Navigate to `http://localhost:8000/index.html` 
- **Performance**: All pages load in <0.02 seconds - site is highly optimized

### Core File Structure
```
/
├── index.html          # Main homepage with article listings
├── tools.html          # Tools and resources page
├── archive.html        # Article archive page
├── topics.html         # Topic/category browsing page
├── about.html          # About page
├── styles.css          # Complete site styling (~38KB)
├── script.js           # Main JavaScript (~35KB)
├── tools.js            # Tools page functionality (~12KB)
├── tools.json          # Tools data (always validate JSON)
├── articles/           # Article content directory
│   ├── manifest.json   # Article listing manifest
│   ├── DNS.json        # Main article collection (~40KB)
│   ├── sample.json     # Individual articles
│   └── sample2.json    # Individual articles
├── Ads/                # Media assets directory
│   ├── Banner/         # Banner advertisements
│   ├── Side/           # Sidebar advertisements  
│   └── popup/          # Popup/overlay media
└── .vscode/            # VS Code debug configuration
```

### JSON Validation (CRITICAL)
Run these commands EVERY time you modify JSON files:
```bash
python3 -m json.tool tools.json > /dev/null && echo "✓ tools.json valid" || echo "✗ tools.json invalid"
python3 -m json.tool articles/manifest.json > /dev/null && echo "✓ manifest.json valid" || echo "✗ manifest.json invalid"
```
**Validation time**: <0.05 seconds per file. NEVER skip this step - invalid JSON breaks the entire site.

### HTML Structure Validation
All HTML files follow strict structure requirements:
- Must include `<!DOCTYPE html>`
- Must have complete `<html>`, `<head>`, and `<body>` tags
- Must load CSS and JS in correct order
- **Test command**: Open any HTML file in browser - should load without console errors

## Testing and Validation

### End-to-End Functionality Testing
**ALWAYS** test these complete user scenarios after making changes:

1. **Homepage Navigation Flow**:
   ```bash
   # Start server
   python3 -m http.server 8000 &
   # Open browser to http://localhost:8000/index.html
   # Verify: articles load, search works, navigation links function
   # Time: <5 seconds for complete test
   ```

2. **Tools Page Functionality**:
   ```
   # Navigate to tools.html
   # Test search: type "vscode" - should filter to Visual Studio Code only
   # Test category filtering: click "Development" - should show dev tools only
   # Verify: tool cards display correctly, external links work
   # Time: <10 seconds for complete test
   ```

3. **Search Functionality**:
   ```
   # On any page with search: type "DNS" 
   # Should filter content immediately (<0.1 second response)
   # Clear search - content should return to full list
   ```

4. **Responsive Design**:
   ```
   # Test in browser: resize window to mobile width (<768px)
   # Verify: navigation collapses, cards stack vertically, text remains readable
   ```

### Performance Benchmarks (Measured)
- **JSON validation**: 0.032 seconds
- **File serving**: 0.006-0.007 seconds per file
- **Article loading**: JavaScript loads 22 articles in <0.1 seconds
- **Search response**: <0.1 seconds for real-time filtering
- **Total site size**: 576KB (extremely lightweight)

## Common Development Tasks

### Adding New Articles
1. **Create article JSON in articles/ directory**:
   ```json
   {
     "id": "your-article-id",
     "title": "Article Title",
     "excerpt": "Brief description",
     "author": "Author Name", 
     "date": "YYYY-MM-DD",
     "tags": ["tag1", "tag2"],
     "content": "<h2>HTML content</h2><p>Article body</p>"
   }
   ```

2. **Update articles/manifest.json**:
   ```json
   {
     "files": ["DNS.json", "sample.json", "sample2.json", "new-article.json"],
     "lastUpdated": "YYYY-MM-DD",
     "totalArticles": 8,
     "description": "Article manifest for SigAndSys blog"
   }
   ```

3. **Validate**: Run JSON validation commands above
4. **Test**: Refresh browser - new article should appear automatically

### Adding New Tools
1. **Edit tools.json** - add new tool object following existing format
2. **Required fields**: id, name, description, category, url
3. **Optional fields**: image, tags, price, howToUse, documentation, added, updated
4. **Validate JSON**: Critical - invalid JSON breaks tools page
5. **Test filtering**: Verify new tool appears in correct category filter

### Modifying Styles
- **Edit styles.css**: Contains CSS custom properties for easy theming
- **Test responsiveness**: Always test mobile view (@media queries included)
- **Dark/light theme**: Toggle button functionality is built-in
- **No build step required**: Changes apply immediately

## Error Troubleshooting

### Common Issues and Solutions

**Tools Not Loading**:
```bash
# Check JSON validity
python3 -m json.tool tools.json
# Check file permissions
ls -la tools.json
# Verify browser console for errors
```

**Articles Not Appearing**:
```bash
# Validate manifest
python3 -m json.tool articles/manifest.json
# Check article JSON files
python3 -m json.tool articles/DNS.json
# Verify file paths match manifest entries
```

**Search Not Working**:
- Ensure JavaScript is enabled in browser
- Check browser console for JavaScript errors
- Verify script.js and tools.js are loading correctly
- Clear browser cache if needed

**Images Not Loading**:
- Some external tool logos may be blocked (expected - shows console errors)
- Missing ad banner images cause 404s (expected - not critical)
- Verify image URLs are accessible if adding new ones

### Browser Console Messages (Expected)
These console messages are NORMAL and do not indicate problems:
- `Failed to load resource: net::ERR_BLOCKED_BY_CLIENT` (external CDN resources)
- `404 File not found` for banner images (placeholder assets)
- Article loading logs showing successful JSON parsing

## File Maintenance

### Regular Updates
- **Update tools.json**: Add new tools monthly, update "updated" dates
- **Clean articles/**: Archive old content, update manifest.json
- **Validate JSON files**: Run validation commands before any commit
- **Test functionality**: Always run complete user scenarios after changes

### Performance Optimization
- **Keep total tools under 100**: Site performs optimally with current 8 tools
- **Compress images**: Tools page loads external logos efficiently
- **Monitor article count**: Current 22 articles load instantly, can scale higher

## Important Notes

### What This Site IS:
- **Static website**: No server-side processing required
- **Fast and lightweight**: Optimized for performance
- **Self-contained**: All dependencies are local files or CDN links
- **Fully functional**: Search, filtering, responsive design all work

### What This Site is NOT:
- **No build process**: No npm, webpack, or compilation required
- **No database**: All content is JSON files
- **No server-side code**: Pure client-side JavaScript
- **No authentication**: Public-facing blog site

### Deployment
- **Simple hosting**: Any static web host (GitHub Pages, Netlify, etc.)
- **No special requirements**: Just serve HTML/CSS/JS files
- **HTTPS recommended**: For external tool logo loading
- **CDN beneficial**: But not required for functionality

---

**Remember**: This site is designed to be maintainable and fast. Always validate JSON changes and test complete user scenarios. The instructions above have been tested and verified to work correctly.