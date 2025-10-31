# Deployment Guide

This app can be automatically deployed to multiple platforms:

## Option 1: Netlify (Recommended)

1. **Via Netlify Dashboard:**
   - Go to https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Connect your Git repository
   - Build command: `npm run build`
   - Publish directory: `build`
   - Click "Deploy site"
   - Netlify will automatically deploy on every push to main/master

2. **Via Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   netlify login
   npm run build
   npm run deploy:netlify
   ```

## Option 2: Vercel (Recommended)

1. **Via Vercel Dashboard:**
   - Go to https://vercel.com
   - Click "Add New Project"
   - Import your Git repository
   - Framework Preset: Create React App
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Click "Deploy"
   - Vercel will automatically deploy on every push

2. **Via Vercel CLI:**
   ```bash
   npm install -g vercel
   vercel login
   npm run build
   npm run deploy:vercel
   ```

## Option 3: GitHub Actions (Auto-deploy on push)

1. Set up secrets in your GitHub repo:
   - Go to Settings → Secrets → Actions
   - Add `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID` (if using Netlify)
   - The workflow will auto-deploy on every push to main/master

## Quick Deploy (Current Build)

If you want to deploy the existing build folder right now:

**Netlify:**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=build
```

**Vercel:**
```bash
npm install -g vercel
vercel --prod
```

## Environment Variables

Make sure to set these in your deployment platform:
- `REACT_APP_HEDERA_TESTNET_RPC` (if needed)
- Any other API keys or config variables

## Notes

- Both Netlify and Vercel offer free tiers
- Automatic HTTPS is included
- Custom domains can be added
- Both platforms support branch previews for PRs

