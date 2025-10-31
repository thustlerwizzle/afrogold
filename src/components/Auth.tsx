import React, { useState, useEffect } from 'react';
import './Auth.css';
import { initFirebaseIfPossible, getAuthOrNull, getGoogleProviderOrNull } from '../firebase';

interface User {
  address: string;
  email: string;
  name: string;
  isHost: boolean;
  provider?: 'local' | 'metamask' | 'google' | 'github';
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored user data on app load
    const storedUser = localStorage.getItem('ethereus_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('ethereus_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ethereus_user');
    localStorage.removeItem('ethereus_bookings');
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// MetaMask Integration Component
export const MetaMaskLogin: React.FC = () => {
  const { login } = useAuth();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isHost, setIsHost] = useState<boolean>(false);

  const connectMetaMask = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found. Please connect your MetaMask wallet.');
      }

      const address = accounts[0];

      const userData: User = {
        address,
        email: '',
        name: `User ${address.slice(0, 8)}`,
        isHost,
        provider: 'metamask'
      };

      login(userData);
    } catch (err: any) {
      setError(err.message || 'Failed to connect to MetaMask');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="metamask-login">
      <div className="form-group checkbox-group" style={{ marginBottom: 10 }}>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={isHost}
            onChange={(e) => setIsHost(e.target.checked)}
          />
          <span className="checkmark"></span>
          I am a host (list properties)
        </label>
      </div>
      <button
        className="metamask-button"
        onClick={connectMetaMask}
        disabled={isConnecting}
      >
        {isConnecting ? (
          <>
            <span className="spinner"></span>
            Connecting...
          </>
        ) : (
          <>
            <span className="metamask-icon">🦊</span>
            Connect with MetaMask
          </>
        )}
      </button>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

// Login Form Component
export const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    walletAddress: '',
    isHost: false,
    password: ''
  });
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [error, setError] = useState<string | null>(null);

  const saveUserProfile = (u: User & { password?: string }) => {
    const users = JSON.parse(localStorage.getItem('afg_users') || '[]');
    const others = users.filter((x: any) => x.email?.toLowerCase() !== u.email.toLowerCase());
    others.push({ ...u, password: undefined, passwordHash: u.password ? btoa(u.password) : undefined, provider: u.provider || 'local' });
    localStorage.setItem('afg_users', JSON.stringify(others));
  };

  const findUserByEmail = (email: string): any | null => {
    const users = JSON.parse(localStorage.getItem('afg_users') || '[]');
    return users.find((x: any) => (x.email || '').toLowerCase() === email.toLowerCase()) || null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'register') {
      if (!formData.email || !formData.name || !formData.password) {
        setError('Please fill in email, name, and password');
        return;
      }
      const existing = findUserByEmail(formData.email);
      if (existing) {
        setError('An account with this email already exists. Please log in.');
        return;
      }
      const newUser: User = {
        address: formData.walletAddress || '',
        email: formData.email,
        name: formData.name,
        isHost: formData.isHost,
        provider: 'local'
      };
      saveUserProfile({ ...newUser, password: formData.password });
      login(newUser);
      return;
    }

    // login mode
    if (!formData.email || !formData.password) {
      setError('Please enter email and password');
      return;
    }
    const existing = findUserByEmail(formData.email);
    if (!existing) {
      setError('No account found. Please register.');
      return;
    }
    if ((existing.passwordHash || '') !== btoa(formData.password)) {
      setError('Incorrect password');
      return;
    }
    const userData: User = {
      address: existing.address || formData.walletAddress || '',
      email: existing.email,
      name: existing.name,
      isHost: !!existing.isHost,
      provider: existing.provider || 'local'
    };
    login(userData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return null; // Disabled: MetaMask-only auth
};
