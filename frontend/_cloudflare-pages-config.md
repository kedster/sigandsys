# Cloudflare Pages Configuration

## Project Settings
- **Project Name**: sigandsys
- **Production Branch**: main
- **Build Output Directory**: frontend (or root if using direct deployment)
- **Build Command**: None (static site)
- **Root Directory**: frontend

## Environment Variables
No environment variables required for the frontend deployment.

## Custom Domains
Configure custom domain in Cloudflare Pages dashboard after initial deployment.

## Build Settings
The site is fully static and requires no build process. All assets are served directly from the frontend directory.

## Deployment Notes
- Frontend assets are located in the `/frontend` directory
- No build step required - direct static file serving
- All articles are loaded dynamically via JSON files
- Images and media are served from the `/frontend/Ads` directory structure