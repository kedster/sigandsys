# SigAndSys Backend API

This directory contains the Cloudflare Workers backend API for the SigAndSys blog platform.

## Structure

```
backend/
├── src/
│   └── index.js        # Main Worker entry point
├── package.json        # Dependencies and scripts
├── wrangler.toml       # Cloudflare Workers configuration
└── README.md           # This file
```

## Current Features

- **Health Check Endpoint**: `/health` - Returns API status
- **API Information**: `/` - Lists available endpoints
- **CORS Support**: Configured for frontend communication
- **Environment Variables**: Development/production configuration

## API Endpoints

### GET /
Returns API information and available endpoints.

### GET /health
Health check endpoint with timestamp and environment info.

### GET /articles (Future)
Will handle article management operations.

## Development

### Prerequisites
- Node.js v20+
- Wrangler CLI v3+

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev
# or
npx wrangler dev
```

The API will be available at `http://localhost:8787`

### Testing
```bash
# Test health endpoint
curl http://localhost:8787/health

# Test main endpoint
curl http://localhost:8787/
```

## Deployment

### Automatic Deployment
Deployment is handled via GitHub Actions when changes are pushed to the main branch.

### Manual Deployment
```bash
# Deploy to production
npm run deploy

# Deploy to staging
npm run deploy:staging
```

## Configuration

### Environment Variables
- `ENVIRONMENT`: Current environment (development/production)
- `SENDGRID_API_KEY`: SendGrid API key for newsletter functionality

### SendGrid Setup
For quick SendGrid configuration, see the [SendGrid Quick Start Guide](../SENDGRID_QUICKSTART.md).

For comprehensive setup instructions, see [Newsletter Setup Guide](../NEWSLETTER_SETUP.md).

### Local Development Environment Variables
Create a `.dev.vars` file in the backend directory:
```
SENDGRID_API_KEY=your_sendgrid_api_key_here
```

Or copy from the example:
```bash
cp .env.example .env
# Edit .env with your values
```

### Validation Scripts
```bash
# Test your SendGrid API key configuration
npm run validate-sendgrid

# Test newsletter endpoint locally
npm run test-newsletter
```

## Future Enhancements

### Planned Features
- **Article Management**: CRUD operations for blog articles
- **Analytics**: Usage tracking and insights
- **Authentication**: API key or OAuth integration
- **Content Processing**: Article parsing and optimization
- **Search**: Full-text search capabilities

### Storage Options
- **KV Storage**: For configuration and caching
- **D1 Database**: For relational data (articles, users)
- **R2 Storage**: For media assets
- **Durable Objects**: For real-time features

## Security

- CORS configured for frontend domain
- Input validation on all endpoints
- Rate limiting (to be implemented)
- API authentication (to be implemented)