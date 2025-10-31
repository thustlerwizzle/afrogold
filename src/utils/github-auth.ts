// GitHub OAuth Authentication
// Get credentials from: https://github.com/settings/developers

export interface GitHubUser {
  id: number;
  login: string;
  name: string;
  email: string;
  avatar_url: string;
}

const GITHUB_CLIENT_ID = process.env.REACT_APP_GITHUB_CLIENT_ID || '';
const GITHUB_REDIRECT_URI = process.env.REACT_APP_GITHUB_REDIRECT_URI || `${window.location.origin}/auth/github/callback`;

export function getGitHubAuthUrl(): string {
  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: GITHUB_REDIRECT_URI,
    scope: 'user:email',
    state: generateState()
  });
  
  // Store state for verification
  sessionStorage.setItem('github_oauth_state', params.get('state') || '');
  
  return `https://github.com/login/oauth/authorize?${params.toString()}`;
}

export function handleGitHubCallback(): Promise<GitHubUser | null> {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const state = urlParams.get('state');
  const storedState = sessionStorage.getItem('github_oauth_state');
  
  if (!code || state !== storedState) {
    return Promise.resolve(null);
  }
  
  sessionStorage.removeItem('github_oauth_state');
  
  // Exchange code for token (requires backend or use proxy)
  return exchangeCodeForToken(code)
    .then(token => getUserInfo(token))
    .catch(() => null);
}

async function exchangeCodeForToken(code: string): Promise<string> {
  // Option 1: Use a backend endpoint (recommended)
  // Option 2: Use a public proxy (for demo only - not secure for production)
  const backendUrl = process.env.REACT_APP_GITHUB_AUTH_PROXY || '';
  
  if (backendUrl) {
    const res = await fetch(`${backendUrl}/github/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, redirect_uri: GITHUB_REDIRECT_URI })
    });
    const data = await res.json();
    return data.access_token;
  }
  
  // Fallback: Direct exchange (requires client_secret - only for server-side)
  // This won't work from browser due to CORS - you need a backend
  throw new Error('GitHub token exchange requires backend endpoint');
}

async function getUserInfo(token: string): Promise<GitHubUser> {
  const res = await fetch('https://api.github.com/user', {
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  });
  
  if (!res.ok) throw new Error('Failed to fetch user info');
  
  const user = await res.json();
  
  // Get email if not public
  let email = user.email;
  if (!email) {
    const emailsRes = await fetch('https://api.github.com/user/emails', {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    const emails = await emailsRes.json();
    email = emails.find((e: any) => e.primary)?.email || emails[0]?.email || '';
  }
  
  return {
    id: user.id,
    login: user.login,
    name: user.name || user.login,
    email: email || `${user.login}@users.noreply.github.com`,
    avatar_url: user.avatar_url
  };
}

function generateState(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

