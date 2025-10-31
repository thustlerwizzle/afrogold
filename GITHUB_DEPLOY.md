# GitHub & Netlify Setup Guide

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `afrogold` (or your preferred name)
3. Description: `Luxury stays and transparent infrastructure investing — powered by HBAR on Hedera`
4. Choose **Public** or **Private**
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click **Create repository**

## Step 2: Push to GitHub

After creating the repo, GitHub will show you commands. Run these:

```bash
git remote add origin https://github.com/YOUR_USERNAME/afrogold.git
git branch -M main
git push -u origin main
```

Or if you use SSH:
```bash
git remote add origin git@github.com:YOUR_USERNAME/afrogold.git
git branch -M main
git push -u origin main
```

## Step 3: Connect to Netlify

### Option A: Via Netlify Dashboard (Recommended)

1. Go to https://app.netlify.com
2. Click **Add new site** → **Import an existing project**
3. Choose **GitHub**
4. Authorize Netlify to access your GitHub account
5. Select your `afrogold` repository
6. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `build`
7. Click **Deploy site**

### Option B: Via Netlify CLI

```bash
# Link your local site to Netlify
netlify link

# This will let you connect to the existing site or create a new one
```

## Step 4: Set Environment Variables on Netlify

1. Go to your Netlify site dashboard: https://app.netlify.com/sites/afrogold-app
2. Navigate to **Site configuration** → **Environment variables**
3. Add these variables:
   - `REACT_APP_GITHUB_CLIENT_ID=Ov23li58Ju6dqn2Z5W7H`
   - `REACT_APP_GITHUB_REDIRECT_URI=https://afrogold-app.netlify.app`
   - `REACT_APP_GITHUB_AUTH_PROXY` (if using Netlify function, leave empty or use function URL)

4. For the GitHub OAuth function, set:
   - `GITHUB_CLIENT_ID=Ov23li58Ju6dqn2Z5W7H`
   - `GITHUB_CLIENT_SECRET=b1c6dcfb0fdf10d0472512c339a506a924c3238b`

## Step 5: Enable Automatic Deployments

Once connected:
- **Production branch**: `main` (auto-deploys on push)
- **Pull Request previews**: Enabled automatically
- Every push to `main` will trigger a new production deployment

## Current Deploy Status

✅ **Your site is already live**: https://afrogold-app.netlify.app

After connecting GitHub, future deployments will happen automatically on every push!

## Troubleshooting

- **Build fails**: Check Netlify build logs
- **Environment variables not loading**: Make sure they're set in Netlify dashboard
- **GitHub OAuth not working**: Verify function is deployed and secrets are set

