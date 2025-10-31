# GitHub OAuth Backend Server

Simple Express server to handle GitHub OAuth token exchange (required because client secret cannot be exposed in frontend).

## Setup

1. **Install dependencies:**
   ```bash
   cd backend
   npm install express cors axios
   ```

2. **Get your GitHub Client Secret:**
   - Go to https://github.com/settings/developers
   - Click on your OAuth App
   - Copy the **Client Secret**

3. **Create `.env` file in `backend/` folder:**
   ```env
   GITHUB_CLIENT_ID=Ov23li58Ju6dqn2Z5W7H
   GITHUB_CLIENT_SECRET=your_client_secret_here
   PORT=3001
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start the server:**
   ```bash
   node server.js
   ```

   Or use the npm script from root:
   ```bash
   npm run backend
   ```

5. **Update frontend `.env` file:**
   Add this to your root `.env`:
   ```env
   REACT_APP_GITHUB_AUTH_PROXY=http://localhost:3001
   ```

## Production Deployment

For production, deploy this backend to:
- **Netlify Functions** (see `netlify/functions/github-auth.js` example)
- **Vercel Functions** (see `api/github-auth.js` example)
- **Heroku/Railway/Render** (deploy as Express app)
- **AWS Lambda / Serverless**

Then update `REACT_APP_GITHUB_AUTH_PROXY` to your production backend URL.

## Security Notes

- Never commit `.env` files with secrets
- Client secret must remain server-side only
- Use HTTPS in production
- Consider rate limiting for production

