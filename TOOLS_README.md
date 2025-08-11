# Tools Page - User Guide

## Overview
The Tools page (`tools.html`) is a dynamic resource hub that displays tools, resources, and processes I use for systems engineering and development. It loads content from a JSON file and provides filtering, search, and categorization capabilities.

## Features

### 1. **Dynamic Content Loading**
- Tools are loaded from `tools.json` file
- Supports images, descriptions, categories, and usage notes
- Automatically updates when the JSON file is modified

### 2. **Categorization System**
- **Development**: Code editors, IDEs, development tools
- **Monitoring**: Observability, metrics, logging tools
- **Design**: UI/UX, diagramming, prototyping tools
- **Productivity**: Project management, documentation, workflow tools

### 3. **Search & Filtering**
- Real-time search across tool names, descriptions, and tags
- Category-based filtering
- Tag-based organization

### 4. **Responsive Design**
- Mobile-friendly layout
- Adaptive grid system
- Touch-friendly interactions

## Adding New Tools

### JSON Structure
Each tool in `tools.json` should follow this structure:

```json
{
  "id": "unique-tool-id",
  "name": "Tool Name",
  "description": "Brief description of what the tool does",
  "category": "development|monitoring|design|productivity",
  "url": "https://tool-website.com",
  "image": "https://tool-logo-url.com/logo.png",
  "tags": ["tag1", "tag2", "tag3"],
  "price": "Free|Paid|Free (Basic)",
  "howToUse": "Description of how I personally use this tool",
  "documentation": "https://docs.tool-website.com",
  "added": "2025-01-01",
  "updated": "2025-01-15"
}
```

### Required Fields
- `id`: Unique identifier (used for internal references)
- `name`: Tool name (displayed as title)
- `description`: What the tool does
- `category`: Must be one of the predefined categories
- `url`: Link to the tool's website

### Optional Fields
- `image`: Logo or screenshot URL
- `tags`: Array of relevant keywords
- `price`: Cost information
- `howToUse`: Personal usage notes
- `documentation`: Link to official docs
- `added`: Date first added (YYYY-MM-DD)
- `updated`: Last update date (YYYY-MM-DD)

### Example Tool Entry
```json
{
  "id": "vscode",
  "name": "Visual Studio Code",
  "description": "My primary code editor for all development work. Excellent extensions ecosystem and built-in Git integration.",
  "category": "development",
  "url": "https://code.visualstudio.com/",
  "image": "https://code.visualstudio.com/assets/images/code-stable.png",
  "tags": ["editor", "ide", "extensions", "git"],
  "price": "Free",
  "howToUse": "I use it with extensions like GitLens, Python, Docker, and REST Client. The integrated terminal and Git features save me hours daily.",
  "documentation": "https://code.visualstudio.com/docs",
  "added": "2025-01-01",
  "updated": "2025-01-15"
}
```

## Managing the Tools List

### Adding Tools
1. Open `tools.json` in a text editor
2. Add a new tool object following the structure above
3. Save the file
4. Refresh the Tools page to see changes

### Updating Tools
1. Modify the relevant fields in `tools.json`
2. Update the `updated` date field
3. Save and refresh

### Removing Tools
1. Delete the tool object from `tools.json`
2. Save the file
3. Refresh the page

### Reordering Tools
Tools are automatically sorted by the `updated` date (newest first). To change the order:
1. Update the `updated` field for tools you want to prioritize
2. Save and refresh

## Image Guidelines

### Supported Formats
- PNG, JPG, JPEG, WebP
- Recommended size: 60x60 pixels (will be scaled automatically)
- Use transparent backgrounds when possible

### Image Sources
- Official tool logos from their websites
- Screenshots of the tool in action
- Custom icons (ensure you have rights to use them)

### Best Practices
- Keep file sizes under 100KB
- Use HTTPS URLs when possible
- Ensure images are accessible (good contrast, readable)

## Category Management

### Adding New Categories
To add a new category:

1. **Update the HTML** in `tools.html`:
   ```html
   <button class="filter-btn" data-category="newcategory">New Category</button>
   ```

2. **Update the sidebar** in `tools.html`:
   ```html
   <div class="category-item">
       <i class="fas fa-icon-name"></i>
       <span>New Category</span>
   </div>
   ```

3. **Update the CSS** in `styles.css` (if needed for specific styling)

### Category Icons
Use Font Awesome icons that represent the category:
- Development: `fa-code`
- Monitoring: `fa-chart-line`
- Design: `fa-palette`
- Productivity: `fa-rocket`

## Troubleshooting

### Tools Not Loading
1. Check that `tools.json` is valid JSON
2. Ensure the file is in the same directory as `tools.html`
3. Check browser console for error messages
4. Verify all required fields are present

### Images Not Displaying
1. Check image URLs are accessible
2. Ensure URLs use HTTPS (if required by your hosting)
3. Verify image formats are supported
4. Check file permissions

### Search/Filter Not Working
1. Ensure JavaScript is enabled
2. Check browser console for errors
3. Verify the `tools.js` file is loading correctly
4. Check that category names match exactly

## Performance Tips

### Large Tool Lists
- Keep the total number of tools under 100 for optimal performance
- Use compressed images
- Consider lazy loading for very long lists

### Regular Maintenance
- Remove outdated tools monthly
- Update tool information quarterly
- Archive old tools instead of deleting them

## Customization

### Styling
- Modify CSS variables in `styles.css` for color schemes
- Adjust spacing and layout in the tools-specific CSS sections
- Customize card layouts and hover effects

### Functionality
- Add new filter categories in `tools.js`
- Implement additional search features
- Add sorting options (by name, date, popularity)

## Support

For issues or questions about the Tools page:
1. Check this README first
2. Review browser console for errors
3. Validate JSON syntax
4. Test with a minimal tool list

---

**Note**: The Tools page is designed to be self-maintaining. Simply update the `tools.json` file to add, modify, or remove tools. The page will automatically reflect changes without requiring code modifications.
