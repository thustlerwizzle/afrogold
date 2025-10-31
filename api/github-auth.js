// Vercel Serverless Function for GitHub OAuth token exchange
// Deploy to: api/github-auth.js

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { code, redirect_uri } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Missing authorization code' });
  }

  try {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID || 'Ov23li58Ju6dqn2Z5W7H',
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: redirect_uri || 'http://localhost:3000'
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(400).json({ 
        error: data.error_description || data.error 
      });
    }

    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    res.status(200).json({ access_token: data.access_token });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to exchange token',
      message: error.message
    });
  }
}

