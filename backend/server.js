// Simple GitHub OAuth token exchange server
// Run with: node backend/server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for your React app
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// GitHub OAuth token exchange endpoint
app.post('/github/token', async (req, res) => {
  const { code, redirect_uri } = req.body;
  
  if (!code) {
    return res.status(400).json({ error: 'Missing authorization code' });
  }

  try {
    // Exchange code for access token
    const response = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: process.env.GITHUB_CLIENT_ID || 'Ov23li58Ju6dqn2Z5W7H',
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: redirect_uri || 'http://localhost:3000'
    }, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (response.data.error) {
      return res.status(400).json({ error: response.data.error_description || response.data.error });
    }

    res.json({ access_token: response.data.access_token });
  } catch (error) {
    console.error('GitHub token exchange error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to exchange token',
      message: error.response?.data?.error_description || error.message
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'GitHub OAuth Proxy' });
});

app.listen(PORT, () => {
  console.log(`🚀 GitHub OAuth proxy running on http://localhost:${PORT}`);
  console.log(`📝 Client ID: ${process.env.GITHUB_CLIENT_ID ? '✅ Set' : '❌ Missing'}`);
  console.log(`📝 Client Secret: ${process.env.GITHUB_CLIENT_SECRET ? '✅ Set' : '❌ Missing'}`);
  if (!process.env.GITHUB_CLIENT_SECRET) {
    console.warn('⚠️  WARNING: GITHUB_CLIENT_SECRET not set. Token exchange will fail.');
    console.warn('💡 Make sure backend/.env exists with GITHUB_CLIENT_SECRET');
  } else {
    console.log('✅ GitHub OAuth proxy ready!');
  }
});

