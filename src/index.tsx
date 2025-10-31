import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { initFirebaseIfPossible } from './firebase';
import reportWebVitals from './reportWebVitals';
import { getCompleteProjectList, validateProjectImages } from './data/projects';

// Configure background image; set a vivid skyline default if not present
try {
  const bgUrl = localStorage.getItem('app_bg_url');
  const defaultUrl = 'https://500px.com/photo/1000800562/times-square-at-night-by-andreas-steffelmaier';
  const finalUrl = bgUrl || defaultUrl;
  if (!bgUrl) localStorage.setItem('app_bg_url', finalUrl);
  document.body.style.setProperty('--app-bg-image', `url('${finalUrl}')`);
} catch {}

// Validate that all projects have images assigned
try {
  const projects = getCompleteProjectList();
  const result = validateProjectImages(projects);
  if (!result.ok) {
    // Log any missing image assignments; these should be zero after deterministic mapping
    // This does not affect UI rendering.
    console.warn('Projects missing images:', result.missing);
  }
} catch {}

// Firebase config bootstrap from localStorage.afg_firebase_config
try {
  const raw = localStorage.getItem('afg_firebase_config');
  if (raw) {
    const cfg = JSON.parse(raw);
    (window as any).AFG_FIREBASE_CONFIG = cfg;
    initFirebaseIfPossible(cfg);
  }
} catch {}

// Ensure contract addresses exist in localStorage; set/merge defaults if missing
try {
  const key = 'afg_contracts';
  const current = localStorage.getItem(key);
  const defaults = {
    registry: '0xb1F616b8134F602c3Bb465fB5b5e6565cCAd37Ed', // ERC721Token (AfroGoldInvestBooking)
    marketplace: '0xd4b3a283178fe3d5deb067a99d77fd4cf150daf4'
  };
  if (!current) {
    localStorage.setItem(key, JSON.stringify(defaults));
  } else {
    try {
      const obj = JSON.parse(current);
      const merged = { ...defaults, ...obj, registry: defaults.registry };
      localStorage.setItem(key, JSON.stringify(merged));
    } catch {
      localStorage.setItem(key, JSON.stringify(defaults));
    }
  }
} catch {}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
