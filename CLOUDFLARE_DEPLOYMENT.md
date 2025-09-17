# Cloudflare Deployment Guide

## Overview

This guide covers the deployment of SigAndSys to Cloudflare's ecosystem using Pages for frontend hosting and Workers for backend API services.

## Prerequisites

- Node.js v20+ (✅ Verified: v20.19.5)
- Wrangler CLI v3+ (✅ Installed: v3.114.14)
- Cloudflare account with API tokens
- GitHub repository access

## Project Structure

```
sigandsys/
├── frontend/           # Static site files for Cloudflare Pages
│   ├── index.html     # Main homepage
│   ├── *.html         # Other pages (about, tools, topics, archive)
│   ├── styles.css     # Stylesheet
│   ├── script.js      # Frontend JavaScript
│   ├── tools.js       # Tools page functionality
│   ├── articles/      # Article content and manifests
│   └── Ads/           # Media assets
├── backend/           # Cloudflare Workers API
│   ├── src/
│   │   └── index.js   # Worker entry point
│   ├── package.json   # Backend dependencies
│   └── wrangler.toml  # Worker configuration
├── .github/
│   └── workflows/
│       └── deploy.yml # CI/CD pipeline
├── package.json       # Root project configuration
└── .gitignore         # Git ignore rules
```

## Setup Instructions

### 1. Environment Setup

```bash
# Install dependencies
npm install

# Install backend dependencies
cd backend && npm install
```

### 2. Cloudflare Configuration

#### Required Secrets (GitHub Actions)
- `CLOUDFLARE_API_TOKEN`: Cloudflare API token with Pages and Workers permissions
- `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID

#### Cloudflare Pages Setup
1. Connect GitHub repository to Cloudflare Pages
2. Set build settings:
   - **Build command**: None (static site)
   - **Build output directory**: `frontend`
   - **Root directory**: `frontend`

### 3. Local Development

#### Frontend Development
```bash
# Serve static files locally (development)
npx wrangler pages dev frontend

# Or use any static server
cd frontend && python -m http.server 8000
```

#### Backend Development
```bash
# Start Workers dev server
cd backend && npm run dev
# or
cd backend && npx wrangler dev
```

### 4. Deployment

#### Automatic Deployment (Recommended)
- Push to `main` branch triggers automatic deployment via GitHub Actions
- Frontend deploys to Cloudflare Pages
- Backend deploys to Cloudflare Workers

#### Manual Deployment
```bash
# Deploy frontend
npx wrangler pages deploy frontend

# Deploy backend
cd backend && npm run deploy
```

## Current Implementation Status

### ✅ Completed
- [x] Repository structure separation (frontend/backend)
- [x] Package.json configuration with Node.js v20+ requirement
- [x] Wrangler CLI setup and configuration
- [x] Basic Workers API structure with CORS and health endpoints
- [x] GitHub Actions workflow for automated deployment
- [x] .gitignore configuration for Cloudflare artifacts
- [x] Frontend remains fully functional as static site

### 🔄 In Progress
- [ ] Cloudflare Pages project connection (requires manual setup)
- [ ] API token configuration (requires manual setup)
- [ ] First deployment testing

### 📋 Future Enhancements
- [ ] Database integration (D1, KV, or Durable Objects)
- [ ] Authentication system (Cloudflare Access or third-party)
- [ ] Performance monitoring and analytics
- [ ] Advanced API endpoints for article management
- [ ] CDN optimization for media assets

## Migration Benefits

### From Previous Setup
- **Improved Performance**: Cloudflare's global CDN network
- **Better Scalability**: Workers auto-scale based on demand
- **Enhanced Security**: Built-in DDoS protection and security features
- **Cost Optimization**: Pay-per-use pricing model
- **Simplified Deployment**: Git-based deployment workflow

### Compatibility
- All existing frontend functionality preserved
- Static article loading via JSON files maintained
- Search and navigation features remain unchanged
- Theme switching and responsive design intact

## Troubleshooting

### Common Issues

1. **Wrangler not found**
   ```bash
   npm install -g wrangler
   # or use npx
   npx wrangler --version
   ```

2. **Node.js version mismatch**
   ```bash
   node --version  # Should be 20+
   nvm use 20     # If using nvm
   ```

3. **Build failures**
   - Check that all dependencies are installed
   - Verify file paths in configuration
   - Review GitHub Actions logs for detailed errors

## Next Steps

1. **Manual Cloudflare Setup**: Connect repository to Cloudflare Pages dashboard
2. **Configure Secrets**: Add API tokens to GitHub repository secrets
3. **Test Deployment**: Trigger first deployment and verify functionality
4. **Custom Domain**: Configure custom domain in Cloudflare dashboard
5. **Monitor Performance**: Set up analytics and monitoring

## Support

For deployment issues:
1. Check GitHub Actions workflow logs
2. Review Wrangler CLI documentation: https://developers.cloudflare.com/workers/wrangler/
3. Consult Cloudflare Pages documentation: https://developers.cloudflare.com/pages/