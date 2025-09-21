# SendGrid API Key Quick Setup Guide

This guide will help you get the SendGrid API key configured in under 5 minutes.

## Step 1: Get Your SendGrid API Key

1. **Sign up** for SendGrid (free tier available):
   - Go to [https://sendgrid.com/](https://sendgrid.com/)
   - Create an account and verify your email

2. **Generate API Key**:
   - Log into SendGrid dashboard
   - Go to **Settings** → **API Keys** 
   - Click **"Create API Key"**
   - Name it `sigandsys-newsletter`
   - Select **"Full Access"** or at minimum **"Marketing"** permissions
   - Click **"Create & View"**
   - **Copy the API key** (you won't be able to see it again!)

## Step 2: Configure for Local Development

Choose **one** of these methods:

### Option A: Using .dev.vars file (Recommended)
```bash
# In the backend directory
cd backend
echo "SENDGRID_API_KEY=your_api_key_here" > .dev.vars
```

### Option B: Using environment variable
```bash
export SENDGRID_API_KEY=your_api_key_here
```

### Option C: Copy from example
```bash
cd backend
cp .env.example .env
# Edit .env and add your API key
```

## Step 3: Test Your Configuration

```bash
# Validate your API key
cd backend
npm run validate-sendgrid

# Start the backend
npm run dev

# In another terminal, test the newsletter endpoint
npm run test-newsletter
```

## Step 4: Configure for Production

### For Cloudflare Workers:
```bash
# Set secret for production
wrangler secret put SENDGRID_API_KEY --env production

# Set secret for staging  
wrangler secret put SENDGRID_API_KEY --env staging
```

### Via Cloudflare Dashboard:
1. Go to **Workers & Pages** → Your Worker → **Settings** → **Variables**
2. Add environment variable: `SENDGRID_API_KEY` = your API key
3. Make sure it's set as **"Encrypted"** (secret)

## Step 5: Verify Everything Works

1. **Start both servers**:
   ```bash
   # Terminal 1 - Backend
   cd backend && npm run dev
   
   # Terminal 2 - Frontend  
   python3 -m http.server 8000
   ```

2. **Test the newsletter**:
   - Open http://localhost:8000
   - Click "Subscribe" button
   - Enter an email and submit
   - You should see success message!

## Troubleshooting

### "SendGrid not configured" error
- Check that `SENDGRID_API_KEY` is set
- Run `npm run validate-sendgrid` to test

### "Invalid API key" error  
- Verify your API key is correct
- Make sure it has Marketing permissions
- Regenerate the key if needed

### "Marketing API access limited" warning
- Your API key needs Marketing permissions
- Create a new key with Full Access or Marketing permissions

## Quick Commands Reference

```bash
# Validate SendGrid setup
npm run validate-sendgrid

# Test newsletter locally
npm run test-newsletter  

# Check backend logs
# (look at wrangler dev terminal output)

# Deploy with secrets
wrangler deploy --env production
```

## Need Help?

1. Check the validation script output: `npm run validate-sendgrid`
2. Look at backend console logs when testing
3. Verify API key permissions in SendGrid dashboard
4. See the comprehensive guide: `NEWSLETTER_SETUP.md`