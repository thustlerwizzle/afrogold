import React, { useEffect } from 'react';
import { useAuth } from './Auth';
import { handleGitHubCallback } from '../utils/github-auth';

const GitHubCallback: React.FC = () => {
  const { login } = useAuth();

  useEffect(() => {
    const authenticate = async () => {
      const githubUser = await handleGitHubCallback();
      
      if (githubUser) {
        // Save user profile
        const users = JSON.parse(localStorage.getItem('afg_users') || '[]');
        const others = users.filter((x: any) => x.email?.toLowerCase() !== githubUser.email.toLowerCase());
        others.push({
          email: githubUser.email,
          name: githubUser.name,
          address: '', // GitHub doesn't provide wallet address
          isHost: false,
          provider: 'github',
          githubId: githubUser.id,
          avatar_url: githubUser.avatar_url
        });
        localStorage.setItem('afg_users', JSON.stringify(others));

        // Login user
        login({
          address: '',
          email: githubUser.email,
          name: githubUser.name,
          isHost: false,
          provider: 'github'
        });

        // Redirect to home (remove callback params from URL)
        window.history.replaceState({}, document.title, window.location.pathname);
      } else {
        alert('GitHub authentication failed');
      }
    };

    authenticate();
  }, [login]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div>
        <h2>Completing GitHub authentication...</h2>
        <p>Please wait...</p>
      </div>
    </div>
  );
};

export default GitHubCallback;

